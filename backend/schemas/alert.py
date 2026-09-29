from typing import List, Literal, Optional
from pydantic import BaseModel, Field

class WarningDetail(BaseModel):
    severity: Literal["NORMAL", "MODERATE", "SEVERE"] = Field(..., description="Alert severity level")
    message: str = Field(..., description="User facing warning message")
    reason: str = Field(..., description="Technical or logical trigger reason")
    conditions: List[str] = Field(default_factory=list, description="Active contributing weather conditions")

class WeatherWarningResponse(BaseModel):
    city: str = Field(..., description="Target city")
    warning: WarningDetail = Field(..., description="Warning body detail")

class AlertHistoryItem(BaseModel):
    id: str
    city: str
    severity: str
    message: str
    reason: str
    conditions: List[str]
    created_at: str
    pushed_via_fcm: bool = False
