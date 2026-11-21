import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Mic, 
  ScanSearch, 
  CloudSun, 
  TrendingUp, 
  AlertTriangle, 
  ChevronRight, 
  MapPin, 
  Droplets, 
  Wind, 
  Thermometer, 
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../store/useAuthStore';
import { useSync } from '../store/useSyncStore';
import { getTranslation } from '../data/languageData';
import { fetchWeatherForecast } from '../services/weatherService';
import { mandiService } from '../services/mandiService';
import { offlineStorage } from '../services/offlineStorage';
import Badge from '../components/common/Badge';

export default function Dashboard() {
  const { user, language } = useAuth();
  const { isOnline, pendingCount } = useSync();
  const t = getTranslation(language);

  const [weatherData, setWeatherData] = useState(null);
  const [recentDiagnoses, setRecentDiagnoses] = useState([]);
  const [nearbyMandiPrice, setNearbyMandiPrice] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const district = user?.district || 'Bhagalpur';
        const weather = await fetchWeatherForecast(district);
        setWeatherData(weather);
      } catch (e) {
        console.warn('Weather load error', e);
      } finally {
        setLoadingWeather(false);
      }

      try {
        const history = await offlineStorage.getDiagnoses();
        setRecentDiagnoses(history.slice(0, 2));
      } catch (e) {
        console.warn('Diagnosis load error', e);
      }

      try {
        const allPrices = mandiService.getAllPrices();
        const local = allPrices.find(p => p.district === user?.district) || allPrices[0];
        setNearbyMandiPrice(local);
      } catch (e) {
        console.warn('Mandi load error', e);
      }
    }

    loadDashboardData();
  }, [user]);

  const activeAlert = weatherData?.alerts?.[0];

  const moduleCards = [
    {
      id: 'voice',
      title: t.navVoice,
      desc: t.voiceSubtitle,
      icon: Mic,
      color: 'bg-agri-dark text-white',
      badge: 'Multilingual AI',
      link: '/voice-assistant',
      status: 'Ready to listen'
    },
    {
      id: 'crop',
      title: t.navCrop,
      desc: t.cropAdvisorySubtitle,
      icon: Sprout,
      color: 'bg-agri-green text-white',
      badge: '100% Offline ML',
      link: '/crop-advisory',
      status: 'Offline Ready'
    },
    {
      id: 'disease',
      title: t.navDisease,
      desc: t.diseaseSubtitle,
      icon: ScanSearch,
      color: 'bg-agri-accent text-agri-dark',
      badge: pendingCount > 0 ? `${pendingCount} Queued` : 'Photo AI',
      link: '/disease-detection',
      status: isOnline ? 'Online Scanner' : 'Queuing Offline'
    },
    {
      id: 'weather',
      title: t.navWeather,
      desc: t.weatherAlertsSubtitle,
      icon: CloudSun,
      color: 'bg-amber-600 text-white',
      badge: weatherData?.current?.condition || 'Live Radar',
      link: '/weather-alerts',
      status: `${weatherData?.current?.temperature || 26}°C • ${weatherData?.current?.humidity || 65}% Hum`
    },
    {
      id: 'market',
      title: t.navMarket,
      desc: t.marketPricesSubtitle,
      icon: TrendingUp,
      color: 'bg-agri-earth text-white',
      badge: 'data.gov.in',
      link: '/market-prices',
      status: nearbyMandiPrice ? `₹${nearbyMandiPrice.modalPrice}/Q in ${nearbyMandiPrice.district}` : 'Live Prices'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-agri-dark via-agri-dark to-agri-green rounded-3xl p-6 sm:p-8 text-white shadow-lift relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-agri-accent" />
              <span>{user?.village || 'Kahalgaon'}, {user?.district || 'Bhagalpur'}, {user?.state || 'Bihar'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight">
              {t.welcome}, {user?.name || 'Kisan Saathi'}!
            </h1>
            
            <p className="text-xs sm:text-sm text-white/85 max-w-xl">
              {t.allSystemsActive} (<strong>{user?.farmSize || '3.5'} Acres</strong>, {user?.soilType || 'Alluvial'}).
            </p>
          </div>

          {/* Quick Weather Snapshot Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shrink-0 min-w-[240px]">
            <div className="flex items-center justify-between text-xs text-white/80 mb-1">
              <span>{t.currentWeather}</span>
              <span className="font-mono text-[10px]">{weatherData?.lastUpdated || 'Updated'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Thermometer className="w-8 h-8 text-agri-accent shrink-0" />
              <div>
                <div className="text-2xl font-black">{weatherData?.current?.temperature ?? 26}°C</div>
                <div className="text-xs text-white/90">{weatherData?.current?.condition || 'Clear Sky'}</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-white/80">
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-sky-300" />
                {weatherData?.current?.humidity ?? 64}% {t.humidity}
              </span>
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-teal-200" />
                {weatherData?.current?.windSpeed ?? 10} km/h {t.windSpeed}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Agricultural Warning Banner */}
      {activeAlert && (
        <div className={`rounded-2xl p-4 border flex items-start justify-between gap-4 transition-all ${
          activeAlert.severity === 'warning' || activeAlert.severity === 'alert'
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-agri-light/60 border-agri-accent/40 text-agri-dark'
        }`}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
                  {activeAlert.badge}
                </span>
                <span className="text-xs text-amber-800 font-medium hidden sm:inline">
                  {activeAlert.englishTitle}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold mt-1">
                {activeAlert.title}
              </h3>
              <p className="text-xs text-agri-text/80 mt-1 max-w-3xl leading-relaxed">
                {activeAlert.message}
              </p>
            </div>
          </div>
          <Link
            to="/weather-alerts"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white text-agri-dark text-xs font-bold border border-agri-border hover:bg-agri-light shrink-0 self-center shadow-subtle"
          >
            <span>{t.openModule}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 5 Prominent Module Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-agri-dark">
            {t.fiveCoreModules}
          </h2>
          <span className="text-xs text-agri-muted">
            All systems synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleCards.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.id}
                to={mod.link}
                className="bg-white rounded-2xl p-5 border border-agri-border shadow-subtle hover:shadow-lift transition-all flex flex-col justify-between group hover:border-agri-green"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${mod.color} shadow-subtle`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant={mod.id === 'crop' ? 'green' : 'neutral'}>
                      {mod.badge}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-agri-dark group-hover:text-agri-green transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-agri-muted leading-relaxed mt-1">
                    {mod.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-agri-border/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-agri-text/70">{mod.status}</span>
                  <span className="text-agri-green font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    <span>{t.openModule}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Quick Voice Prompt Launcher */}
          <Link
            to="/voice-assistant"
            className="bg-gradient-to-br from-agri-light to-white rounded-2xl p-5 border border-agri-accent/40 shadow-subtle flex flex-col justify-between hover:border-agri-green transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-agri-dark text-white flex items-center justify-center">
                  <Mic className="w-5 h-5 text-agri-accent animate-pulse" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-agri-green text-white">
                  Fast Voice Query
                </span>
              </div>
              <h3 className="text-base font-bold text-agri-dark">
                {t.quickVoicePrompt}
              </h3>
              <p className="text-xs text-agri-muted mt-1 leading-relaxed">
                {t.voiceSubtitle}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-agri-border/60 text-right">
              <span className="text-xs font-bold text-agri-dark inline-flex items-center gap-1">
                <span>{t.tapMicToSpeak}</span>
                <ChevronRight className="w-3.5 h-3.5 text-agri-green" />
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Two-Column Bottom Widgets: Mandi Ticker & Recent Diagnoses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Mandi Rates Snapshot */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-agri-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-agri-dark">
                {user?.district || 'Bhagalpur'} {t.nearbyMandiHeading}
              </h3>
              <p className="text-xs text-agri-muted">
                Source: data.gov.in AGMARKNET • Rates in ₹ / Quintal
              </p>
            </div>
            <Link
              to="/market-prices"
              className="text-xs font-bold text-agri-green hover:underline flex items-center gap-1"
            >
              <span>{t.viewAllMandis}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {mandiService.getAllPrices().slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-agri-bg border border-agri-border/70 hover:bg-agri-light/40 transition-colors"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-agri-dark">{item.crop}</h4>
                  <p className="text-[11px] text-agri-muted">{item.mandi} • {t.arrivals}: {item.arrivalQtyQuintals} Q</p>
                </div>
                <div className="text-right">
                  <div className="text-sm sm:text-base font-extrabold text-agri-dark">
                    ₹{item.modalPrice.toLocaleString('en-IN')}
                    <span className="text-[10px] font-normal text-agri-muted">/Q</span>
                  </div>
                  <div className="text-[10px] font-semibold text-agri-green">
                    {item.priceChange}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leaf Diagnoses / Offline Sync Status */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-agri-border shadow-subtle flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-agri-dark">
                  {t.recentDiagnoses}
                </h3>
                <p className="text-xs text-agri-muted">
                  Plant Health History
                </p>
              </div>
              <Link
                to="/disease-detection"
                className="text-xs font-bold text-agri-green hover:underline flex items-center gap-1"
              >
                <span>{t.newDiagnosis}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentDiagnoses.length > 0 ? (
              <div className="space-y-3">
                {recentDiagnoses.map((diag) => (
                  <div key={diag.id} className="p-3 rounded-2xl bg-agri-bg border border-agri-border flex items-start gap-3">
                    <img 
                      src={diag.imageUrl} 
                      alt={diag.crop} 
                      className="w-12 h-12 rounded-xl object-cover border border-agri-border shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-agri-dark truncate">{diag.possible_disease}</span>
                        <Badge variant={diag.severity === 'Severe' || diag.severity === 'High' ? 'red' : 'amber'}>
                          {diag.severity}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-agri-muted mt-0.5">Crop: {diag.crop} • Confidence: {Math.round(diag.confidence * 100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-agri-bg border border-dashed border-agri-border text-center">
                <ScanSearch className="w-8 h-8 text-agri-green mx-auto mb-2 opacity-70" />
                <p className="text-xs font-semibold text-agri-dark">{t.recentDiagnoses}</p>
                <p className="text-[11px] text-agri-muted mt-1">{t.diseaseSubtitle}</p>
                <Link
                  to="/disease-detection"
                  className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-agri-dark text-white text-xs font-bold hover:bg-agri-green transition-colors"
                >
                  {t.newDiagnosis}
                </Link>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-agri-border text-center text-xs text-agri-muted">
            <span className="font-semibold text-agri-dark">Kisan Saathi</span> by Team INNOVIX (IIIT Bhagalpur)
          </div>
        </div>

      </div>

    </div>
  );
}
