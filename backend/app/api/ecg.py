# backend/app/api/ecg.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import Dict, Any
from app.core.security import verify_token
from app.medical_ai.ecg_analyzer import EnhancedECGAnalyzer
from app.services.openrouter_client import OpenRouterClient
import numpy as np
import io
import wave

router = APIRouter()

ecg_analyzer = EnhancedECGAnalyzer()
openrouter_client = OpenRouterClient()

@router.post("/analyze")
async def analyze_ecg(
    file: UploadFile = File(...),
    token: str = Depends(verify_token)
) -> Dict[str, Any]:
    if not file.filename.endswith(('.wav', '.ecg')):
        raise HTTPException(400, "Only .wav and .ecg files supported")

    try:
        contents = await file.read()
        with wave.open(io.BytesIO(contents), 'rb') as wav:
            frames = wav.readframes(wav.getnframes())
            sample_rate = wav.getframerate()
            ecg_data = np.frombuffer(frames, dtype=np.int16)[:1000]

        results = ecg_analyzer.analyze_ecg(ecg_data, sampling_rate=sample_rate)
        ai_analysis = await openrouter_client.analyze_ecg(results, patient_age=45)

        return {
            "success": True,
            "analysis": results,
            "ai_interpretation": ai_analysis
        }
    except Exception as e:
        raise HTTPException(500, f"ECG analysis failed: {str(e)}")