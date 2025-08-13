# backend/app/services/notification_service.py
from typing import Dict, Any
from datetime import datetime

class NotificationService:
    """
    Сервис для отправки уведомлений (email, push, SMS)
    """
    def __init__(self):
        print("✅ Notification Service загружен")

    def send_notification(self, user_id: int, title: str, message: str, method: str = "push") -> Dict[str, Any]:
        try:
            notification = {
                "user_id": user_id,
                "title": title,
                "message": message,
                "method": method,
                "status": "sent",
                "timestamp": datetime.now().isoformat()
            }
            print(f"🔔 Уведомление отправлено: {notification}")
            return {"success": True, "notification": notification}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def send_appointment_reminder(self, user_id: int, doctor_name: str, time: str) -> Dict[str, Any]:
        title = "Напоминание о приёме"
        message = f"У вас приём у врача {doctor_name} в {time}"
        return self.send_notification(user_id, title, message, method="push")

    def send_analysis_result(self, user_id: int, analysis_type: str, status: str) -> Dict[str, Any]:
        title = f"Результат {analysis_type}"
        message = f"Анализ {analysis_type} готов: {status}"
        return self.send_notification(user_id, title, message, method="push")