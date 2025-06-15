from anchorpy import Program, Wallet, Provider, Idl
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.system_program import ID as SYS_PROGRAM_ID
from spl.token.constants import TOKEN_PROGRAM_ID
from pathlib import Path


class ExchangeClient:
    def __init__(
        self,
        rpc_url: str,
        payer_keypair: Keypair,  #  treasury
        program_id: Pubkey,
        idl_path: Path,
    ):
        self.treasury_kp = payer_keypair  # save for later calls
        client = AsyncClient(rpc_url)
        provider = Provider(client, Wallet(self.treasury_kp))
        idl = Idl.from_json(idl_path.read_text())
        self.program = Program(idl, program_id, provider)

    async def init_pool_with_pda(
            self,
            *,
            loyalty_mint: str,
            deposit_token: int,
            deposit_loyl: int,
            business_id: str,
    ) -> str:
        """
        Same semantics as `init_pool`, but authority == Business PDA,
        signer == platform treasury (self.payer_keypair).

        loyalty_mint  – str  mint address of branded token
        deposit_token – int  amount of branded tokens sent to pool
        deposit_loyl  – int  matching LOYL deposit
        business_id   – UUID string (canonical, 36 chars)

        Returns:
            Signature string of the transaction.
        """
        import uuid

        mint_pk = Pubkey.from_string(loyalty_mint)
        biz_id_bytes = uuid.UUID(business_id).bytes

        # PDA derivations
        business_pda, _ = Pubkey.find_program_address(
            [b"business", biz_id_bytes],
            self.program.program_id,
        )
        pool_pda, _ = Pubkey.find_program_address(
            [b"pool", bytes(mint_pk)],
            self.program.program_id,
        )

        # On-chain call
        sig: str = await self.program.rpc["initPoolWithPda"](
            biz_id_bytes,
            deposit_token,
            deposit_loyl,
            ctx={
                "accounts": {
                    "pool": pool_pda,
                    "loyaltyMint": mint_pk,
                    "businessPda": business_pda,
                    "platformAuthority": self.treasury_kp.pubkey(),
                    "tokenProgram": TOKEN_PROGRAM_ID,
                    "systemProgram": SYS_PROGRAM_ID,
                },
                "signers": [self.treasury_kp],
            },
        )
        return sig

    async def swap(
        self,
        pool: Pubkey,
        user_source_ata: Pubkey,
        user_dest_ata: Pubkey,
        amount_in: int,
        min_amount_out: int,
        user_signer: Keypair,
    ) -> str:
        tx_sig = await self.program.rpc["swap"](
            amount_in,
            min_amount_out,
            ctx={
                "accounts": {
                    "pool": pool,
                    "userSource": user_source_ata,
                    "userDest": user_dest_ata,
                    "userAuthority": user_signer.pubkey(),
                    "tokenProgram": TOKEN_PROGRAM_ID,
                },
                "signers": [user_signer],
            },
        )
        return tx_sig
