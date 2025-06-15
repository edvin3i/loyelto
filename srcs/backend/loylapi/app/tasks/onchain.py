from __future__ import annotations

import asyncio
from typing import cast

from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession  # noqa: F401

from app.celery_app import celery
from app.db.session import AsyncSessionLocal
from app.models import SwapTx, TxStatus, Wallet, Token
import base58
from solders.pubkey import Pubkey

from app.core.settings import settings
from app.services.transfer_exec import (
    redeem_token_pda,
    earn_token_pda,
)
from app.services.pubsub import publish
from app.services.celery_wrapper import log_task
from logging import getLogger

logger = getLogger(__name__)


@celery.task(name="onchain.swap", bind=True, max_retries=3)
@log_task
def swap_task(self, swap_tx_id: str) -> None:
    """
    Celery task: perform a two-step on-chain swap of Token A → LOYL → Token B.

    1) User transfers 'from_amount' of Token A to platform (redeem_transfer).
    2) Platform transfers 'to_amount' of Token B to user     (earn_transfer).
    3) Persist the final Solana signature on SwapTx.sol_sig.

    Retries up to 3 times on failure, with 10s backoff.
    """

    async def _run_swap() -> None:
        await publish(f"swap:{swap_tx_id}", {"swap_id": swap_tx_id, "event": "pending"})
        async with AsyncSessionLocal() as session:  # type: AsyncSession
            # 1) Load SwapTx
            swap = await session.get(SwapTx, swap_tx_id)
            if swap is None:
                raise ValueError(f"SwapTx {swap_tx_id} not found")
            if swap.sol_sig is not None:
                logger.warning(f"Swap {swap_tx_id} already processed")
                return

            # 2) Validate amounts and cast to int
            from_amt = cast(int, swap.from_amount)
            to_amt = cast(int, swap.to_amount)
            if from_amt <= 0 or to_amt <= 0:
                raise ValueError(f"Invalid swap amounts: {from_amt}, {to_amt}")
            logger.info(f"Processing swap {swap_tx_id}: {from_amt}→{to_amt}")

            # 3) Fetch user wallet
            q = await session.execute(
                select(Wallet).where(Wallet.user_id == swap.user_id)
            )
            wallet = q.scalar_one_or_none()
            if wallet is None:
                raise ValueError(f"Wallet for user {swap.user_id} not found")
            logger.info(f"User wallet: {wallet.pubkey}")

            # 4) Load token records
            from_token = await session.get(Token, swap.from_token_id)
            to_token = await session.get(Token, swap.to_token_id)
            if from_token is None or to_token is None:
                raise ValueError("Token(s) for swap not found")

            # 5) Step 1: user → platform for Token A
            mint_from_pk = Pubkey.from_string(str(from_token.mint))
            pda_from, _ = Pubkey.find_program_address(
                [b"treasury", bytes(mint_from_pk)],
                Pubkey.from_string(settings.LOYL_TOKEN_PROGRAM_ID),
            )
            sig_redeem = redeem_token_pda(
                mint=str(from_token.mint),
                user_pubkey=wallet.pubkey,
                business_pda=str(pda_from),
                amount=from_amt,
            )
            logger.info(f"Redeem signature: {sig_redeem}")

            # 6) Step 2: platform → user for Token B
            mint_to_pk = Pubkey.from_string(str(to_token.mint))
            pda_to, _ = Pubkey.find_program_address(
                [b"treasury", bytes(mint_to_pk)],
                Pubkey.from_string(settings.LOYL_TOKEN_PROGRAM_ID),
            )
            treasury_b58 = base58.b58encode(settings.treasury_kp.to_bytes()).decode(
                "utf-8"
            )
            sig_earn = earn_token_pda(
                mint=str(to_token.mint),
                user_pubkey=wallet.pubkey,
                business_pda=str(pda_to),
                treasury_kp_b58=treasury_b58,
                amount=to_amt,
            )
            logger.info(f"Earn signature: {sig_earn}")

            # 7) Persist signatures and status
            swap.sol_sig = sig_earn
            swap.sol_sig_redeem = sig_redeem
            swap.status = TxStatus.SUCCESS
            await session.commit()

            await publish(
                f"swap:{swap_tx_id}", {"swap_id": swap_tx_id, "event": "success"}
            )

    try:
        asyncio.run(_run_swap())
    except Exception as exc:
        logger.error(f"Swap {swap_tx_id} failed: {exc}", exc_info=True)
        asyncio.run(
            publish(f"swap:{swap_tx_id}", {"swap_id": swap_tx_id, "event": "failed"})
        )
        raise self.retry(exc=exc, countdown=10, queue="onchain")
