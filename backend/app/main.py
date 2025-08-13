# backend/app/main.py
import os
import asyncio
import httpx
from datetime import datetime
from typing import Optional, Dict, List
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Конфигурация
from app.core.config import settings
from app.core.database import init_db

# Роуты
from app.api.auth import router as auth_router
from app.api.ecg import router as ecg_router
from app.api.xray import router as xray_router
from app.api.clinical import router as clinical_router
from app.api.voice import router as voice_router
from app.api.chat import router as chat_router

# AI Модули
from app.medical_ai.ecg_analyzer import EnhancedECGAnalyzer
from app.medical_ai.xray_analyzer import XRayAnalyzer
from app.medical_ai.mri_analyzer import MRIAnalyzer
from app.medical_ai.clinical_advisor import ClinicalAdvisor
from app.medical_ai.voice_processor import VoiceProcessor

# Сервисы
from app.services.openrouter_client import OpenRouterClient
from app.services.voice_service import VoiceService
from app.services.notification_service import NotificationService

app = FastAPI(
    title="🏥 Цифровой помощник врача",
    description="AI-powered медицинская система с голосовым интерфейсом",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",  # ✅ Добавь текущий порт фронтенда
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Глобальные сервисы
ecg_analyzer = None
xray_analyzer = None
mri_analyzer = None
clinical_advisor = None
voice_processor = None
openrouter_client = None
voice_service = None
notification_service = None

@app.on_event("startup")
async def startup_event():
    global ecg_analyzer, xray_analyzer, mri_analyzer, clinical_advisor, voice_processor
    global openrouter_client, voice_service, notification_service

    print("🚀 Запуск приложения: инициализация AI и сервисов...")

    try:
        ecg_analyzer = EnhancedECGAnalyzer()
        xray_analyzer = XRayAnalyzer()
        mri_analyzer = MRIAnalyzer()
        clinical_advisor = ClinicalAdvisor()
        voice_processor = VoiceProcessor()
        print("✅ AI-модули успешно загружены")
    except Exception as e:
        print(f"❌ Ошибка при загрузке AI-модулей: {e}")
        raise

    try:
        openrouter_client = OpenRouterClient()
        voice_service = VoiceService()
        notification_service = NotificationService()
        print("✅ Сервисы успешно инициализированы")
    except Exception as e:
        print(f"❌ Ошибка при инициализации сервисов: {e}")
        raise

    try:
        await init_db()
        print("✅ База данных подключена")
    except Exception as e:
        print(f"❌ Ошибка подключения к БД: {e}")
        raise

    # ✅ Добавь AI-модули в состояние приложения
    app.state.clinical_advisor = clinical_advisor
    app.state.ecg_analyzer = ecg_analyzer
    app.state.xray_analyzer = xray_analyzer
    app.state.mri_analyzer = mri_analyzer
    app.state.voice_processor = voice_processor

@app.get("/api/health")
async def health_check():
    openrouter_status = "unavailable"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "openai/gpt-3.5-turbo",
                    "messages": [{"role": "user", "content": "hi"}],
                    "max_tokens": 5
                }
            )
            openrouter_status = "healthy" if response.status_code == 200 else "degraded"
    except Exception:
        pass

    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": app.version,
        "services": {
            "api": "running",
            "database": "connected",
            "openrouter": openrouter_status
        },
        "ai_modules": {
            "ecg": "loaded" if ecg_analyzer else "failed",
            "xray": "loaded" if xray_analyzer else "failed",
            "mri": "loaded" if mri_analyzer else "failed",
            "voice": "loaded" if voice_processor else "failed",
            "clinical": "loaded" if clinical_advisor else "failed"
        }
    }

# Подключаем роуты (без авторизации)
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(ecg_router, prefix="/api/ecg", tags=["ecg"])
app.include_router(xray_router, prefix="/api/xray", tags=["xray"])
app.include_router(clinical_router, prefix="/api/clinical", tags=["clinical"])
app.include_router(voice_router, prefix="/api/voice", tags=["voice"])
app.include_router(chat_router, prefix="/api", tags=["chat"])

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1,
        log_level="info"
    )
