from uuid import UUID
from app.schemas.base import BaseSchema, BaseDBSchema
from app.schemas.types import TxTypeEnum, GeZero, FeeBpsInt, SolSigStr


class PointTxCreate(BaseSchema):
    wallet_id: UUID
    tx_type: TxTypeEnum
    amount: GeZero
    fee_bps: FeeBpsInt | None
    sol_sig: SolSigStr | None


class PointTxOut(BaseDBSchema):
    wallet_id: UUID
    tx_type: TxTypeEnum
    amount: GeZero
    fee_bps: FeeBpsInt | None
    sol_sig: SolSigStr | None
