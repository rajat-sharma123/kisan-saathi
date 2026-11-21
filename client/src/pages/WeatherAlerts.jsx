import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  RefreshCw, 
  Bell, 
  Sun, 
  CloudRain,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../store/useAuthStore';
import { fetchWeatherForecast, DISTRICT_COORDINATES } from '../services/weatherService';
import { getTranslation } from '../data/languageData';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function WeatherAlerts() {
  const { user, language } = useAuth();
  const t = getTranslation(language);
  const [selectedDistrict, setSelectedDistrict] = useState(user?.district || 'Bhagalpur');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState('temp'); // 'temp' or 'rain'

  const loadWeather = async (district) => {
    setLoading(true);
    try {
      const data = await fetchWeatherForecast(district);
      setWeatherData(data);
    } catch (e) {
      console.warn('Weather fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedDistrict);
  }, [selectedDistrict]);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLoading(true);
          try {
            const data = await fetchWeatherForecast('My Location', position.coords);
            setWeatherData(data);
          } catch (e) {
            console.warn(e);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          alert('GPS location permission denied. You can select your district from the dropdown.');
        }
      );
    } else {
      alert('Geolocation not supported by your browser.');
    }
  };

  const toggleNotifications = () => {
    if (!notificationEnabled && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationEnabled(true);
          new Notification('किसान साथी मौसम अलर्ट सक्रिय!', {
            body: 'आपको महत्वपूर्ण कृषि मौसम चेतावनियां समय पर प्राप्त होंगी।',
            icon: '/favicon.svg'
          });
        }
      });
    } else {
      setNotificationEnabled(!notificationEnabled);
    }
  };

  if (loading && !weatherData) {
    return <LoadingSpinner text="ताजा उपग्रह मौसम डेटा लोड हो रहा है... / Loading Live Open-Meteo Weather..." />;
  }

  const current = weatherData?.current;
  const forecast = weatherData?.sevenDayForecast || [];
  const hourly = weatherData?.hourlyChartData || [];
  const alerts = weatherData?.alerts || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-agri-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-600 text-white">
              <CloudSun className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-agri-dark font-sans">
                {t.weatherAlertsTitle}
              </h1>
              <p className="text-xs text-agri-muted">
                {t.weatherAlertsSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Location Dropdown & GPS */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-xl border border-agri-border text-xs font-bold bg-agri-bg text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green/30"
            >
              {Object.keys(DISTRICT_COORDINATES).map((dist) => (
                <option key={dist} value={dist}>
                  {dist} ({DISTRICT_COORDINATES[dist].state})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUseCurrentLocation}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-agri-light text-agri-dark text-xs font-bold border border-agri-accent hover:bg-agri-accent/20 transition-colors shadow-subtle"
            title="Use device GPS location"
          >
            <Compass className="w-3.5 h-3.5 text-agri-green" />
            <span className="hidden sm:inline">{t.useGps || t.gpsLocation}</span>
          </button>

          <button
            onClick={toggleNotifications}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              notificationEnabled
                ? 'bg-agri-green text-white border-agri-green'
                : 'bg-agri-bg text-agri-text border-agri-border hover:bg-agri-light'
            }`}
            title="Enable browser notifications for urgent weather alerts"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{notificationEnabled ? t.notificationsOn : t.pushNotifications}</span>
          </button>
        </div>
      </div>

      {/* Current Weather Big Hero Card */}
      <div className="bg-gradient-to-r from-agri-dark via-agri-dark to-agri-green rounded-3xl p-6 sm:p-8 text-white shadow-lift relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-agri-accent" />
              <span>{weatherData?.location}</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black font-sans tracking-tight">
                {current?.temperature}°C
              </span>
              <span className="text-sm text-white/80">
                {current?.apparentTemperature}°C
              </span>
            </div>

            <h3 className="text-lg font-bold text-white/95">
              {current?.condition}
            </h3>
          </div>

          {/* Meteorological Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="p-2.5">
              <span className="text-xs text-white/70 block">{t.relativeHumidity}</span>
              <span className="text-lg font-black flex items-center gap-1 mt-0.5">
                <Droplets className="w-4 h-4 text-sky-300" />
                {current?.humidity}%
              </span>
            </div>

            <div className="p-2.5">
              <span className="text-xs text-white/70 block">{t.windSpeed}</span>
              <span className="text-lg font-black flex items-center gap-1 mt-0.5">
                <Wind className="w-4 h-4 text-teal-300" />
                {current?.windSpeed} km/h
              </span>
            </div>

            <div className="p-2.5">
              <span className="text-xs text-white/70 block">{t.rainProbability}</span>
              <span className="text-lg font-black flex items-center gap-1 mt-0.5">
                <CloudRain className="w-4 h-4 text-blue-300" />
                {forecast[0]?.rainProb || 0}%
              </span>
            </div>
          </div>

        </div>

        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70">
          <span>Open-Meteo Satellite & WMO Stations</span>
          <span>{weatherData?.lastUpdated}</span>
        </div>
      </div>

      {/* Agricultural Intelligence Action Rules Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-agri-dark flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-agri-green" />
          <span>{t.actionableAdvisories}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border shadow-subtle flex flex-col justify-between ${
                alert.severity === 'warning' || alert.severity === 'alert'
                  ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                  : alert.severity === 'safe'
                    ? 'bg-agri-light/60 border-agri-accent/40 text-agri-dark'
                    : 'bg-white border-agri-border text-agri-text'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant={alert.severity === 'safe' ? 'green' : 'amber'}>
                    {alert.badge}
                  </Badge>
                  <span className="text-[11px] font-semibold opacity-70">
                    {alert.type}
                  </span>
                </div>

                <h4 className="text-sm font-bold leading-snug">
                  {alert.title}
                </h4>
                <p className="text-xs text-agri-muted font-medium mt-0.5">
                  {alert.englishTitle}
                </p>

                <p className="text-xs mt-2 leading-relaxed opacity-90">
                  {alert.message}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-black/10 text-[11px] font-bold text-agri-dark">
                {t.recommendedStep}: {alert.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 24-Hour Forecast Chart & 7-Day Matrix */}
      <div className="bg-white rounded-3xl p-6 border border-agri-border shadow-subtle space-y-6">
        
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agri-border pb-4">
          <div>
            <h3 className="text-base font-bold text-agri-dark">
              {t.hourlyCurve}
            </h3>
            <p className="text-xs text-agri-muted">
              {t.weatherSummary || '24-Hour Weather Curve'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveChartTab('temp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeChartTab === 'temp'
                  ? 'bg-agri-dark text-white'
                  : 'bg-agri-bg text-agri-muted hover:text-agri-dark'
              }`}
            >
              {t.temperature} (°C)
            </button>
            <button
              onClick={() => setActiveChartTab('rain')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeChartTab === 'rain'
                  ? 'bg-agri-dark text-white'
                  : 'bg-agri-bg text-agri-muted hover:text-agri-dark'
              }`}
            >
              {t.rainProbability} (%)
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === 'temp' ? (
              <AreaChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#568B35" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#568B35" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E9DE" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#687568' }} />
                <YAxis unit="°C" domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 11, fill: '#687568' }} />
                <Tooltip 
                  formatter={(val) => [`${val}°C`, t.temperature]} 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E3E9DE', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#315D2A" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradient)" />
              </AreaChart>
            ) : (
              <BarChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E9DE" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#687568' }} />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: '#687568' }} />
                <Tooltip 
                  formatter={(val) => [`${val}%`, t.rainProbability]} 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E3E9DE', fontSize: '12px' }}
                />
                <Bar dataKey="rainProb" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* 7-Day Forecast Grid */}
        <div className="pt-4 border-t border-agri-border">
          <h4 className="text-sm font-bold text-agri-dark mb-3">
            {t.sevenDayForecast}
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecast.map((day, idx) => (
              <div
                key={day.date}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  idx === 0 
                    ? 'bg-agri-light/60 border-agri-accent' 
                    : 'bg-agri-bg border-agri-border/70 hover:bg-agri-light/30'
                }`}
              >
                <p className="text-xs font-bold text-agri-dark">{day.dayName}</p>
                <p className="text-[10px] text-agri-muted">{day.date.slice(5)}</p>

                <div className="my-2 text-agri-green flex justify-center">
                  <Sun className="w-6 h-6" />
                </div>

                <div className="text-xs font-extrabold text-agri-dark">
                  {day.maxTemp}° / <span className="text-agri-muted font-normal">{day.minTemp}°</span>
                </div>

                <div className="mt-1.5 text-[10px] font-semibold text-sky-700 flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3" />
                  <span>{day.rainProb}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
