// frontend/src/App.jsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Pages (пока простые заглушки)
import Login from './pages/Login';
import ChatPage from './pages/ChatPage';

// Простые компоненты для тестирования
const SimpleLogin = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        🏥 Medical Assistant
      </h2>
      <p className="text-center text-gray-600">Временная страница входа</p>
      <button 
        onClick={() => window.location.href = '/dashboard'}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
      >
        Войти (тест)
      </button>
    </div>
  </div>
);

const SimpleDashboard = () => (
  <div className="min-h-screen bg-gray-100">
    <nav className="bg-blue-600 text-white p-4">
      <h1 className="text-xl font-bold">🏥 Medical Assistant</h1>
    </nav>
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-2">💬 Чат</h3>
          <p className="text-gray-600 mb-4">Консультация с ИИ</p>
          <button 
            onClick={() => window.location.href = '/chat'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Открыть
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-2">📈 ЭКГ Анализ</h3>
          <p className="text-gray-600 mb-4">Анализ кардиограммы</p>
          <button 
            onClick={() => alert('ЭКГ анализ в разработке')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Анализировать
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-2">🩻 Рентген</h3>
          <p className="text-gray-600 mb-4">Анализ снимков</p>
          <button 
            onClick={() => alert('Рентген анализ в разработке')}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Загрузить
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-2">🎤 Голосовая консультация</h3>
          <p className="text-gray-600 mb-4">Голосовой помощник</p>
          <button 
            onClick={() => alert('Голосовая консультация в разработке')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Начать
          </button>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<SimpleLogin />} />
          <Route path="/dashboard" element={<SimpleDashboard />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Роутер для дашбордов в зависимости от типа пользователя
const DashboardRouter = () => {
  const { user } = useContext(AuthContext);
  
  if (user?.type === 'doctor') {
    return <DoctorDashboard />;
  } else {
    return <PatientDashboard />;
  }
};

export default App;
