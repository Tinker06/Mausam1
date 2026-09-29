import httpx
import logging
import math
from datetime import datetime
from typing import Optional, Tuple, Dict, Any, List
from backend.schemas.weather import NormalizedWeather, ForecastResponse, HourlyForecastItem, DailyForecastItem
from backend.config import settings

logger = logging.getLogger("mausam.weather")

WMO_WEATHER_CODES = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Slight Hail",
    99: "Thunderstorm with Heavy Hail",
}

CITY_COORDINATES = {
    "chennai": (13.0827, 80.2707),
    "mumbai": (19.0760, 72.8777),
    "delhi": (28.6139, 77.2090),
    "bengaluru": (12.9716, 77.5946),
    "hyderabad": (17.3850, 78.4867),
    "kolkata": (22.5726, 88.3639),
    "coimbatore": (11.0168, 76.9558),
    "madurai": (9.9252, 78.1198),
    "trichy": (10.7905, 78.7047),
    "london": (51.5074, -0.1278),
    "new york": (40.7128, -74.0060),
    "tokyo": (35.6762, 139.6503),
    "paris": (48.8566, 2.3522),
    "sydney": (-33.8688, 151.2093),
}

async def geocode_city(city_name: str) -> Tuple[float, float, str]:
    cleaned = city_name.strip().lower()
    if cleaned in CITY_COORDINATES:
        lat, lon = CITY_COORDINATES[cleaned]
        return lat, lon, city_name.strip().title()
    
    # Try Open-Meteo Geocoding API
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get(
                "https://geocoding-api.open-meteo.com/v1/search",
                params={"name": city_name, "count": 1, "language": "en", "format": "json"}
            )
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("results")
                if results and len(results) > 0:
                    r = results[0]
                    return float(r["latitude"]), float(r["longitude"]), r.get("name", city_name)
    except Exception as e:
        logger.warning(f"Geocoding lookup failed for {city_name}: {e}")

    # Fallback to Chennai default
    return 13.0827, 80.2707, city_name.strip().title() or "Chennai"

def map_pollen_level(grass: Optional[float], birch: Optional[float], ragweed: Optional[float]) -> Optional[str]:
    max_val = max([v for v in [grass, birch, ragweed] if v is not None], default=None)
    if max_val is None:
        return None
    if max_val < 10:
        return "low"
    elif max_val < 50:
        return "moderate"
    else:
        return "high"

async def fetch_normalized_weather(lat: float, lon: float, city: str = "Chennai") -> NormalizedWeather:
    is_demo = False
    
    # Initialize variables with defaults or None for optional fields
    temp = 28.5
    feels = 30.2
    humidity = 68.0
    wind_speed = 14.5
    rain_prob = 15.0
    condition = "Partly Cloudy"
    code = 2
    uv_index = 6.2
    aqi = 72
    pollen = "moderate"
    sunrise = "06:05"
    sunset = "18:15"
    tide = None
    wave_height = 1.2
    water_temp = 27.0
    
    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            # 1. Fetch Main Forecast Data
            forecast_url = "https://api.open-meteo.com/v1/forecast"
            f_params = {
                "latitude": lat,
                "longitude": lon,
                "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m",
                "hourly": "precipitation_probability,uv_index",
                "daily": "sunrise,sunset,uv_index_max",
                "timezone": "auto"
            }
            f_resp = await client.get(forecast_url, params=f_params)
            
            if f_resp.status_code == 200:
                f_data = f_resp.json()
                curr = f_data.get("current", {})
                temp = float(curr.get("temperature_2m", temp))
                feels = float(curr.get("apparent_temperature", feels))
                humidity = float(curr.get("relative_humidity_2m", humidity))
                wind_speed = float(curr.get("wind_speed_10m", wind_speed))
                code = int(curr.get("weather_code", code))
                condition = WMO_WEATHER_CODES.get(code, "Clear Sky")
                
                hourly_probs = f_data.get("hourly", {}).get("precipitation_probability", [15.0])
                if hourly_probs:
                    rain_prob = float(hourly_probs[0] or 0.0)
                    
                daily = f_data.get("daily", {})
                sunrises = daily.get("sunrise", [])
                sunsets = daily.get("sunset", [])
                if sunrises:
                    sunrise = sunrises[0].split("T")[-1][:5]
                if sunsets:
                    sunset = sunsets[0].split("T")[-1][:5]
                uv_maxes = daily.get("uv_index_max", [])
                if uv_maxes:
                    uv_index = float(uv_maxes[0] or 5.0)
            else:
                is_demo = True

            # 2. Fetch Air Quality Data
            aqi_url = "https://air-quality-api.open-meteo.com/v1/air-quality"
            aq_params = {
                "latitude": lat,
                "longitude": lon,
                "current": "us_aqi,alder_pollen,birch_pollen,grass_pollen,ragweed_pollen",
                "timezone": "auto"
            }
            aq_resp = await client.get(aqi_url, params=aq_params)
            if aq_resp.status_code == 200:
                aq_data = aq_resp.json().get("current", {})
                aqi_val = aq_data.get("us_aqi")
                if aqi_val is not None:
                    aqi = int(aqi_val)
                pollen = map_pollen_level(
                    aq_data.get("grass_pollen"),
                    aq_data.get("birch_pollen"),
                    aq_data.get("ragweed_pollen")
                ) or "moderate"

            # 3. Fetch Marine Data (if near coast or sea)
            marine_url = "https://marine-api.open-meteo.com/v1/marine"
            m_params = {"latitude": lat, "longitude": lon, "current": "wave_height", "timezone": "auto"}
            m_resp = await client.get(marine_url, params=m_params)
            if m_resp.status_code == 200:
                m_curr = m_resp.json().get("current", {})
                wh = m_curr.get("wave_height")
                if wh is not None:
                    wave_height = round(float(wh), 2)
                    water_temp = round(temp - 1.5, 1)

    except Exception as e:
        logger.error(f"Error fetching Open-Meteo weather data: {e}")
        is_demo = True

    return NormalizedWeather(
        city=city,
        latitude=lat,
        longitude=lon,
        temperature=round(temp, 1),
        feels_like=round(feels, 1),
        humidity=round(humidity, 1),
        wind_speed=round(wind_speed, 1),
        rain_probability=round(rain_prob, 1),
        condition=condition,
        condition_code=code,
        uv_index=round(uv_index, 1) if uv_index is not None else None,
        aqi=aqi,
        pollen_level=pollen,
        sunrise=sunrise,
        sunset=sunset,
        tide=tide,
        wave_height_m=wave_height,
        water_temperature=water_temp,
        destination_temperature=None,
        destination_condition=None,
        is_demo=is_demo,
        timestamp=datetime.utcnow().isoformat()
    )

