from fastapi import APIRouter
from app.api.v1 import (
    auth,
    users,
    businesses,
    tokens,
    balances,
    wallets,
    point_txs,
    swap_txs,
    voucher_templates,
    voucher_nfts,
    tasks,
)


router = APIRouter()
router.include_router(auth)
router.include_router(users)
router.include_router(businesses)
router.include_router(tokens)
router.include_router(wallets)
router.include_router(balances)
router.include_router(point_txs)
router.include_router(swap_txs)
router.include_router(voucher_templates)
router.include_router(voucher_nfts)
router.include_router(tasks)
