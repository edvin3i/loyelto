from app.celery_app import celery
from app.services.bubblegum import bubblegum_minter
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.settings import settings
from app.models import VoucherTemplate
from uuid import UUID
from app.services.celery_wrapper import log_task

engine = create_async_engine(settings.database_url, future=True, echo=False)
Session = async_sessionmaker(engine, expire_on_commit=False)


@celery.task(name="onchain.mint_voucher", queue="onchain")
@log_task
def mint_voucher_task(template_id: str, user_id: str):
    async def _go():
        async with Session() as db:
            tmpl = await db.get(VoucherTemplate, UUID(template_id))
            if tmpl:
                await bubblegum_minter.mint(db, tmpl, UUID(user_id))

    import asyncio

    asyncio.run(_go())
