# backend/app/models/user.py
from sqlalchemy import Column, Integer, String, Enum, Boolean
from app.core.database import Base
from enum import Enum as PyEnum

class UserType(PyEnum):
    doctor = "doctor"
    patient = "patient"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    user_type = Column(Enum(UserType))
    full_name = Column(String)
    specialization = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)