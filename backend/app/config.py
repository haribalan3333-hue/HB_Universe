import os

class Settings:
    APP_NAME: str = "HB UNIVERSE API"
    APP_VERSION: str = "11.0.0"
    DEBUG: bool = True
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./hb_universe.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "hb-universe-super-secret-quantum-encryption-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]

settings = Settings()
