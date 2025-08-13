// frontend/src/components/Navigation.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null; // Не показываем навигацию для неавторизованных
  }

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Логотип */}
          <Link to="/dashboard" className="text-white text-xl font-bold">
            🏥 Medical Assistant
          </Link>

          {/* Основное меню */}
          <div className="flex space-x-6">
            <Link 
              to="/dashboard" 
              className="text-white hover:text-blue-200 transition-colors"
            >
              📊 Дашборд
            </Link>
            
            <Link 
              to="/chat" 
              className="text-white hover:text-blue-200 transition-colors"
            >
              💬 Чат
            </Link>
            
            <Link 
              to="/ecg-analysis" 
              className="text-white hover:text-blue-200 transition-colors"
            >
              📈 Анализ ЭКГ
            </Link>
            
            <Link 
              to="/xray-analysis" 
              className="text-white hover:text-blue-200 transition-colors"
            >
              🩻 Рентген
            </Link>
            
            <Link 
              to="/voice-consultation" 
              className="text-white hover:text-blue-200 transition-colors"
            >
              🎤 Голосовая консультация
            </Link>
          </div>

          {/* Пользователь и выход */}
          <div className="flex items-center space-x-4">
            <span className="text-white">
              👤 {user.name} ({user.type})
            </span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
