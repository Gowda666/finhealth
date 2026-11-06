import os
from typing import List

class Settings:
    PROJECT_NAME: str = "FinHealth API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Bank statement analysis and financial health scoring engine"
    
    # Upload limits
    MAX_UPLOAD_SIZE_BYTES: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "15")) * 1024 * 1024
    ALLOWED_EXTENSIONS: set = {".csv", ".xlsx", ".xls", ".pdf"}
    
    # CORS
    _cors_env = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173")
    CORS_ORIGINS: List[str] = [origin.strip() for origin in _cors_env.split(",") if origin.strip()]
    if "*" not in CORS_ORIGINS:
        CORS_ORIGINS.append("*")  # Allow public frontend instances or preview deployments
    
    # Default currency
    DEFAULT_CURRENCY: str = os.getenv("DEFAULT_CURRENCY", "INR")
    LOW_BALANCE_THRESHOLD: float = 1000.0  # ₹1000 or $100 depending on statement

settings = Settings()
