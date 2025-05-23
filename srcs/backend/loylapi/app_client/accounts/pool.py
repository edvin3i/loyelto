import typing
from dataclasses import dataclass
from solders.pubkey import Pubkey
from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Commitment
import borsh_construct as borsh
from anchorpy.coder.accounts import ACCOUNT_DISCRIMINATOR_SIZE
from anchorpy.error import AccountInvalidDiscriminator
from anchorpy.utils.rpc import get_multiple_accounts
from ..program_id import PROGRAM_ID


class PoolJSON(typing.TypedDict):
    balance_token: int
    balance_loyl: int


@dataclass
class Pool:
    discriminator: typing.ClassVar = b"\xf1\x9am\x04\x11\xb1m\xbc"
    layout: typing.ClassVar = borsh.CStruct(
        "balance_token" / borsh.U64, "balance_loyl" / borsh.U64
    )
    balance_token: int
    balance_loyl: int

    @classmethod
    async def fetch(
        cls,
        conn: AsyncClient,
        address: Pubkey,
        commitment: typing.Optional[Commitment] = None,
        program_id: Pubkey = PROGRAM_ID,
    ) -> typing.Optional["Pool"]:
        resp = await conn.get_account_info(address, commitment=commitment)
        info = resp.value
        if info is None:
            return None
        if info.owner != program_id:
            raise ValueError("Account does not belong to this program")
        bytes_data = info.data
        return cls.decode(bytes_data)

    @classmethod
    async def fetch_multiple(
        cls,
        conn: AsyncClient,
        addresses: list[Pubkey],
        commitment: typing.Optional[Commitment] = None,
        program_id: Pubkey = PROGRAM_ID,
    ) -> typing.List[typing.Optional["Pool"]]:
        infos = await get_multiple_accounts(conn, addresses, commitment=commitment)
        res: typing.List[typing.Optional["Pool"]] = []
        for info in infos:
            if info is None:
                res.append(None)
                continue
            if info.account.owner != program_id:
                raise ValueError("Account does not belong to this program")
            res.append(cls.decode(info.account.data))
        return res

    @classmethod
    def decode(cls, data: bytes) -> "Pool":
        if data[:ACCOUNT_DISCRIMINATOR_SIZE] != cls.discriminator:
            raise AccountInvalidDiscriminator(
                "The discriminator for this account is invalid"
            )
        dec = Pool.layout.parse(data[ACCOUNT_DISCRIMINATOR_SIZE:])
        return cls(
            balance_token=dec.balance_token,
            balance_loyl=dec.balance_loyl,
        )

    def to_json(self) -> PoolJSON:
        return {
            "balance_token": self.balance_token,
            "balance_loyl": self.balance_loyl,
        }

    @classmethod
    def from_json(cls, obj: PoolJSON) -> "Pool":
        return cls(
            balance_token=obj["balance_token"],
            balance_loyl=obj["balance_loyl"],
        )
