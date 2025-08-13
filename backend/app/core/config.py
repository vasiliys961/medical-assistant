# backend/app/core/config.py
# backend/app/core/config.py
import os
from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    OPENROUTER_API_KEY: str
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/medical_assistant"
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()