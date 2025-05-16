import base58
from solders.keypair import Keypair
from app.services.base import BaseService
from app.crud.base import CRUDBase
from app.models.business import Business
from app.schemas.business import BusinessCreate


crud_business = CRUDBase[Business, BusinessCreate, BusinessCreate](Business)

class BusinessService(BaseService[Business, BusinessCreate, BusinessCreate]):
    async def create(self, db, payload: BusinessCreate) -> Business:
        # 1) generate new Solana keypair
        kp = Keypair()  # correct way to get a fresh keypair :contentReference[oaicite:0]{index=0}
        priv_bytes = kp.secret()  # returns the 64-byte secret key :contentReference[oaicite:1]{index=1}
        pubkey_str = str(kp.pubkey())  # the associated public key

        # 2) encode for storage
        priv_b58 = base58.b58encode(priv_bytes).decode("utf-8")

        # 3) assemble the ORM object
        biz = Business(
            **payload.model_dump(),
            owner_privkey=priv_b58,
            owner_pubkey=pubkey_str,
        )
        db.add(biz)
        await db.commit()
        await db.refresh(biz)

        # 4) enqueue your existing mint/pool bootstrap
        from celery.app.task import Task
        from app.tasks.business import mint_token_task
        mint_token_task: Task
        mint_token_task.delay(str(biz.id))

        return biz

business_service = BusinessService(crud_business)