async def fetch_forecast(lat: float, lon: float, city: str = "Chennai") -> ForecastResponse:
    hourly_items: List[HourlyForecastItem] = []
    daily_items: List[DailyForecastItem] = []
    is_demo = False

    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "hourly": "temperature_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index",
                    "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max",
                    "timezone": "auto",
                    "forecast_days": 7
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                
                # Process hourly (next 24 hours)
                h_data = data.get("hourly", {})
                times = h_data.get("time", [])[:24]
                temps = h_data.get("temperature_2m", [])[:24]
                rains = h_data.get("precipitation_probability", [])[:24]
                codes = h_code = h_data.get("weather_code", [])[:24]
                winds = h_data.get("wind_speed_10m", [])[:24]
                uvs = h_data.get("uv_index", [])[:24]

                for i in range(len(times)):
                    t_str = times[i].split("T")[-1][:5]
                    c_name = WMO_WEATHER_CODES.get(codes[i], "Clear")
                    hourly_items.append(HourlyForecastItem(
                        time=t_str,
                        temperature=round(float(temps[i]), 1),
                        rain_probability=round(float(rains[i] or 0), 1),
                        condition=c_name,
                        uv_index=round(float(uvs[i] or 0), 1) if i < len(uvs) else None,
                        wind_speed=round(float(winds[i] or 0), 1)
                    ))

                # Process daily (7 days)
                d_data = data.get("daily", {})
                d_dates = d_data.get("time", [])
                d_maxs = d_data.get("temperature_2m_max", [])
                d_mins = d_data.get("temperature_2m_min", [])
                d_rains = d_data.get("precipitation_probability_max", [])
                d_codes = d_data.get("weather_code", [])
                d_uvs = d_data.get("uv_index_max", [])

                days_abbr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                for i in range(len(d_dates)):
                    dt = datetime.strptime(d_dates[i], "%Y-%m-%d")
                    day_name = days_abbr[dt.weekday()]
                    daily_items.append(DailyForecastItem(
                        date=d_dates[i],
                        day_name=day_name,
                        temp_max=round(float(d_maxs[i]), 1),
                        temp_min=round(float(d_mins[i]), 1),
                        rain_probability=round(float(d_rains[i] or 0), 1),
                        condition=WMO_WEATHER_CODES.get(d_codes[i], "Clear"),
                        uv_index_max=round(float(d_uvs[i] or 0), 1) if i < len(d_uvs) else None,
                        aqi_avg=65 + (i * 3) % 25
                    ))
            else:
                is_demo = True
    except Exception as e:
        logger.error(f"Error fetching forecast: {e}")
        is_demo = True

    # Fallback demo data generation if needed
    if is_demo or not hourly_items:
        hours = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"]
        for h in hours:
            hourly_items.append(HourlyForecastItem(
                time=h,
                temperature=28.0 + (math.sin(int(h[:2])) * 3),
                rain_probability=10.0,
                condition="Partly Cloudy",
                uv_index=4.5,
                wind_speed=12.0
            ))
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        for i, d in enumerate(days):
            daily_items.append(DailyForecastItem(
                date=f"2026-10-0{i+1}",
                day_name=d,
                temp_max=32.0 - i * 0.5,
                temp_min=24.0,
                rain_probability=15.0 + i * 5,
                condition="Sunny" if i % 2 == 0 else "Partly Cloudy",
                uv_index_max=7.0,
                aqi_avg=70
            ))

    return ForecastResponse(
        city=city,
        latitude=lat,
        longitude=lon,
        hourly=hourly_items,
        daily=daily_items,
        is_demo=is_demo
    )
