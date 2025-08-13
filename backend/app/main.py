# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

# Импорт API роутеров
from app.api import auth, chat, clinical, ecg, voice, xray
from app.core.config import get_settings
from app.core.database import engine, Base

# Создание таблиц БД
Base.metadata.create_all(bind=engine)

settings = get_settings()
app = FastAPI(
    title="Medical Assistant API",
    description="AI-powered medical assistant with ECG, X-Ray analysis and voice consultation",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров API
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(clinical.router, prefix="/api/clinical", tags=["clinical"])
app.include_router(ecg.router, prefix="/api/ecg", tags=["ecg-analysis"])
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])
app.include_router(xray.router, prefix="/api/xray", tags=["xray-analysis"])

# Статические файлы для загруженных медицинских файлов
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {
        "message": "Medical Assistant API",
        "version": "1.0.0",
        "features": [
            "Chat consultation",
            "ECG analysis", 
            "X-Ray analysis",
            "Voice consultation",
            "Clinical advisor"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "medical-assistant"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
