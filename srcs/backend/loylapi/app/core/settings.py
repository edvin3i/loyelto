from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Any, Dict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="",
    )

    ENV: str = Field("dev")
    SQLITE_PATH: str = Field(default="sqlite+aiosqlite:///./dev.db")

    DB_HOST: str | None = Field(default=None)
    DB_PORT: int | None = Field(default=None)
    DB_NAME: str | None = Field(default=None)
    DB_USER: str | None = Field(default=None)
    DB_PASSWORD: str | None = Field(default=None)

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


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
