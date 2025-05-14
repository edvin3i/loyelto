from uuid import UUID
from app.schemas.base import BaseSchema, BaseDBSchema
from app.schemas.types import TxTypeEnum, GeZero, FeeBpsInt, SolSigStr


class SwapTxCreate(BaseSchema):
    user_id: UUID
    from_token_id: UUID
    to_token_id: UUID
    from_amount: GeZero
    to_amount: GeZero
    fee_bps: FeeBpsInt
    sol_sig: SolSigStr
    sol_sig_redeem: SolSigStr


class SwapTxOut(BaseDBSchema):
    user_id: UUID
    from_token_id: UUID
    to_token_id: UUID
    from_amount: GeZero
    to_amount: GeZero
    fee_bps: FeeBpsInt
    sol_sig: SolSigStr
    sol_sig_redeem: SolSigStr
