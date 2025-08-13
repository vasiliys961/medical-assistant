# backend/app/api/xray.py
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import Dict, Any
from app.core.security import verify_token
from app.medical_ai.xray_analyzer import XRayAnalyzer
from app.services.openrouter_client import OpenRouterClient

router = APIRouter(prefix="/api/xray", tags=["xray"])

xray_analyzer = XRayAnalyzer()
openrouter_client = OpenRouterClient()

@router.post("/analyze")
async def analyze_xray(
    file: UploadFile = File(...),
    study_type: str = Form("chest"),
    body_part: str = Form("lungs"),
    token: str = Depends(verify_token)
) -> Dict[str, Any]:
    try:
        contents = await file.read()
        results = xray_analyzer.analyze_image(contents, study_type, body_part)
        ai_analysis = await openrouter_client.analyze_xray(results, study_type, body_part)

        return {
            "success": True,
            "analysis": results,
            "ai_interpretation": ai_analysis
        }
    except Exception as e:
        raise HTTPException(500, f"X-ray analysis failed: {str(e)}")