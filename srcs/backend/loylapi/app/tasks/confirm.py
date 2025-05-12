import asyncio
from app.celery_app import celery
from sqlalchemy import select
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from solana.rpc.api import Client
from solana.rpc.async_api import AsyncClient
from app.core.settings import settings
from app.models import CeleryTaskLog, TaskStatus
from app.db.session import AsyncSessionLocal
from app.db.base import Base
import logging

engine = create_async_engine(settings.database_url, future=True, echo=False)
SessionMaker: async_sessionmaker = async_sessionmaker(engine, expire_on_commit=False)
rpc = Client(settings.SOLANA_RPC_URL)
log = logging.getLogger(__name__)


@celery.task(name="onchain.confirm_tx")
def confirm_tx():
    """
    Iterate unconfirmed txs, call getSignatureStatuses,
    mark SUCCESS / FAILED in CeleryTaskLog.
    """

    async def _confirm():
        client = AsyncClient(settings.SOLANA_RPC_URL)
        async with AsyncSessionLocal() as session:
            # filter logs with status PENDING
            pending = await session.execute(
                select(CeleryTaskLog).where(CeleryTaskLog.status == TaskStatus.PENDING)
            )
            for log in pending.scalars():
                res = await client.get_signature_statuses([log.result])
                status = res.value[0]
                if status and status.confirmations is not None:
                    log.status = TaskStatus.SUCCESS
                elif status and status.err is not None:
                    log.status = TaskStatus.FAILED
                # else still PENDING
            await session.commit()
        await client.close()

    asyncio.run(_confirm())
