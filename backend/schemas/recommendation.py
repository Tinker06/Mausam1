from typing import List, Literal
from pydantic import BaseModel, Field

class RecommendationCardItem(BaseModel):
    type: str = Field(..., description="Card metric/attribute type (e.g., 'air_quality', 'uv_protection', 'workout_window')")
    value: str = Field(..., description="Formatted string value or recommendation text")

class RecommendationResponse(BaseModel):
    persona: str = Field(..., description="Selected persona name (health, fitness, beach, traveler, parents, agriculture, commuters, event_planners)")
    headline: str = Field(..., description="Short impactful summary header")
    message_key: str = Field(..., description="Stable translation key (e.g., 'personalization.fitness.best_hours')")
    message: str = Field(..., description="Localized human-readable advice")
    priority: Literal["low", "medium", "high"] = Field(..., description="Recommendation urgency level")
    cards: List[RecommendationCardItem] = Field(default_factory=list, description="List of metric recommendation cards")

class PersonaRecommendationRequest(BaseModel):
    persona: str
    city: str = "Chennai"
    lat: float = 13.0827
    lon: float = 80.2707
    destination_city: str = None
