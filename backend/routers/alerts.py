from fastapi import APIRouter, Query, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid
from datetime import datetime

from backend.schemas.alert import WeatherWarningResponse, AlertHistoryItem
from backend.services.weather_service import fetch_normalized_weather, geocode_city
from backend.services.alert_pipeline import analyze_weather_warnings, dispatch_fcm_notification_if_eligible
from backend.database import get_db
from backend.models import AlertHistoryModel

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("", response_model=WeatherWarningResponse)
async def get_weather_alerts(city: str = Query("Chennai")):
    lat, lon, resolved_city = await geocode_city(city)
    weather = await fetch_normalized_weather(lat, lon, resolved_city)
    warning_response = analyze_weather_warnings(weather)
    return warning_response

@router.post("/dispatch-test")
async def trigger_test_alert(
    city: str = Query("Chennai"),
    db: AsyncSession = Depends(get_db)
):
    lat, lon, resolved_city = await geocode_city(city)
    weather = await fetch_normalized_weather(lat, lon, resolved_city)
    warning_resp = analyze_weather_warnings(weather)
    
    # Force severity for test dispatch if normal
    if warning_resp.warning.severity == "NORMAL":
        warning_resp.warning.severity = "MODERATE"
        warning_resp.warning.message = f"Simulated Advisory for {resolved_city}: Moderate rain or heat expected."
        warning_resp.warning.reason = "Manual test trigger invoked."
        warning_resp.warning.conditions = ["Test Weather Condition Exceeded"]

    dispatched = await dispatch_fcm_notification_if_eligible(warning_resp)

    # Record in DB
    record = AlertHistoryModel(
        id=str(uuid.uuid4()),
        city=resolved_city,
        severity=warning_resp.warning.severity,
        message=warning_resp.warning.message,
        reason=warning_resp.warning.reason,
        conditions=",".join(warning_resp.warning.conditions),
        created_at=datetime.utcnow()
    )
    db.add(record)
    await db.commit()

    return {
        "status": "success",
        "dispatched": dispatched,
        "warning": warning_resp
    }

@router.get("/history", response_model=List[AlertHistoryItem])
async def get_alert_history(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AlertHistoryModel).order_by(AlertHistoryModel.created_at.desc()).limit(20))
    records = result.scalars().all()
    
    items = []
    for r in records:
        items.append(AlertHistoryItem(
            id=r.id,
            city=r.city,
            severity=r.severity,
            message=r.message,
            reason=r.reason,
            conditions=r.conditions.split(",") if r.conditions else [],
            created_at=r.created_at.isoformat(),
            pushed_via_fcm=True
        ))
    return items
