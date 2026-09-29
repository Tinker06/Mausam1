import pytest
import asyncio
from backend.schemas.weather import NormalizedWeather
from backend.services.persona_engine import generate_recommendations
from backend.services.alert_pipeline import analyze_weather_warnings, generate_alert_hash

def test_weather_normalization_defaults():
    weather = NormalizedWeather(
        city="Chennai",
        temperature=32.0,
        feels_like=35.0,
        humidity=70.0,
        wind_speed=15.0,
        rain_probability=20.0,
        condition="Partly Cloudy",
        uv_index=8.0,
        aqi=120,
        pollen_level="moderate"
    )
    assert weather.city == "Chennai"
    assert weather.temperature == 32.0
    assert weather.aqi == 120
    assert weather.uv_index == 8.0

def test_persona_recommendation_health_high_aqi():
    weather = NormalizedWeather(
        city="Delhi",
        temperature=25.0,
        feels_like=26.0,
        humidity=50.0,
        wind_speed=10.0,
        rain_probability=0.0,
        condition="Haze",
        aqi=210,
        uv_index=4.0
    )
    rec = generate_recommendations("health", weather)
    assert rec.priority == "high"
    assert "personalization.health.aqi_warning" == rec.message_key
    assert len(rec.cards) >= 3

def test_persona_recommendation_fitness_heat_danger():
    weather = NormalizedWeather(
        city="Mumbai",
        temperature=36.0,
        feels_like=40.0,
        humidity=80.0,
        wind_speed=12.0,
        rain_probability=10.0,
        condition="Sunny",
        uv_index=9.0
    )
    rec = generate_recommendations("fitness", weather)
    assert rec.priority == "high"
    assert rec.message_key == "personalization.fitness.heat_danger"

def test_persona_recommendation_beach_rough_sea():
    weather = NormalizedWeather(
        city="Goa",
        temperature=29.0,
        feels_like=31.0,
        humidity=75.0,
        wind_speed=25.0,
        rain_probability=30.0,
        condition="Cloudy",
        wave_height_m=2.8,
        water_temperature=26.0
    )
    rec = generate_recommendations("beach", weather)
    assert rec.priority == "high"
    assert rec.message_key == "personalization.beach.high_swell"

def test_warning_analysis_severe_heat():
    weather = NormalizedWeather(
        city="Chennai",
        temperature=43.5,
        feels_like=48.0,
        humidity=60.0,
        wind_speed=15.0,
        rain_probability=5.0,
        condition="Clear"
    )
    warning_resp = analyze_weather_warnings(weather)
    assert warning_resp.warning.severity == "SEVERE"
    assert "Extreme Heat Wave" in warning_resp.warning.conditions[0]

def test_alert_hash_generation():
    hash1 = generate_alert_hash("Chennai", "SEVERE", "Extreme Heat", ["Temp > 42C"])
    hash2 = generate_alert_hash("Chennai", "SEVERE", "Extreme Heat", ["Temp > 42C"])
    hash3 = generate_alert_hash("Mumbai", "SEVERE", "Extreme Heat", ["Temp > 42C"])
    assert hash1 == hash2
    assert hash1 != hash3

if __name__ == "__main__":
    pytest.main(["-v", "test_mausam_services.py"])
