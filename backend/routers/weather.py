from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional
from backend.schemas.weather import NormalizedWeather, ForecastResponse
from backend.services.weather_service import fetch_normalized_weather, fetch_forecast, geocode_city
from backend.services.persona_engine import generate_recommendations
from backend.services.alert_pipeline import analyze_weather_warnings
from backend.services.firebase_service import sync_saved_location_to_firestore, sync_alert_to_firestore

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("/current", response_model=NormalizedWeather)
async def get_current_weather(
    city: Optional[str] = Query(None, description="City name"),
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude")
):
    target_city = city or "Chennai"
    if lat is None or lon is None:
        resolved_lat, resolved_lon, resolved_city = await geocode_city(target_city)
    else:
        resolved_lat, resolved_lon, resolved_city = lat, lon, target_city
        
    weather = await fetch_normalized_weather(resolved_lat, resolved_lon, resolved_city)
    return weather

@router.get("/forecast", response_model=ForecastResponse)
async def get_weather_forecast(
    city: Optional[str] = Query(None),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None)
):
    target_city = city or "Chennai"
    if lat is None or lon is None:
        resolved_lat, resolved_lon, resolved_city = await geocode_city(target_city)
    else:
        resolved_lat, resolved_lon, resolved_city = lat, lon, target_city
        
    forecast = await fetch_forecast(resolved_lat, resolved_lon, resolved_city)
    return forecast

@router.get("/dashboard")
async def get_aggregated_dashboard(
    persona: str = Query("health", description="Selected persona"),
    city: Optional[str] = Query(None),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None)
):
    target_city = city or "Chennai"
    if lat is None or lon is None:
        resolved_lat, resolved_lon, resolved_city = await geocode_city(target_city)
    else:
        resolved_lat, resolved_lon, resolved_city = lat, lon, target_city
        
    current_w = await fetch_normalized_weather(resolved_lat, resolved_lon, resolved_city)
    forecast_w = await fetch_forecast(resolved_lat, resolved_lon, resolved_city)
    recommendations = generate_recommendations(persona, current_w)
    warning_resp = analyze_weather_warnings(current_w)

    # Sync to Cloud Firestore instantly on dashboard load!
    sync_saved_location_to_firestore(
        location_id=f"loc_{resolved_city.lower()}",
        user_id="demo-user",
        city=resolved_city,
        lat=resolved_lat,
        lon=resolved_lon
    )
    if warning_resp.warning.severity != "NORMAL":
        sync_alert_to_firestore(
            alert_id=f"alert_{resolved_city.lower()}",
            city=resolved_city,
            severity=warning_resp.warning.severity,
            message=warning_resp.warning.message,
            reason=warning_resp.warning.reason
        )

    return {
        "city": resolved_city,
        "current": current_w,
        "forecast": forecast_w,
        "recommendations": recommendations,
        "warning": warning_resp
    }

@router.get("/search-locations")
async def search_locations(q: str = Query(..., min_length=2)):
    common_cities = [
        {"name": "Chennai", "country": "India", "lat": 13.0827, "lon": 80.2707},
        {"name": "Mumbai", "country": "India", "lat": 19.0760, "lon": 72.8777},
        {"name": "Delhi", "country": "India", "lat": 28.6139, "lon": 77.2090},
        {"name": "Bengaluru", "country": "India", "lat": 12.9716, "lon": 77.5946},
        {"name": "Hyderabad", "country": "India", "lat": 17.3850, "lon": 78.4867},
        {"name": "Coimbatore", "country": "India", "lat": 11.0168, "lon": 76.9558},
        {"name": "Madurai", "country": "India", "lat": 9.9252, "lon": 78.1198},
        {"name": "London", "country": "United Kingdom", "lat": 51.5074, "lon": -0.1278},
        {"name": "New York", "country": "United States", "lat": 40.7128, "lon": -74.0060},
        {"name": "Tokyo", "country": "Japan", "lat": 35.6762, "lon": 139.6503}
    ]
    query_lower = q.lower()
    matches = [c for c in common_cities if query_lower in c["name"].lower()]
    if not matches:
        lat, lon, resolved_name = await geocode_city(q)
        matches = [{"name": resolved_name, "country": "Global", "lat": lat, "lon": lon}]
    return matches
