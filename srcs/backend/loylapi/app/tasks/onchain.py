from __future__ import annotations
import asyncio
import base58
from app.celery_app import celery
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.models.transactions import SwapTx
from app.models.wallet import Wallet
from app.models.token import Token
from app.services.transfer_exec import redeem_token, earn_token
from app.core.settings import settings
from logging import getLogger

logger = getLogger(__name__)

@celery.task(name="onchain.swap", bind=True, max_retries=3)
def swap_task(self, swap_tx_id: str) -> None:
    """
    Celery task: perform a two-step on-chain swap of Token A → LOYL → Token B.

    1) User transfers 'from_amount' of Token A to platform (redeem_transfer).
    2) Platform transfers 'to_amount' of Token B to user     (earn_transfer).
    3) Persist the final Solana signature on SwapTx.sol_sig.

    Retries up to 3 times on failure, with 10s backoff.
    """

    async def _run():
        async with AsyncSessionLocal() as session:  # type: AsyncSession
            # 1) Load SwapTx
            swap: SwapTx | None = await session.get(SwapTx, swap_tx_id)

            if swap.sol_sig:
                logger.warning(f"Swap {swap_tx_id} already processed")
                return
            if not swap.from_amount or not swap.to_amount:
                raise ValueError(
                    f"Invalid swap amounts: {swap.from_amount}, {swap.to_amount}")

            logger.info(f"Processing swap: {swap_tx_id}")
            if swap is None:
                raise ValueError(f"SwapTx {swap_tx_id} not found")

            # 2) Fetch user wallet
            result = await session.execute(
                select(Wallet).where(Wallet.user_id == swap.user_id)
            )
            wallet = result.scalar_one_or_none()
            logger.info(f"User wallet: {wallet.pubkey}")
            if wallet is None:
                raise ValueError(f"Wallet for user {swap.user_id} not found")

            # 3) Fetch tokens
            from_token = await session.get(Token, swap.from_token_id)
            to_token = await session.get(Token, swap.to_token_id)
            if from_token is None or to_token is None:
                raise ValueError("Token(s) for swap not found")

            # 4) Step 1: user → platform for Token A
            #    Platform pubkey = treasury keypair's pubkey
            platform_pubkey = str(settings.treasury_kp.pubkey())

            try:
                sig1 = redeem_token(
                    user_pubkey=wallet.pubkey,
                    mint=str(from_token.mint),
                    business_pubkey=platform_pubkey,
                    amount=int(swap.from_amount),
                )
            except Exception as e:
                logger.error(f"redeem_token failed: {e}")
                raise self.retry(exc=exc, countdown=10, queue="onchain")
            logger.info(f"Redeem sig: {sig1}")

            # 5) Step 2: platform → user for Token B
            #    Need business_kp in Base58 format for earn_transfer
            #    Here we assume platform uses same treasury for all earn
            treasury_bytes = settings.treasury_kp.to_bytes()
            treasury_b58 = base58.b58encode(treasury_bytes).decode("utf-8")
            try:
                sig2 = earn_token(
                    mint=str(to_token.mint),
                    user_pubkey=wallet.pubkey,
                    business_kp_b58=treasury_b58,
                    amount=int(swap.to_amount),
                )
            except Exception as e:
                logger.error(f"earn_token failed: {e}")
                raise self.retry(exc=exc, countdown=10, queue="onchain")
            logger.info(f"Earn sig: {sig2}")

            # 6) Persist the signature of the final transfer
            swap.sol_sig = sig2
            swap.sol_sig_redeem = sig1
            session.add(swap)
            await session.commit()

    try:
        asyncio.run(_run())
    except Exception as exc:
        # retry in 10 seconds on failure
        raise self.retry(exc=exc, countdown=10, queue="onchain")
