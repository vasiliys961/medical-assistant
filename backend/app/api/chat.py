# backend/app/api/chat.py
from fastapi import APIRouter, Request

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/")
async def chat_handler(request: Request):
    try:
        # Парсим тело запроса
        body = await request.json()
        message = body.get("message", "").strip()
        age = body.get("age", 30)
        sex = body.get("sex", "female")

        if not message:
            return {"response": "Введите симптомы."}

        # Получаем AI-советник
        advisor = request.app.state.clinical_advisor
        if not advisor:
            return {"response": "AI-модуль временно недоступен."}

        # Получаем рекомендации
        result = await advisor.get_advice(symptoms=message, patient_age=age, patient_sex=sex)

        # Извлекаем только текст для отображения
        advice = result.get("full_advice", "Нет подробного совета.")
        if not isinstance(advice, str):
            advice = str(advice)

        return {"response": advice}

    except Exception as e:
        return {"response": f"Ошибка сервера: {str(e)}"}