"""Application configuration."""
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings."""
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./neural_space.db")
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://localhost:3000",
    ]
    
    # Add production origins from environment
    if production_origins := os.getenv("ALLOWED_ORIGINS"):
        ALLOWED_ORIGINS.extend(production_origins.split(","))
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    SESSION_EXPIRY_HOURS: int = 24
    
    # API
    API_V1_PREFIX: str = "/api"
    PROJECT_NAME: str = "Neural Space Portfolio API"
    VERSION: str = "1.0.0"
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

settings = Settings()
