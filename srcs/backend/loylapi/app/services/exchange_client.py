from anchorpy import Program, Wallet, Provider, Idl
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.system_program import ID as SYS_PROGRAM_ID
from spl.token.constants import TOKEN_PROGRAM_ID
from pathlib import Path
from app.core.settings import settings

import json
from solders.keypair import Keypair

raw = settings.TREASURY_KEYPAIR
nums = json.loads(raw)               # list of 64-bit ints
key_bytes = bytes(nums)              # bytes len 64
treasury_kp = Keypair.from_bytes(key_bytes)


class ExchangeClient:
    def __init__(
            self,
            rpc_url: str,
            payer_keypair: Keypair,  #  treasury
            program_id: str,
            idl_path: Path,
    ):
        self.treasury_kp = payer_keypair  # save for later calls
        client = AsyncClient(rpc_url)
        provider = Provider(client, Wallet(self.treasury_kp))
        idl = Idl.from_json(idl_path.read_text())
        self.program = Program(idl, program_id, provider)

    async def init_pool(
            self,
            loyalty_mint: str,  # string of mint-addr SPL-token of business
            deposit_token: int,
            deposit_loyl: int,
            business_signer: Keypair,  # business owner keypair
    ) -> str:
        # converting str to Pubkey
        mint_pubkey = Pubkey.from_string(loyalty_mint)
        # sys_pubkey = Pubkey.from_string(str(SYS_PROGRAM_ID))
        # tok_pubkey = Pubkey.from_string(str(TOKEN_PROGRAM_ID))

        # finding PDA of pool
        pool_pda, _ = Pubkey.find_program_address(
            seeds=[b"pool", bytes(mint_pubkey)],
            program_id=self.program.program_id,
        )

        # calling Anchor-progs
        tx_sig: str = await self.program.rpc["initPool"](
            deposit_token,
            deposit_loyl,
            ctx={
                "accounts": {
                    "pool": pool_pda,
                    "loyaltyMint": mint_pubkey,
                    "businessAuthority": business_signer.pubkey(),
                    "platformAuthority": self.treasury_kp.pubkey(),
                    "tokenProgram": TOKEN_PROGRAM_ID,
                    "systemProgram": SYS_PROGRAM_ID,
                },
                "signers": [business_signer],
            },
        )
        return tx_sig

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
