# test_openrouter.py
# test_openrouter.py
import asyncio
import sys
import os

# Добавляем путь, чтобы можно было импортировать из app/
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.openrouter_client import OpenRouterClient


async def test():
    try:
        client = OpenRouterClient()
        print("✅ OpenRouterClient успешно создан")

        # Используем правильный метод .chat(str)
        response = await client.chat("Привет! Сколько будет 2 плюс 2?")
        
        if response.startswith("Ошибка"):
            print("❌ AI вернул ошибку:", response)
        else:
            print("✅ Успешно подключено к OpenRouter!")
            print("💬 Ответ ИИ:", response)

    except Exception as e:
        print("❌ Критическая ошибка:", str(e))


if __name__ == "__main__":
    asyncio.run(test())