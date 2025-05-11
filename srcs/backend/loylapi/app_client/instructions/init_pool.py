from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.system_program import ID as SYS_PROGRAM_ID
from spl.token.constants import TOKEN_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta
import borsh_construct as borsh
from ..program_id import PROGRAM_ID


class InitPoolArgs(typing.TypedDict):
    deposit_token: int
    deposit_loyl: int


layout = borsh.CStruct("deposit_token" / borsh.U64, "deposit_loyl" / borsh.U64)


class InitPoolAccounts(typing.TypedDict):
    pool: Pubkey
    loyalty_mint: Pubkey
    business_authority: Pubkey
    platform_authority: Pubkey


def init_pool(
    args: InitPoolArgs,
    accounts: InitPoolAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(pubkey=accounts["pool"], is_signer=False, is_writable=True),
        AccountMeta(
            pubkey=accounts["loyalty_mint"], is_signer=False, is_writable=False
        ),
        AccountMeta(
            pubkey=accounts["business_authority"], is_signer=True, is_writable=True
        ),
        AccountMeta(
            pubkey=accounts["platform_authority"], is_signer=True, is_writable=True
        ),
        AccountMeta(pubkey=SYS_PROGRAM_ID, is_signer=False, is_writable=False),
        AccountMeta(pubkey=TOKEN_PROGRAM_ID, is_signer=False, is_writable=False),
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"t\xe9\xc7\xccs\x9f\xab$"
    encoded_args = layout.build(
        {
            "deposit_token": args["deposit_token"],
            "deposit_loyl": args["deposit_loyl"],
        }
    )
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
