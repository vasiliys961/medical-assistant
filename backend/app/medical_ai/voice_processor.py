# backend/app/medical_ai/voice_processor.py
from typing import Dict, Any

class VoiceProcessor:
    """
    Обработчик голосовых команд для медицинского ассистента
    """
    def __init__(self):
        print("🧠 Загрузка модели голосового процессора...")

    def process_voice_command(self, text: str, user_type: str = "patient") -> Dict[str, Any]:
        """
        Обрабатывает голосовую команду и возвращает ответ
        """
        try:
            # Простая логика обработки (в реальности — вызов NLP-модели)
            if "боль" in text.lower():
                response = "Пожалуйста, уточните, где у вас болит."
            elif "температура" in text.lower():
                response = "Измерьте температуру и сообщите значение."
            else:
                response = "Я вас слушаю. Чем могу помочь?"

            return {
                "intent": "general_inquiry",
                "response_text": response,
                "confidence": 0.9,
                "user_type": user_type
            }
        except Exception as e:
            return {
                "error": str(e),
                "fallback": "Не удалось обработать команду"
            }