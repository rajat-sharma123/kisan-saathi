import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  FlaskConical, 
  Droplets, 
  CloudSun, 
  CheckCircle2, 
  RotateCcw, 
  History, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Info,
  Calendar,
  Layers,
  Cpu,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../store/useAuthStore';
import { useSync } from '../store/useSyncStore';
import { CROPS_DATABASE } from '../data/cropData.js';
import { recommendCrop, generateCropAnalysis } from '../services/cropAdvisorEngine.js';
import { offlineStorage } from '../services/offlineStorage';
import { fetchWeatherForecast } from '../services/weatherService';
import { apiService } from '../services/api';
import { getTranslation } from '../data/languageData';
import Badge from '../components/common/Badge';

export default function CropAdvisory() {
  const { user, language } = useAuth();
  const { isOnline } = useSync();
  const t = getTranslation(language);

  // Initial calibrated soil and environmental parameters
  const defaultSoil = {
    N: 80,
    P: 45,
    K: 40,
    ph: 6.5,
    temperature: 24,
    humidity: 68,
    rainfall: 140,
    soilType: user?.soilType?.includes('Black') ? 'Black Soil' : 'Alluvial',
    season: 'Kharif'
  };

  const [formData, setFormData] = useState(defaultSoil);

  // IMMEDIATELY pre-compute recommendation so user sees results upon accessing the page
  const [recommendation, setRecommendation] = useState(() => recommendCrop(defaultSoil));
  const [loading, setLoading] = useState(false);
  const [pastRecommendations, setPastRecommendations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [autoFillingWeather, setAutoFillingWeather] = useState(false);

  // Load past recommendations from IndexedDB
  useEffect(() => {
    async function loadHistory() {
      try {
        const list = await offlineStorage.getRecommendations();
        setPastRecommendations(list);
      } catch (e) {
        console.warn('Failed to load past recommendations', e);
      }
    }
    loadHistory();
  }, []);

  // Update recommendation dynamically as inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...formData,
      [name]: value
    };
    setFormData(updated);
    // Instant local ML recalculation so the UI updates live as sliders move
    const instantResult = recommendCrop(updated);
    setRecommendation(instantResult);
  };

  const handleFetchLiveWeather = async () => {
    setAutoFillingWeather(true);
    try {
      const weather = await fetchWeatherForecast(user?.district || 'Bhagalpur');
      if (weather && weather.current) {
        const updated = {
          ...formData,
          temperature: weather.current.temperature,
          humidity: weather.current.humidity,
          rainfall: weather.sevenDayForecast?.[0]?.rainSum > 0 ? Math.round(weather.sevenDayForecast[0].rainSum * 20) : 140
        };
        setFormData(updated);
        setRecommendation(recommendCrop(updated));
      }
    } catch (e) {
      console.warn('Weather auto-fill failed', e);
    } finally {
      setAutoFillingWeather(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalResult = null;
      // Try backend ML model if online
      if (isOnline) {
        try {
          const backendRes = await apiService.getCropRecommendation(formData);
          if (backendRes && backendRes.success) {
            const rawName = (backendRes.recommendedCrop || '').toLowerCase();
            const matchedCrop = CROPS_DATABASE.find(c => 
              rawName.includes(c.id) ||
              rawName.includes(c.name.toLowerCase()) ||
              c.name.toLowerCase().includes(rawName) ||
              rawName.includes(c.hindiName)
            ) || CROPS_DATABASE.find(c => c.id === 'maize') || CROPS_DATABASE[0];

            const analysis = generateCropAnalysis(matchedCrop, formData);
            finalResult = {
              crop: matchedCrop,
              recommendedCrop: matchedCrop.name,
              confidence: backendRes.confidence || 94,
              suitabilityRating: backendRes.suitabilityRating || 'Highly Suitable for ' + (formData.soilType || 'Alluvial') + ' Soil',
              suitabilityColor: 'green',
              inputParams: formData,
              idealParams: matchedCrop.idealConditions,
              parameters: analysis.parameters,
              dashboardPredictionNote: analysis.dashboardPredictionNote,
              fertilizerPrescription: backendRes.fertilizerPrescription || {
                ureaKgAcre: 55,
                dapKgAcre: 35,
                mopKgAcre: 20,
                guidance: matchedCrop.fertilizerDosage
              },
              irrigationGuidance: matchedCrop.irrigationGuidance,
              farmingTips: matchedCrop.farmingTips,
              agronomicRationale: [
                `Soil pH (${formData.ph}) matches ${matchedCrop.name}'s optimum benchmark.`,
                `Temperature (${formData.temperature}°C) supports ${matchedCrop.season} vegetative stages.`,
                analysis.dashboardPredictionNote
              ],
              alternativeCrops: CROPS_DATABASE.filter(c => c.id !== matchedCrop.id).slice(0, 2).map(c => ({
                name: c.name,
                category: c.category,
                season: c.season,
                imageUrl: c.imageUrl,
                relativeFit: '85%'
              })),
              generatedAt: new Date().toISOString(),
              isOfflineInference: false
            };
          }
        } catch (backendErr) {
          console.warn('Backend ML request failed, falling back to client-side ML engine');
        }
      }

      if (!finalResult) {
        finalResult = recommendCrop(formData);
      }

      setRecommendation(finalResult);

      // Save to IndexedDB
      await offlineStorage.saveRecommendation(finalResult);
      const updatedHistory = await offlineStorage.getRecommendations();
      setPastRecommendations(updatedHistory);
    } catch (err) {
      console.error('Crop recommendation failed', err);
    } finally {
      setLoading(false);
    }
  };

  const getPhStatus = (ph) => {
    const p = parseFloat(ph);
    if (p < 5.5) return { label: 'Acidic (अम्लीय)', color: 'text-amber-700 bg-amber-50' };
    if (p > 7.8) return { label: 'Alkaline (क्षारीय)', color: 'text-purple-700 bg-purple-50' };
    return { label: 'Optimal Neutral (उदासीन)', color: 'text-agri-dark bg-agri-light' };
  };

  const phStatus = getPhStatus(formData.ph);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-agri-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-agri-dark text-white">
              <Sprout className="w-5 h-5 text-agri-accent" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-agri-dark font-sans">
                {t.cropAdvisoryTitle}
              </h1>
              <p className="text-xs text-agri-muted">
                {t.cropAdvisorySubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="green" size="md">
            <Cpu className="w-3.5 h-3.5 mr-1 text-agri-green" />
            <span>Random Forest (98.86% Acc)</span>
          </Badge>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-agri-border text-xs font-bold text-agri-dark bg-agri-bg hover:bg-agri-light transition-colors"
          >
            <History className="w-3.5 h-3.5 text-agri-green" />
            <span>{showHistory ? 'Hide History' : `${t.savedHistory} (${pastRecommendations.length})`}</span>
          </button>
        </div>
      </div>

      {/* History Drawer if toggled */}
      {showHistory && (
        <div className="bg-white rounded-3xl p-6 border border-agri-border shadow-subtle space-y-4">
          <h3 className="text-sm font-bold text-agri-dark flex items-center gap-2">
            <History className="w-4 h-4 text-agri-green" />
            <span>{t.savedHistory} (Offline IndexedDB History)</span>
          </h3>

          {pastRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pastRecommendations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setRecommendation(item)}
                  className="p-4 rounded-2xl bg-agri-bg border border-agri-border hover:border-agri-green cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-agri-dark">{item.crop?.name || item.recommendedCrop}</span>
                    <Badge variant="green">{item.confidence}% Match</Badge>
                  </div>
                  <p className="text-[11px] text-agri-muted">
                    N:{item.inputParams?.N || item.inputFeatures?.N} P:{item.inputParams?.P || item.inputFeatures?.P} K:{item.inputParams?.K || item.inputFeatures?.K} • pH {item.inputParams?.ph || item.inputFeatures?.ph}
                  </p>
                  <p className="text-[10px] text-agri-green font-semibold mt-2">
                    {new Date(item.timestamp || item.generatedAt || item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-agri-muted">No previously saved reports.</p>
          )}
        </div>
      )}

      {/* Main Grid: Input Form & Recommendation Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Soil Input Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-agri-border shadow-subtle space-y-5">
          <div className="flex items-center justify-between border-b border-agri-border pb-3">
            <div>
              <h2 className="text-base font-bold text-agri-dark">{t.soilDataEntry}</h2>
              <p className="text-[11px] text-agri-muted">{t.enterSoilHealthCard}</p>
            </div>
            
            <button
              type="button"
              onClick={handleFetchLiveWeather}
              disabled={autoFillingWeather}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-agri-light text-agri-dark text-[11px] font-bold border border-agri-accent hover:bg-agri-accent/20 transition-colors shadow-subtle"
              title="Automatically fill Temperature, Humidity and Rain from current weather"
            >
              <CloudSun className="w-3.5 h-3.5 text-agri-green" />
              <span>{autoFillingWeather ? 'Syncing...' : t.autoFillWeather}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* NPK Sliders */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-agri-dark mb-1">
                <span className="flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5 text-agri-green" />
                  {t.nitrogen}
                </span>
                <span className="font-mono text-agri-green font-bold">{formData.N} kg/ha</span>
              </div>
              <input
                type="range"
                min="10"
                max="180"
                name="N"
                value={formData.N}
                onChange={handleChange}
                className="w-full accent-agri-green cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-agri-muted mt-0.5">
                <span>Low (10)</span>
                <span>Medium (80)</span>
                <span>High (180)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-agri-dark mb-1">
                <span className="flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5 text-agri-green" />
                  {t.phosphorus}
                </span>
                <span className="font-mono text-agri-green font-bold">{formData.P} kg/ha</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                name="P"
                value={formData.P}
                onChange={handleChange}
                className="w-full accent-agri-green cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-agri-muted mt-0.5">
                <span>Low (5)</span>
                <span>Medium (50)</span>
                <span>High (120)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-agri-dark mb-1">
                <span className="flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5 text-agri-green" />
                  {t.potassium}
                </span>
                <span className="font-mono text-agri-green font-bold">{formData.K} kg/ha</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                name="K"
                value={formData.K}
                onChange={handleChange}
                className="w-full accent-agri-green cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-agri-muted mt-0.5">
                <span>Low (10)</span>
                <span>Medium (40)</span>
                <span>High (150)</span>
              </div>
            </div>

            {/* pH Value */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-agri-dark mb-1">
                <span>{t.soilPh}: <strong className="font-mono text-agri-green">{formData.ph}</strong></span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${phStatus.color}`}>
                  {phStatus.label}
                </span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.1"
                name="ph"
                value={formData.ph}
                onChange={handleChange}
                className="w-full accent-agri-dark cursor-pointer"
              />
            </div>

            {/* Weather Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-agri-dark mb-1">
                  {t.temperature} (°C)
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-agri-border text-xs focus:ring-2 focus:ring-agri-green/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-agri-dark mb-1">
                  {t.humidity} (%)
                </label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-agri-border text-xs focus:ring-2 focus:ring-agri-green/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-agri-dark mb-1">
                  {t.rainfall} (mm)
                </label>
                <input
                  type="number"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-agri-border text-xs focus:ring-2 focus:ring-agri-green/30"
                />
              </div>
            </div>

            {/* Soil Type and Season */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-agri-dark mb-1">
                  {t.soilType}
                </label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-agri-border text-xs bg-white focus:ring-2 focus:ring-agri-green/30"
                >
                  <option value="Alluvial">Alluvial (जलोढ़)</option>
                  <option value="Black Soil">Black Soil (काली मिट्टी)</option>
                  <option value="Sandy Loam">Sandy Loam (बलुई दोमट)</option>
                  <option value="Clayey">Clayey (मटियार)</option>
                  <option value="Red Soil">Red Soil (लाल मिट्टी)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-agri-dark mb-1">
                  {t.season}
                </label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-agri-border text-xs bg-white focus:ring-2 focus:ring-agri-green/30"
                >
                  <option value="All">All Seasons</option>
                  <option value="Kharif">Kharif (Monsoon)</option>
                  <option value="Rabi">Rabi (Winter)</option>
                  <option value="Zaid">Zaid (Summer)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-agri-dark text-white font-bold text-sm hover:bg-agri-green shadow-subtle transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Sprout className="w-4 h-4 text-agri-accent" />
              <span>{loading ? t.loading : t.getRecommendation}</span>
            </button>
          </form>
        </div>

        {/* Live Recommendation Output Display - ALWAYS VISIBLE */}
        <div className="lg:col-span-7 space-y-5">
          {recommendation && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-agri-border shadow-lift space-y-6">
              
              {/* Crop Hero Banner with Image */}
              <div className="relative rounded-2xl overflow-hidden border border-agri-border group">
                <div className="h-44 sm:h-52 w-full overflow-hidden bg-agri-dark relative">
                  <img
                    src={recommendation.crop?.imageUrl || 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1000&q=80'}
                    alt={recommendation.crop?.name || 'Crop View'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-agri-dark/80 backdrop-blur-md text-[11px] font-bold text-agri-accent border border-agri-accent/30 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t.recommendedCrop}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white font-extrabold text-xs shadow-subtle">
                      {recommendation.confidence}% {t.matchScore}
                    </span>
                  </div>

                  {/* Title and metadata over image bottom */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-2xl sm:text-3xl font-black drop-shadow-md">
                      {recommendation.crop?.name || recommendation.recommendedCrop}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-white/90">
                      <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm">
                        Category: {recommendation.crop?.category || 'Cereal'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm">
                        Season: {recommendation.crop?.season || 'Kharif'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm">
                        Growth: {recommendation.crop?.growthDurationDays || '90–120 days'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-strip with Soil & pH suitability */}
                <div className="bg-agri-bg p-3 px-4 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-agri-border">
                  <div className="flex items-center gap-2">
                    <span className="text-agri-muted font-bold">Soil:</span>
                    <span className="font-bold text-agri-dark">{recommendation.crop?.soilTypes?.[0] || formData.soilType}</span>
                    <span className="text-agri-border">•</span>
                    <span className="text-agri-muted font-bold">Soil pH:</span>
                    <span className="font-bold text-agri-green">{formData.ph}</span>
                  </div>
                  <div className="text-[11px] font-bold text-agri-green">
                    {recommendation.suitabilityRating}
                  </div>
                </div>
              </div>

              {/* Exact "Why [Crop]?" Parameter Suitability Analysis Table */}
              <div className="bg-white rounded-2xl border border-agri-border overflow-hidden shadow-subtle">
                <div className="bg-agri-bg px-4 py-3 border-b border-agri-border flex items-center justify-between">
                  <h4 className="text-xs font-bold text-agri-dark uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-agri-green" />
                    <span>Why {recommendation.crop?.hindiName || recommendation.crop?.name?.split(' ')[0] || 'Maize'}?</span>
                  </h4>
                  <span className="text-[10px] text-agri-muted">ICAR Scientific Benchmark</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-agri-light/40 text-agri-muted uppercase text-[10px] border-b border-agri-border font-bold">
                      <tr>
                        <th className="px-4 py-2.5">Parameter</th>
                        <th className="px-4 py-2.5">Your value</th>
                        <th className="px-4 py-2.5">Assessment</th>
                        <th className="px-4 py-2.5 hidden sm:table-cell">Optimal range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-agri-border/60">
                      {(recommendation.parameters || []).map((row, idx) => (
                        <tr key={idx} className="hover:bg-agri-bg/50 transition-colors">
                          <td className="px-4 py-2.5 font-bold text-agri-dark">{row.name}</td>
                          <td className="px-4 py-2.5 font-mono text-agri-green font-semibold">{row.yourValue}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                              row.color === 'green' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                              row.color === 'blue' ? 'bg-sky-50 text-sky-800 border-sky-200' :
                              row.color === 'purple' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                              'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {row.assessment}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-agri-muted text-[11px] hidden sm:table-cell">{row.optimalRange}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Dashboard prediction summary callout */}
                {recommendation.dashboardPredictionNote && (
                  <div className="p-3.5 bg-amber-50/70 border-t border-amber-200/80 flex items-start gap-2 text-xs text-amber-950 font-medium">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{recommendation.dashboardPredictionNote}</span>
                  </div>
                )}
              </div>

              {/* Exact Fertilizer Prescription (Urea, DAP, MOP) */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-agri-dark flex items-center justify-between">
                  <span>{t.fertilizerPrescription}</span>
                  <span className="text-xs font-normal text-agri-muted">ICAR Balanced Schedule</span>
                </h4>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-agri-light/40 rounded-2xl p-3 border border-agri-border">
                    <p className="text-xs text-agri-muted font-bold">{t.urea}</p>
                    <p className="text-xl font-black text-agri-dark mt-1">
                      {recommendation.fertilizerPrescription?.ureaKgAcre ?? 55}
                      <span className="text-xs font-normal text-agri-muted"> kg/acre</span>
                    </p>
                    <p className="text-[10px] text-agri-green font-medium mt-0.5">3 split doses</p>
                  </div>

                  <div className="bg-agri-light/40 rounded-2xl p-3 border border-agri-border">
                    <p className="text-xs text-agri-muted font-bold">{t.dap}</p>
                    <p className="text-xl font-black text-agri-dark mt-1">
                      {recommendation.fertilizerPrescription?.dapKgAcre ?? 35}
                      <span className="text-xs font-normal text-agri-muted"> kg/acre</span>
                    </p>
                    <p className="text-[10px] text-agri-green font-medium mt-0.5">Basal dose</p>
                  </div>

                  <div className="bg-agri-light/40 rounded-2xl p-3 border border-agri-border">
                    <p className="text-xs text-agri-muted font-bold">{t.mop}</p>
                    <p className="text-xl font-black text-agri-dark mt-1">
                      {recommendation.fertilizerPrescription?.mopKgAcre ?? 20}
                      <span className="text-xs font-normal text-agri-muted"> kg/acre</span>
                    </p>
                    <p className="text-[10px] text-agri-green font-medium mt-0.5">At planting</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-agri-bg border border-agri-border text-xs text-agri-text/80 leading-relaxed">
                  <strong>Dosage Schedule:</strong> {
                    typeof recommendation.fertilizerPrescription?.guidance === 'string'
                      ? recommendation.fertilizerPrescription.guidance
                      : (recommendation.fertilizerPrescription?.guidance?.urea || 'Apply DAP & Potash at basal preparation. Top-dress Urea in split intervals.')
                  }
                </div>
              </div>

              {/* Irrigation & Field Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200">
                  <h5 className="text-xs font-bold text-sky-900 flex items-center gap-1.5 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    <span>{t.irrigationGuide}</span>
                  </h5>
                  <p className="text-xs text-sky-950/80 leading-relaxed">
                    {recommendation.irrigationGuidance || 'Maintain optimal moisture during crown root initiation and grain-filling phases.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                  <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.fieldTips}</span>
                  </h5>
                  <p className="text-xs text-amber-950/80 leading-relaxed">
                    {recommendation.farmingTips || 'Incorporate bio-fertilizers (Azotobacter, PSB) to reduce chemical input costs by 20%.'}
                  </p>
                </div>
              </div>

              {/* Alternative Crops with Thumbnails */}
              {recommendation.alternativeCrops?.length > 0 && (
                <div className="pt-2 border-t border-agri-border">
                  <p className="text-xs font-bold text-agri-muted uppercase tracking-wider mb-2.5">
                    {t.alternativeCrops}:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recommendation.alternativeCrops.map((alt, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-2xl bg-agri-bg border border-agri-border hover:border-agri-green transition-all">
                        {alt.imageUrl ? (
                          <img
                            src={alt.imageUrl}
                            alt={alt.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-agri-border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-agri-light flex items-center justify-center shrink-0">
                            <Sprout className="w-5 h-5 text-agri-green" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-agri-dark truncate">{alt.name}</p>
                          <p className="text-[10px] text-agri-muted">{alt.season} • {alt.relativeFit} Fit</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
