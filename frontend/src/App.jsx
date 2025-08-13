// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ChatPage from './pages/ChatPage';
import ECGAnalysis from './pages/ECGAnalysis';
import XRayAnalysis from './pages/XRayAnalysis';
import VoiceConsultation from './pages/VoiceConsultation';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';

// Components
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Защищенные маршруты */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } />
              
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              
              <Route path="/ecg-analysis" element={
                <ProtectedRoute>
                  <ECGAnalysis />
                </ProtectedRoute>
              } />
              
              <Route path="/xray-analysis" element={
                <ProtectedRoute>
                  <XRayAnalysis />
                </ProtectedRoute>
              } />
              
              <Route path="/voice-consultation" element={
                <ProtectedRoute>
                  <VoiceConsultation />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
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
