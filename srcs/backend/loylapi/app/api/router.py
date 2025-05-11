from fastapi import APIRouter
from app.api.v1 import (
    auth, users, businesses, tokens, balances, wallets,
    point_txs, swap_txs, voucher_templates, voucher_nfts, tasks
)


router = APIRouter()
router.include_router(auth.router)
router.include_router(users.router)
router.include_router(businesses.router)
router.include_router(tokens.router)
router.include_router(wallets.router)
router.include_router(balances.router)
router.include_router(point_txs.router)
router.include_router(swap_txs.router)
router.include_router(voucher_templates.router)
router.include_router(voucher_nfts.router)
router.include_router(tasks.router)


