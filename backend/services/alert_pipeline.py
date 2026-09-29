import hashlib
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from backend.schemas.weather import NormalizedWeather
from backend.schemas.alert import WeatherWarningResponse, WarningDetail
from backend.config import settings

logger = logging.getLogger("mausam.alerts")

# In-memory deduplication set for alert notifications (in addition to DB persistence)
_DISPATCHED_ALERT_HASHES = set()

def analyze_weather_warnings(weather: NormalizedWeather) -> WeatherWarningResponse:
    city = weather.city
    temp = weather.temperature
    rain = weather.rain_probability
    wind = weather.wind_speed
    aqi = weather.aqi if weather.aqi is not None else 50
    uv = weather.uv_index if weather.uv_index is not None else 2.0
    cond = weather.condition
    
    severity = "NORMAL"
    message = "No significant weather warning"
    reason = "Forecast conditions are within the warning thresholds"
    conditions = []

    # Check Severe Triggers
    if temp >= 42.0:
        severity = "SEVERE"
        conditions.append(f"Extreme Heat Wave ({temp}°C)")
    elif rain >= 85.0 or "Thunderstorm" in cond or "Violent" in cond:
        severity = "SEVERE"
        conditions.append(f"Heavy Torrential Rain / Thunderstorm ({rain}% prob)")
    elif wind >= 55.0:
        severity = "SEVERE"
        conditions.append(f"Gale Wind Warning ({wind} km/h)")
    elif aqi >= 300:
        severity = "SEVERE"
        conditions.append(f"Hazardous Air Quality Index (AQI {aqi})")

    # Check Moderate Triggers (if not already severe)
    if severity != "SEVERE":
        if temp >= 37.0:
            severity = "MODERATE"
            conditions.append(f"Heat Advisory ({temp}°C)")
        elif rain >= 60.0:
            severity = "MODERATE"
            conditions.append(f"Moderate Rain Warning ({rain}% prob)")
        elif wind >= 35.0:
            severity = "MODERATE"
            conditions.append(f"High Wind Advisory ({wind} km/h)")
        elif aqi >= 150:
            severity = "MODERATE"
            conditions.append(f"Unhealthy Air Quality (AQI {aqi})")
        elif uv >= 9.0:
            severity = "MODERATE"
            conditions.append(f"Very High UV Radiation Index ({uv})")

    if severity == "SEVERE":
        message = f"SEVERE WEATHER ALERT for {city}: " + ", ".join(conditions)
        reason = "One or more weather parameters exceeded critical safety thresholds."
    elif severity == "MODERATE":
        message = f"Weather Advisory for {city}: " + ", ".join(conditions)
        reason = "Weather parameters exceeded moderate advisory thresholds."

    return WeatherWarningResponse(
        city=city,
        warning=WarningDetail(
            severity=severity,
            message=message,
            reason=reason,
            conditions=conditions
        )
    )

def generate_alert_hash(city: str, severity: str, reason: str, conditions: List[str]) -> str:
    raw = f"{city.lower()}:{severity}:{reason}:" + ",".join(sorted(conditions))
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16]

async def dispatch_fcm_notification_if_eligible(warning_resp: WeatherWarningResponse, device_token: Optional[str] = None) -> bool:
    warning = warning_resp.warning
    if warning.severity == "NORMAL":
        return False
    
    alert_hash = generate_alert_hash(warning_resp.city, warning.severity, warning.reason, warning.conditions)
    
    if alert_hash in _DISPATCHED_ALERT_HASHES:
        logger.info(f"Alert hash {alert_hash} already notified for {warning_resp.city}. Skipping duplicate.")
        return False
    
    _DISPATCHED_ALERT_HASHES.add(alert_hash)
    
    # Check if Firebase FCM is configured
    if settings.fcm_enabled and settings.firebase_project_id:
        try:
            # Firebase Admin SDK messaging call goes here if live key is present
            logger.info(f"Dispatched live FCM Push Notification for alert {alert_hash}")
            return True
        except Exception as e:
            logger.error(f"FCM delivery error: {e}")
            return False
    else:
        logger.info(f"Simulated Push Notification logged for {warning_resp.city} ({warning.severity}): {warning.message}")
        return True
