import uuid
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

from backend.database import get_db
from backend.models import SavedLocationModel
from backend.services.weather_service import geocode_city
from backend.services.firebase_service import sync_saved_location_to_firestore

router = APIRouter(prefix="/api/saved-locations", tags=["Saved Locations"])

class SavedLocationCreate(BaseModel):
    user_id: str = Field(default="demo-user")
    city: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_default: bool = False

class SavedLocationItem(BaseModel):
    id: str
    user_id: str
    city: str
    latitude: float
    longitude: float
    is_default: bool
    created_at: str

@router.get("", response_model=List[SavedLocationItem])
async def list_saved_locations(
    user_id: str = "demo-user",
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(SavedLocationModel).where(SavedLocationModel.user_id == user_id).order_by(SavedLocationModel.created_at.desc())
    )
    locations = result.scalars().all()
    
    # Seed defaults if empty
    if not locations:
        default_cities = [
            ("Chennai", 13.0827, 80.2707, True),
            ("Mumbai", 19.0760, 72.8777, False),
            ("Bengaluru", 12.9716, 77.5946, False),
            ("Delhi", 28.6139, 77.2090, False)
        ]
        created_items = []
        for city_name, lat, lon, is_def in default_cities:
            loc_id = str(uuid.uuid4())
            loc_obj = SavedLocationModel(
                id=loc_id,
                user_id=user_id,
                city=city_name,
                latitude=lat,
                longitude=lon,
                is_default=is_def,
                created_at=datetime.utcnow()
            )
            db.add(loc_obj)
            created_items.append(loc_obj)

            # Sync to Firestore
            sync_saved_location_to_firestore(loc_id, user_id, city_name, lat, lon)

        await db.commit()
        locations = created_items

    return [
        SavedLocationItem(
            id=loc.id,
            user_id=loc.user_id,
            city=loc.city,
            latitude=loc.latitude,
            longitude=loc.longitude,
            is_default=loc.is_default,
            created_at=loc.created_at.isoformat()
        )
        for loc in locations
    ]

@router.post("", response_model=SavedLocationItem)
async def create_saved_location(
    payload: SavedLocationCreate,
    db: AsyncSession = Depends(get_db)
):
    if payload.latitude is None or payload.longitude is None:
        lat, lon, resolved_city = await geocode_city(payload.city)
    else:
        lat, lon, resolved_city = payload.latitude, payload.longitude, payload.city

    # Check if duplicate exists
    existing = await db.execute(
        select(SavedLocationModel).where(
            SavedLocationModel.user_id == payload.user_id,
            SavedLocationModel.city.ilike(resolved_city)
        )
    )
    dup = existing.scalars().first()
    if dup:
        sync_saved_location_to_firestore(dup.id, dup.user_id, dup.city, dup.latitude, dup.longitude)
        return SavedLocationItem(
            id=dup.id,
            user_id=dup.user_id,
            city=dup.city,
            latitude=dup.latitude,
            longitude=dup.longitude,
            is_default=dup.is_default,
            created_at=dup.created_at.isoformat()
        )

    new_id = str(uuid.uuid4())
    loc_record = SavedLocationModel(
        id=new_id,
        user_id=payload.user_id,
        city=resolved_city,
        latitude=lat,
        longitude=lon,
        is_default=payload.is_default,
        created_at=datetime.utcnow()
    )
    db.add(loc_record)
    await db.commit()

    # Sync to Cloud Firestore
    sync_saved_location_to_firestore(new_id, payload.user_id, resolved_city, lat, lon)
    
    return SavedLocationItem(
        id=new_id,
        user_id=payload.user_id,
        city=resolved_city,
        latitude=lat,
        longitude=lon,
        is_default=payload.is_default,
        created_at=loc_record.created_at.isoformat()
    )

@router.delete("/{location_id}")
async def delete_saved_location(
    location_id: str,
    user_id: str = "demo-user",
    db: AsyncSession = Depends(get_db)
):
    await db.execute(
        delete(SavedLocationModel).where(
            SavedLocationModel.id == location_id,
            SavedLocationModel.user_id == user_id
        )
    )
    await db.commit()
    return {"status": "deleted", "id": location_id}
