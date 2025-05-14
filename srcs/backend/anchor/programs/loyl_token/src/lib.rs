import base58
from pathlib import Path
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.system_program import ID as SYS_PROGRAM_ID
from solders.sysvar import SYSVAR_RENT_PUBKEY
from anchorpy import Provider, Wallet, Idl, Program
from solana.rpc.async_api import AsyncClient
from spl.token.constants import TOKEN_2022_PROGRAM_ID
from spl.token.instructions import get_associated_token_address
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.settings import settings
from app.db.session import AsyncSessionLocal as SessionMaker
from app.models import Business, Token

# Path to your IDL for the loyalty_token program
IDL_PATH = settings.root / "anchor" / "target" / "idl" / "loyalty_token.json"
LOYALTY_PROGRAM_ID = Pubkey.from_string("LoyL111111111111111111111111111111111111111")


async def mint_and_record(business_id: str) -> None:
    """
    1) Creates a new SPL-2022 mint on-chain (via PDA mint authority),
       mints `initial_supply` to the business ATA, and
    2) Persists a Token record in Postgres.
    """
    async with SessionMaker() as db:  # type: AsyncSession
        # --- load business & owner keypair ----------------------------
        biz: Business | None = await db.get(Business, business_id)
        if biz is None:
            raise ValueError(f"Business {business_id} not found")

        owner_kp = Keypair.from_bytes(base58.b58decode(biz.owner_privkey))

        # --- prepare Anchor client -------------------------------------
        client = AsyncClient(settings.SOLANA_RPC_URL)
        provider = Provider(client, Wallet(owner_kp))
        idl = Idl.from_json(IDL_PATH.read_text())
        program = Program(idl, LOYALTY_PROGRAM_ID, provider)

        # --- instruction params ----------------------------------------
        decimals = 2
        # fixed-point rate: 6 decimals of precision
        rate_loyl_fp = int(biz.rate_loyl * 10**6)
        # e.g. 1_000_000 loyalty tokens
        initial_supply = 1_000_000 * 10**decimals

        # --- generate a fresh mint account -----------------------------
        mint_kp = Keypair.generate()
        mint_pubkey = mint_kp.pubkey()

        # --- derive PDAs used by your program --------------------------
        # seeds = [b"mint", business_authority.key.as_ref()]
        mint_auth_pda, _ = Pubkey.find_program_address(
            [b"mint", bytes(owner_kp.pubkey())],
            LOYALTY_PROGRAM_ID,
        )
        # seeds = [b"meta", mint.key().as_ref()]
        loyalty_meta_pda, _ = Pubkey.find_program_address(
            [b"meta", bytes(mint_pubkey)],
            LOYALTY_PROGRAM_ID,
        )

        # --- compute business ATA for the new mint ----------------------
        business_ata = get_associated_token_address(mint_pubkey, owner_kp.pubkey())

        # --- invoke create_loyalty_mint on-chain ------------------------
        tx_sig = await program.rpc["create_loyalty_mint"](
            decimals,
            rate_loyl_fp,
            initial_supply,
            ctx={
                "accounts": {
                    "mintAuthority": mint_auth_pda,
                    "loyaltyMeta": loyalty_meta_pda,
                    "mint": mint_pubkey,
                    "businessAta": business_ata,
                    "businessAuthority": owner_kp.pubkey(),
                    "tokenProgram": TOKEN_2022_PROGRAM_ID,
                    "associatedTokenProgram": Program.idl_idl_field(  # depending on AnchorPy version
                        idl, "associated_token"
                    ),
                    "systemProgram": SYS_PROGRAM_ID,
                    "rent": SYSVAR_RENT_PUBKEY,
                },
                # need to sign with the generated mint account
                "signers": [mint_kp],
            },
        )
        # (Optionally: log / confirm tx here)

        # --- persist Token record in your DB ---------------------------
        db_token = Token(
            mint=str(mint_pubkey),
            symbol=biz.slug.upper()[:6],
            business_id=biz.id,
            settlement_token=False,
            rate_loyl=biz.rate_loyl,
            decimals=decimals,
            min_rate=None,
            max_rate=None,
            total_supply=initial_supply,
        )
        db.add(db_token)
        await db.commit()
        await db.refresh(db_token)

        # (Optionally, enqueue your PoolService.bootstrap_pool(db_token) here)
