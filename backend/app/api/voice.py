# backend/app/api/voice.py
from fastapi import APIRouter, File, UploadFile
from pydub import AudioSegment
import speech_recognition as sr
import tempfile
import os

router = APIRouter(prefix="/api/voice", tags=["voice"])

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Преобразует аудио в текст (голос → текст)
    """
    # Сохраним файл временно
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_file:
        content = await file.read()
        temp_file.write(content)
        temp_file_path = temp_file.name

    try:
        # Конвертируем в WAV
        audio = AudioSegment.from_file(temp_file_path)
        wav_path = temp_file_path.replace(".webm", ".wav")
        audio.export(wav_path, format="wav")

        # Распознавание речи
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data, language="ru-RU")

        return {"text": text}
    except Exception as e:
        return {"error": str(e)}
    finally:
        # Удаляем временные файлы
        if os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        if os.path.exists(wav_path):
            os.unlink(wav_path)