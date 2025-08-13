# backend/app/api/clinical.py
# backend/app/api/clinical.py
from fastapi import APIRouter, Form, Depends, HTTPException
from typing import Dict, Any
from app.core.security import verify_token
from app.medical_ai.clinical_advisor import ClinicalAdvisor  # ✅ Правильно

router = APIRouter()

advisor = ClinicalAdvisor()

@router.post("/advice")
async def get_clinical_advice(
    symptoms: str = Form(...),
    patient_age: int = Form(...),
    patient_sex: str = Form(...),
    token: str = Depends(verify_token)
) -> Dict[str, Any]:
    try:
        advice = advisor.get_advice(symptoms, patient_age, patient_sex)
        return {
            "success": True,
            "advice": advice
        }
    except Exception as e:
        raise HTTPException(500, f"Advice generation failed: {str(e)}")