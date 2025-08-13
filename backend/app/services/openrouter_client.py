# app/services/openrouter_client.py
import httpx
from typing import Dict, Any
from app.core.config import settings


class OpenRouterClient:
    def __init__(self):
        if not settings.OPENROUTER_API_KEY:
            raise ValueError("OPENROUTER_API_KEY не задан в .env")
        
        self.api_key = settings.OPENROUTER_API_KEY
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"  # ← Убраны лишние пробелы
        self.default_model = "anthropic/claude-sonnet-4"  # ← Лучше назвать default_model

        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Medical Assistant",
            "Content-Type": "application/json"
        }

    async def chat(self, message: str, model: str = None) -> str:
        """
        Отправляет сообщение в OpenRouter.
        Можно указать модель. Если не указана — используется default_model.
        """
        # Если модель не передана — используем default_model
        model_to_use = model or self.default_model

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    self.api_url,
                    headers=self.headers,
                    json={
                        "model": model_to_use,
                        "messages": [
                            {"role": "system", "content": "Вы — медицинский ассистент. Отвечайте кратко и по делу."},
                            {"role": "user", "content": message}
                        ],
                        "max_tokens": 1000,
                        "temperature": 0.7
                    }
                )
                result = response.json()
                return result["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Ошибка при обращении к AI: {str(e)}"
