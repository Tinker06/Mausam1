import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    app_name: str = os.getenv("APP_NAME", "MAUSAM")
    debug: bool = os.getenv("DEBUG", "True").lower() == "true"
    openweather_api_key: str = os.getenv("OPENWEATHER_API_KEY", "")
    database_url: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./mausam.db")
    
    # Firebase Web & Admin Settings
    firebase_project_id: str = os.getenv("FIREBASE_PROJECT_ID") or os.getenv("VITE_FIREBASE_PROJECT_ID", "")
    firebase_client_email: str = os.getenv("FIREBASE_CLIENT_EMAIL", "")
    firebase_private_key: str = (os.getenv("FIREBASE_PRIVATE_KEY") or "").replace("\\n", "\n")
    firebase_web_api_key: str = os.getenv("FIREBASE_WEB_API_KEY") or os.getenv("VITE_FIREBASE_API_KEY", "")
    fcm_enabled: bool = os.getenv("FCM_ENABLED", "false").lower() == "true"

settings = Settings()
