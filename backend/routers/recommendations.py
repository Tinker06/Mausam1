from fastapi import APIRouter, Query, Body, HTTPException
from backend.schemas.recommendation import RecommendationResponse, PersonaRecommendationRequest
from backend.services.weather_service import fetch_normalized_weather, geocode_city
from backend.services.persona_engine import generate_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.get("", response_model=RecommendationResponse)
async def get_persona_recommendation(
    persona: str = Query("health", description="Selected persona"),
    city: str = Query("Chennai"),
    lat: float = Query(None),
    lon: float = Query(None)
):
    if lat is None or lon is None:
        r_lat, r_lon, r_city = await geocode_city(city)
    else:
        r_lat, r_lon, r_city = lat, lon, city
        
    weather = await fetch_normalized_weather(r_lat, r_lon, r_city)
    rec = generate_recommendations(persona, weather)
    return rec

@router.post("", response_model=RecommendationResponse)
async def post_persona_recommendation(payload: PersonaRecommendationRequest):
    r_lat, r_lon, r_city = await geocode_city(payload.city)
    weather = await fetch_normalized_weather(r_lat, r_lon, r_city)
    rec = generate_recommendations(payload.persona, weather)
    return rec
