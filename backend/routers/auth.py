import uuid
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

from backend.database import get_db
from backend.models import UserModel, NotificationPreferenceModel

router = APIRouter(prefix="/api/auth", tags=["Auth & Profile"])

class RegisterRequest(BaseModel):
    email: str
    name: str
    password: Optional[str] = None
    persona: str = "health"
    language: str = "en"

class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None

class UserProfileResponse(BaseModel):
    id: str
    email: str
    name: str
    default_persona: str
    preferred_language: str
    theme: str

@router.post("/register", response_model=UserProfileResponse)
async def register_user(
    payload: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(UserModel).where(UserModel.email == payload.email))
    existing = result.scalars().first()
    if existing:
        return UserProfileResponse(
            id=existing.id,
            email=existing.email,
            name=existing.name or "User",
            default_persona=existing.default_persona,
            preferred_language=existing.preferred_language,
            theme=existing.theme
        )
    
    user_id = str(uuid.uuid4())
    user_rec = UserModel(
        id=user_id,
        email=payload.email,
        name=payload.name,
        default_persona=payload.persona,
        preferred_language=payload.language,
        theme="dark",
        created_at=datetime.utcnow()
    )
    db.add(user_rec)
    
    pref_rec = NotificationPreferenceModel(
        id=str(uuid.uuid4()),
        user_id=user_id,
        severe_enabled=True,
        moderate_enabled=True
    )
    db.add(pref_rec)
    await db.commit()

    return UserProfileResponse(
        id=user_id,
        email=payload.email,
        name=payload.name,
        default_persona=payload.persona,
        preferred_language=payload.language,
        theme="dark"
    )

@router.post("/login", response_model=UserProfileResponse)
async def login_user(
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(UserModel).where(UserModel.email == payload.email))
    user = result.scalars().first()
    if not user:
        # Create user automatically for quick demo
        user = UserModel(
            id=str(uuid.uuid4()),
            email=payload.email,
            name=payload.email.split("@")[0].title(),
            default_persona="health",
            preferred_language="en",
            theme="dark"
        )
        db.add(user)
        await db.commit()

    return UserProfileResponse(
        id=user.id,
        email=user.email,
        name=user.name or "User",
        default_persona=user.default_persona,
        preferred_language=user.preferred_language,
        theme=user.theme
    )

@router.put("/preferences")
async def update_user_preferences(
    user_id: str = Body(..., embed=True),
    persona: Optional[str] = Body(None, embed=True),
    language: Optional[str] = Body(None, embed=True),
    theme: Optional[str] = Body(None, embed=True),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalars().first()
    if user:
        if persona:
            user.default_persona = persona
        if language:
            user.preferred_language = language
        if theme:
            user.theme = theme
        await db.commit()
        return {"status": "updated", "persona": user.default_persona, "language": user.preferred_language}
    return {"status": "not_found"}
