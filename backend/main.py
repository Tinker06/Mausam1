import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.config import settings
from backend.database import init_db
from backend.services.firebase_service import init_firebase_admin
from backend.seed_firestore import run_seed
from backend.routers import weather, recommendations, alerts, locations, auth

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mausam.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing MAUSAM SQLite / Async Database tables...")
    await init_db()
    
    logger.info("Initializing Firebase Cloud Firestore Admin SDK...")
    init_firebase_admin()
    
    logger.info("Syncing pre-existing app data & default locations to Cloud Firestore...")
    try:
        run_seed()
    except Exception as e:
        logger.warning(f"Firestore seed warning: {e}")

    logger.info("MAUSAM Backend System Ready.")
    yield

app = FastAPI(
    title=settings.app_name,
    description="MAUSAM — Personalized Weather & Environmental Analytics API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router)
app.include_router(recommendations.router)
app.include_router(alerts.router)
app.include_router(locations.router)
app.include_router(auth.router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.app_name,
        "debug": settings.debug,
        "fcm_enabled": settings.fcm_enabled,
        "database": "online"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global unhandled error at {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "details": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
