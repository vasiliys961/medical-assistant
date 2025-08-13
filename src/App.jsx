// frontend/src/App.jsx
import { useState, useEffect, useRef } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
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
      });
      const data = await res.json();
      const aiMessage = {
        role: "assistant",
        content: data.response || "Не удалось получить ответ.",
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
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите вопрос (например: 'Как лечить гипертонию?')"
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
