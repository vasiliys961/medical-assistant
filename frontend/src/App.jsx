import React from 'react';  // ✅ Добавь эту строку!
import { useState, useEffect, useRef } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          age: 30,
          sex: "female"
        }),
      });
      const data = await res.json();
      const content = typeof data.response === 'string'
  ? data.response
  : data.response?.full_advice || data.response?.diagnosis || JSON.stringify(data.response, null, 2);

const aiMessage = {
  role: "assistant",
  content: content,
};
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ошибка: не удалось подключиться к серверу." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // === ГОЛОСОВОЙ ВВОД ===
  const startListening = async () => {
    setIsListening(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.start();

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    const sendAudio = async () => {
      mediaRecorder.stop();
      stream.getTracks().forEach((track) => track.stop());

      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");

      try {
        const res = await fetch("http://localhost:8000/api/voice/transcribe", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.text) {
          setInput(data.text);
        }
      } catch (err) {
        console.error("Ошибка распознавания:", err);
      }
    };

    mediaRecorder.addEventListener("stop", sendAudio);
  };

  const stopListening = () => {
    if (isListening) {
      setIsListening(false);
    }
  };
  // ====================

  useEffect(() => {
    setMessages([
      { role: "assistant", content: "Здравствуйте! Я ваш цифровой медицинский ассистент. Чем могу помочь?" },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f7f9fc",
    }}>
      <header style={{
        padding: "1rem",
        backgroundColor: "#007bff",
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "1.2rem",
      }}>
        🏥 Медицинский Ассистент
      </header>

      <div style={{
        flex: 1,
        padding: "1rem",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#007bff" : "#e9ecef",
              color: msg.role === "user" ? "white" : "black",
              padding: "0.75rem",
              borderRadius: "1rem",
              maxWidth: "70%",
              wordWrap: "break-word",
            }}
          >
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div style={{
            alignSelf: "flex-start",
            backgroundColor: "#e9ecef",
            padding: "0.75rem",
            borderRadius: "1rem",
            fontStyle: "italic",
          }}>
            Печатает...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{
        padding: "1rem",
        borderTop: "1px solid #ddd",
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
      }}>
        <button
          onMouseDown={startListening}
          onMouseUp={stopListening}
          disabled={isListening}
          style={{
            backgroundColor: isListening ? "#dc3545" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
          title={isListening ? "Говорю..." : "Нажмите и говорите"}
        >
          🎤
        </button>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите или скажите симптомы..."
          style={{
            flex: 1,
            padding: "0.75rem",
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
            resize: "none",
            maxHeight: "100px",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0 1rem",
            cursor: "pointer",
          }}
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
