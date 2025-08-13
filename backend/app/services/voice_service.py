# backend/app/services/voice_service.py
from typing import Optional  # ✅ Обязательно!
import os
import tempfile
import speech_recognition as sr
from gtts import gTTS
from pydub import AudioSegment

class VoiceService:
    def __init__(self):
        self.recognizer = sr.Recognizer()

    def speech_to_text(self, audio_file_path: str, language: str = "ru-RU") -> Optional[str]:
        try:
            with sr.AudioFile(audio_file_path) as source:
                audio = self.recognizer.record(source)
            text = self.recognizer.recognize_google(audio, language=language)
            return text
        except Exception as e:
            print(f"Ошибка распознавания: {e}")
            return None

    def text_to_speech(self, text: str, language: str = "ru") -> str:
        try:
            tts = gTTS(text=text, lang=language, slow=False)
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
                tts.save(tmp.name)
                return tmp.name
        except Exception as e:
            print(f"Ошибка синтеза речи: {e}")
            return ""