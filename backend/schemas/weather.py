from typing import Optional, List
from pydantic import BaseModel, Field

class NormalizedWeather(BaseModel):
    city: str = Field(default="Chennai", description="Resolved city name")
    latitude: float = Field(default=13.0827)
    longitude: float = Field(default=80.2707)
    
    # Core weather metrics
    temperature: float = Field(..., description="Temperature in °C")
    feels_like: float = Field(..., description="Feels like temperature in °C")
    humidity: float = Field(..., description="Humidity percentage 0-100")
    wind_speed: float = Field(..., description="Wind speed in km/h")
    rain_probability: float = Field(..., description="Rain probability 0-100")
    condition: str = Field(..., description="Weather condition summary (e.g., Clear, Rain, Sunny)")
    condition_code: int = Field(default=0, description="WMO weather code")
    
    # Environmental & Specialized fields (must be None if unavailable)
    uv_index: Optional[float] = Field(default=None, description="UV Index (0-12+)")
    aqi: Optional[int] = Field(default=None, description="US Air Quality Index (0-500)")
    pollen_level: Optional[str] = Field(default=None, description="'low', 'moderate', 'high' or None")
    sunrise: Optional[str] = Field(default=None, description="24-hour HH:MM format")
    sunset: Optional[str] = Field(default=None, description="24-hour HH:MM format")
    
    # Marine / Beach metrics
    tide: Optional[str] = Field(default=None, description="Tide summary or None")
    wave_height_m: Optional[float] = Field(default=None, description="Swell/wave height in meters")
    water_temperature: Optional[float] = Field(default=None, description="Sea water temperature in °C")
    
    # Destination metrics for Travelers
    destination_temperature: Optional[float] = Field(default=None, description="Destination temp °C")
    destination_condition: Optional[str] = Field(default=None, description="Destination condition")
    
    is_demo: bool = Field(default=False, description="Flag indicating if demo fallback data was used")
    timestamp: str = Field(default="", description="ISO timestamp of observation")

class HourlyForecastItem(BaseModel):
    time: str  # HH:00
    temperature: float
    rain_probability: float
    condition: str
    uv_index: Optional[float] = None
    wind_speed: float

class DailyForecastItem(BaseModel):
    date: str  # YYYY-MM-DD
    day_name: str  # e.g., Mon, Tue
    temp_max: float
    temp_min: float
    rain_probability: float
    condition: str
    uv_index_max: Optional[float] = None
    aqi_avg: Optional[int] = None

class ForecastResponse(BaseModel):
    city: str
    latitude: float
    longitude: float
    hourly: List[HourlyForecastItem]
    daily: List[DailyForecastItem]
    is_demo: bool = False
