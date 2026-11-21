import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/useAuthStore';
import { SyncProvider } from './store/useSyncStore';
import Layout from './components/layout/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VoiceAssistant from './pages/VoiceAssistant';
import CropAdvisory from './pages/CropAdvisory';
import DiseaseDetection from './pages/DiseaseDetection';
import WeatherAlerts from './pages/WeatherAlerts';
import MarketPrices from './pages/MarketPrices';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <SyncProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/voice-assistant" element={<VoiceAssistant />} />
              <Route path="/crop-advisory" element={<CropAdvisory />} />
              <Route path="/disease-detection" element={<DiseaseDetection />} />
              <Route path="/weather-alerts" element={<WeatherAlerts />} />
              <Route path="/market-prices" element={<MarketPrices />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </SyncProvider>
    </AuthProvider>
  );
}
