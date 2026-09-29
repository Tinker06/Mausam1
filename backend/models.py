from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, Text, ForeignKey
from backend.database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    default_persona = Column(String, default="health")
    preferred_language = Column(String, default="en")
    theme = Column(String, default="dark")
    created_at = Column(DateTime, default=datetime.utcnow)

class SavedLocationModel(Base):
    __tablename__ = "saved_locations"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    city = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class NotificationPreferenceModel(Base):
    __tablename__ = "notification_preferences"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    severe_enabled = Column(Boolean, default=True)
    moderate_enabled = Column(Boolean, default=True)
    fcm_token = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow)

class AlertHistoryModel(Base):
    __tablename__ = "alert_history"

    id = Column(String, primary_key=True, index=True)
    city = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    conditions = Column(Text, nullable=True)  # Comma separated
    created_at = Column(DateTime, default=datetime.utcnow)
