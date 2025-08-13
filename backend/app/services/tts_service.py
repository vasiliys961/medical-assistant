# app/services/tts_service.py
from gtts import gTTS
import pygame
import tempfile
import os

class TTSService:
    def __init__(self):
        pygame.mixer.init()

    def speak(self, text: str, lang: str = "ru"):
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as f:
            temp_file = f.name

        try:
            tts = gTTS(text=text, lang=lang)
            tts.save(temp_file)

            pygame.mixer.music.load(temp_file)
            pygame.mixer.music.play()

            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
        finally:
            if os.path.exists(temp_file):
                os.unlink(temp_file)