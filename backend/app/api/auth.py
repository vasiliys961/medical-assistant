# backend/app/api/auth.py
from fastapi import APIRouter, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.models.user import User, UserType
from app.core.security import get_password_hash, create_access_token
from app.core.database import get_db

# Создаём роутер
router = APIRouter()

@router.post("/register")
async def register(
    username: str = Form(...),
    password: str = Form(...),
    user_type: str = Form(...),
    full_name: str = Form(...),
    specialization: Optional[str] = Form(None),
    license_number: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Регистрация врача или пациента
    """
    # Проверка типа пользователя
    try:
        user_type_enum = UserType(user_type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user_type. Use 'doctor' or 'patient'")

    # Проверка, существует ли пользователь
    existing = db.query(User).filter(User.username == username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Пользователь с таким именем уже существует")

    # Хешируем пароль
    hashed_password = get_password_hash(password)

    # Создаём пользователя
    user = User(
        username=username,
        password_hash=hashed_password,
        user_type=user_type_enum,
        full_name=full_name,
        specialization=specialization,
        license_number=license_number,
        is_verified=(user_type_enum == UserType.patient)  # Пациенты верифицируются автоматически
    )

    # Сохраняем в БД
    db.add(user)
    db.commit()
    db.refresh(user)

    # Генерируем JWT-токен
    access_token = create_access_token(data={
        "sub": user.username,
        "user_type": user.user_type.value,
        "user_id": user.id
    })

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "user_type": user.user_type.value,
            "full_name": user.full_name,
            "is_verified": user.is_verified,
            "specialization": user.specialization,
            "license_number": user.license_number
        }
    }