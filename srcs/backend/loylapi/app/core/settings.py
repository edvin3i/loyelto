import json
from pathlib import Path
from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Any, Dict
from solders.keypair import Keypair
from solders.pubkey import Pubkey


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(
            Path(__file__).resolve().parent.parent.parent.parent.parent.parent / ".env"
        ),
        env_file_encoding="utf-8",
        env_prefix="",
        extra="ignore",
    )

    ROOT: Path = Path(__file__).resolve().parent.parent.parent
    print(f"============= {ROOT} =============")
    ENV: str = Field("dev")
    SQLITE_PATH: str = Field(default="sqlite+aiosqlite:///./dev.db")

    DB_HOST: str | None = Field(default=None)
    DB_PORT: int | None = Field(default=None)
    DB_NAME: str | None = Field(default=None)
    DB_USER: str | None = Field(default=None)
    DB_PASSWORD: str | None = Field(default=None)

    TREASURY_KEYPAIR: str = Field(...)
    SOLANA_RPC_URL: str = Field("https://api.devnet.solana.com")
    EXCHANGE_PROGRAM_ID: str = Field(...)
    EXCHANGE_IDL_PATH: str = Field("anchor/target/idl/exchange.json")
    LOYL_TOKEN_PROGRAM_ID: str = Field(...)
    LOYALTY_IDL_PATH: str = Field("anchor/target/idl/loyalty_token.json")
    BIZ_FACTORY_PROGRAM_ID: str = Field(...)
    BIZ_FACTORY_IDL_PATH: str = Field("anchor/target/idl/business_factory.json")

    PRIVY_APP_ID: str = Field(...)
    PRIVY_API_KEY: str = Field(...)
    PRIVY_API_SECRET: str = Field(...)

    CELERY_BROKER: str = Field(...)
    CELERY_BACKEND: str = Field(...)

    @property
    def root(self) -> Path:
        return self.ROOT

    @property
    def database_url(self) -> str:
        if self.ENV == "dev":
            return self.SQLITE_PATH
        return (
            f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    @property
    def fastapi_kwargs(self) -> Dict[str, Any]:
        if self.ENV == "prod":
            return {
                "docs_url": None,
                "redoc_url": None,
                "openapi_url": None,
            }
        return {}

    @property
    def treasury_kp(self) -> Keypair:
        """ """
        raw = self.TREASURY_KEYPAIR  # string like "[12,34,...]"
        nums = json.loads(raw)  # list[int]
        return Keypair.from_bytes(bytes(nums))

    @property
    def exchange_program_pk(self) -> Pubkey:
        """
        Pubkey of exchange program, getting from EXCHANGE_PROGRAM_ID.
        """
        return Pubkey.from_string(self.EXCHANGE_PROGRAM_ID)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
