from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.instruction import Instruction, AccountMeta
import borsh_construct as borsh
from ..program_id import PROGRAM_ID


class SwapArgs(typing.TypedDict):
    amount_in: int
    min_amount_out: int


layout = borsh.CStruct("amount_in" / borsh.U64, "min_amount_out" / borsh.U64)


class SwapAccounts(typing.TypedDict):
    pool: Pubkey


def swap(
    args: SwapArgs,
    accounts: SwapAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(pubkey=accounts["pool"], is_signer=False, is_writable=True)
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"\xf8\xc6\x9e\x91\xe1u\x87\xc8"
    encoded_args = layout.build(
        {
            "amount_in": args["amount_in"],
            "min_amount_out": args["min_amount_out"],
        }
    )
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
