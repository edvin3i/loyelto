from fastapi import APIRouter
from app.api.v1 import auth, users, businesses

router = APIRouter()
router.include_router(auth.router)
router.include_router(users.router)
router.include_router(businesses.router)
