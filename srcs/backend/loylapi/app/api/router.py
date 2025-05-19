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
    history,
    vouchers_my,
    voucher_mint,
    biz_rate,
    reviews,
    loyalty,
    business_onboarding,
    token_minting,
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
router.include_router(history)
router.include_router(vouchers_my)
router.include_router(voucher_mint)
router.include_router(biz_rate)
router.include_router(reviews)
router.include_router(loyalty)
router.include_router(business_onboarding)
router.include_router(token_minting)