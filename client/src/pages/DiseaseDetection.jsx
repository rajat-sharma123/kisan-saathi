import React, { useState, useEffect, useRef } from 'react';
import { 
  ScanSearch, 
  Upload, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Leaf, 
  RotateCcw, 
  WifiOff, 
  RefreshCw, 
  ExternalLink,
  PhoneCall,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../store/useAuthStore';
import { useSync } from '../store/useSyncStore';
import { analyzePlantDisease } from '../services/diseaseDetectionService';
import { offlineStorage } from '../services/offlineStorage';
import { getTranslation } from '../data/languageData';
import Badge from '../components/common/Badge';

export default function DiseaseDetection() {
  const { user, language } = useAuth();
  const { isOnline, pendingCount, refreshPendingCount, syncPendingQueue, isSyncing } = useSync();
  const t = getTranslation(language);

  const [selectedCrop, setSelectedCrop] = useState('Rice');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [queuedItems, setQueuedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('analyze'); // 'analyze' or 'history'

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const availableCrops = [
    'Rice', 'Wheat', 'Tomato', 'Potato', 'Cotton', 'Maize', 'Mustard'
  ];

  const loadData = async () => {
    try {
      const history = await offlineStorage.getDiagnoses();
      setHistoryList(history);
      const pending = await offlineStorage.getPendingUploads();
      setQueuedItems(pending);
    } catch (e) {
      console.warn('Failed to load diagnosis data', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileSelect = (file) => {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
    setDiagnosisResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile && !previewUrl) return;
    setAnalyzing(true);

    try {
      const result = await analyzePlantDisease(imageFile || previewUrl, selectedCrop, isOnline);
      setDiagnosisResult(result);
      await loadData();
      await refreshPendingCount();
    } catch (err) {
      console.error('Diagnosis failed', err);
      alert('Analysis error: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setDiagnosisResult(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 border border-agri-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-agri-dark text-white">
              <ScanSearch className="w-5 h-5 text-agri-accent" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-agri-dark font-sans">
                {t.diseaseTitle}
              </h1>
              <p className="text-xs text-agri-muted">
                {t.diseaseSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'analyze'
                ? 'bg-agri-dark text-white'
                : 'bg-agri-bg text-agri-text hover:bg-agri-light border border-agri-border'
            }`}
          >
            {t.newAnalysis || 'नई जांच'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'history'
                ? 'bg-agri-dark text-white'
                : 'bg-agri-bg text-agri-text hover:bg-agri-light border border-agri-border'
            }`}
          >
            {t.history || 'इतिहास'} ({historyList.length})
          </button>
        </div>
      </div>

      {/* Offline Pending Queue Alert if any */}
      {queuedItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-center gap-2.5">
            <WifiOff className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <p className="text-xs font-bold">
                {queuedItems.length} {t.offlineQueueNotice}
              </p>
            </div>
          </div>
          {isOnline && (
            <button
              onClick={async () => {
                await syncPendingQueue();
                await loadData();
              }}
              disabled={isSyncing}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-800 transition-colors shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? t.loading : t.syncNow}</span>
            </button>
          )}
        </div>
      )}

      {/* Tab 1: Analyze Leaf */}
      {activeTab === 'analyze' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Upload Panel */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-agri-border shadow-subtle space-y-5">
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                {t.selectCrop}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-agri-border text-xs sm:text-sm bg-agri-bg text-agri-dark font-medium focus:ring-2 focus:ring-agri-green/30"
              >
                {availableCrops.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Dropzone & Camera */}
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                {t.uploadLeafPhoto}
              </label>

              {previewUrl ? (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-agri-green max-h-64 flex items-center justify-center bg-black/5">
                    <img 
                      src={previewUrl} 
                      alt="Crop leaf preview" 
                      className="w-full h-56 object-cover" 
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-agri-dark/80 text-white text-[10px] font-bold">
                      {selectedCrop}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 py-2 px-3 rounded-xl border border-agri-border text-xs font-bold text-agri-muted hover:text-agri-dark hover:bg-agri-light transition-colors"
                    >
                      {t.changePhoto}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-agri-border rounded-2xl p-6 text-center hover:border-agri-green bg-agri-bg/50 transition-colors space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-agri-light text-agri-green flex items-center justify-center mx-auto">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-agri-dark">
                      {t.dragDropOrChoose}
                    </p>
                    <p className="text-[11px] text-agri-muted mt-0.5">
                      {t.imageFormatNote}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />
                    <input
                      type="file"
                      ref={cameraInputRef}
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-agri-dark text-white text-xs font-bold hover:bg-agri-green transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t.chooseGallery}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-agri-light text-agri-dark text-xs font-bold border border-agri-accent hover:bg-agri-accent/20 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-agri-green" />
                      <span>{t.cameraCapture}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Analyze CTA */}
            <button
              onClick={handleAnalyze}
              disabled={!previewUrl || analyzing}
              className="w-full py-3.5 rounded-2xl bg-agri-dark text-white font-bold text-sm hover:bg-agri-green shadow-subtle transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <ScanSearch className={`w-4 h-4 text-agri-accent ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? t.analyzing : t.analyzeLeaf}</span>
            </button>

            {!isOnline && (
              <p className="text-[10px] text-amber-800 text-center font-medium">
                ⚡ <strong>ऑफ़लाइन मोड:</strong> फोटो स्थानीय रूप से IndexedDB कतार में सुरक्षित रखी जाएगी और इंटरनेट आने पर स्वतः सिंक होगी।
              </p>
            )}
          </div>

          {/* Right Diagnosis Result Panel */}
          <div className="lg:col-span-7">
            {diagnosisResult ? (
              diagnosisResult.isQueuedOffline ? (
                /* Offline Queued State */
                <div className="bg-white rounded-3xl p-8 border border-amber-300 shadow-lift space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                    <Clock className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-amber-950">
                    फोटो ऑफ़लाइन कतार में सुरक्षित है!
                  </h3>
                  <p className="text-xs text-agri-muted max-w-md mx-auto leading-relaxed">
                    {diagnosisResult.statusMessage}
                  </p>
                  <div className="p-3 bg-agri-bg rounded-2xl border border-agri-border inline-block text-xs font-mono text-agri-muted">
                    Queue ID: {diagnosisResult.queueId} • Crop: {diagnosisResult.crop}
                  </div>
                </div>
              ) : diagnosisResult.is_plant === false ? (
                /* Non-Agricultural Image Detected Alert */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-lift space-y-5 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto ring-8 ring-amber-50">
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
                      <span>⚠️ गैर-कृषि फोटो / Non-Plant Image</span>
                    </div>
                    <h3 className="text-xl font-black text-agri-dark mt-2">
                      {diagnosisResult.detected_subject 
                        ? `पहचाना गया: ${diagnosisResult.detected_subject}` 
                        : 'पौधे की पत्ती नहीं पहचानी जा सकी'}
                    </h3>
                    <p className="text-xs text-agri-text/80 max-w-md mx-auto leading-relaxed pt-1">
                      {diagnosisResult.message || 'कृपया किसी फसल या पौधे की पत्ती का स्पष्ट फोटो अपलोड करें ताकि AI बीमारी की सटीक जांच कर सके।'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-agri-bg border border-agri-border text-left max-w-md mx-auto space-y-2 text-xs">
                    <p className="font-bold text-agri-dark flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-agri-green" />
                      <span>सटीक जांच के लिए सुझाव:</span>
                    </p>
                    <ul className="text-agri-muted space-y-1 list-disc pl-4 text-[11px]">
                      <li>रोगग्रस्त पौधे की पत्ती, तना या फल का सीधा और साफ फोटो खींचें।</li>
                      <li>पर्याप्त रोशनी में फोटो लें और कैमरे को पत्ती के नजदीक रखें।</li>
                      <li>मानव चेहरे, पालतू जानवर, वाहन या अन्य गैर-कृषि वस्तुओं की फोटो से बचें।</li>
                    </ul>
                  </div>

                  <button
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agri-dark text-white font-bold text-xs hover:bg-agri-green transition-colors shadow-subtle"
                  >
                    <RotateCcw className="w-4 h-4 text-agri-accent" />
                    <span>दूसरी पत्ती की फोटो चुनें (Change Photo)</span>
                  </button>
                </div>
              ) : diagnosisResult.is_healthy ? (
                /* Healthy Plant Detected */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-lift space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agri-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                            पौधे का स्वास्थ्य: उत्तम (Healthy)
                          </span>
                          <Badge variant="green">95% स्वस्थ</Badge>
                        </div>
                        <h3 className="text-2xl font-black text-agri-dark">
                          {diagnosisResult.possible_disease || 'स्वस्थ फसल (Healthy Plant)'}
                        </h3>
                        <p className="text-xs text-agri-muted">
                          फसल: {diagnosisResult.crop || selectedCrop} • कोई रोग या कीट प्रकोप नहीं
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                    <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>कृषि विशेषज्ञ देखरेख सुझाव:</span>
                    </p>
                    <ul className="space-y-1.5 list-disc pl-4 text-emerald-900/90 text-xs">
                      {(diagnosisResult.recommended_actions || [
                        'फसल पूर्णतः स्वस्थ है। नियमित सिंचाई और संतुलित पोषण जारी रखें।'
                      ]).map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={resetForm}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-agri-bg border border-agri-border text-xs font-bold text-agri-dark hover:bg-agri-light transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>नई फोटो जांचें</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Structured Diagnostic Report for Diseased Plant */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agri-border shadow-lift space-y-6">
                  
                  {/* Top Bar with Severity */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agri-border pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-agri-green uppercase tracking-wider">
                          {t.identifiedPathology}
                        </span>
                        <Badge variant={diagnosisResult.severity === 'Severe' || diagnosisResult.severity === 'High' ? 'red' : 'amber'}>
                          {t.severity}: {diagnosisResult.severity}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-black text-agri-dark font-sans">
                        {diagnosisResult.possible_disease}
                      </h3>
                      <p className="text-xs text-agri-muted italic mt-0.5">
                        {diagnosisResult.pathogen} • {t.matchScore || 'Match'}: {Math.round(diagnosisResult.confidence * 100)}%
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-agri-dark bg-agri-light px-2.5 py-1 rounded-xl border border-agri-accent/40">
                        <CheckCircle2 className="w-3.5 h-3.5 text-agri-green" />
                        <span>{diagnosisResult.crop}</span>
                      </span>
                    </div>
                  </div>

                  {/* Symptoms List */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-agri-dark uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-agri-green" />
                      <span>{t.symptoms}</span>
                    </h4>
                    <ul className="text-xs text-agri-text/80 space-y-1 list-disc pl-4">
                      {diagnosisResult.symptoms.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Causes */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-agri-dark uppercase tracking-wider">
                      {t.causes}
                    </h4>
                    <ul className="text-xs text-agri-muted space-y-1 list-disc pl-4">
                      {diagnosisResult.possible_causes.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Curative Recommended Actions */}
                  <div className="p-4 rounded-2xl bg-agri-light/60 border border-agri-accent/40 space-y-2">
                    <h4 className="text-xs font-bold text-agri-dark uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-agri-green" />
                      <span>{t.immediateAction}</span>
                    </h4>
                    <ul className="text-xs text-agri-dark space-y-1.5 font-medium list-disc pl-4">
                      {diagnosisResult.recommended_actions.map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Long-Term Prevention */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-agri-dark uppercase tracking-wider">
                      {t.prevention}
                    </h4>
                    <ul className="text-xs text-agri-muted space-y-1 list-disc pl-4">
                      {diagnosisResult.prevention.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  {/* KVK & Expert Escalation */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-amber-950 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-700" />
                        <span>{t.expertKvkAdvisory}</span>
                      </p>
                      <p className="text-[11px] text-amber-900/80">
                        {diagnosisResult.kvk_advisory}
                      </p>
                    </div>
                    <a
                      href="tel:18001801551"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-agri-dark text-white font-bold text-xs hover:bg-agri-green transition-colors shrink-0"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>1800-180-1551</span>
                    </a>
                  </div>

                </div>
              )
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-8 border border-dashed border-agri-border shadow-subtle text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-agri-light text-agri-green flex items-center justify-center mx-auto">
                  <ScanSearch className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-agri-dark">
                  {t.uploadLeafPhoto}
                </h3>
                <p className="text-xs text-agri-muted max-w-sm mx-auto leading-relaxed">
                  {t.diseaseSubtitle}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Past History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-agri-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-agri-border pb-3">
            <h3 className="text-base font-bold text-agri-dark">
              {t.savedHistory}
            </h3>
            <span className="text-xs text-agri-muted">
              {historyList.length}
            </span>
          </div>

          {historyList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-agri-bg border border-agri-border flex gap-4 items-start"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.crop}
                    className="w-20 h-20 rounded-xl object-cover border border-agri-border shrink-0"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-agri-dark truncate">
                        {item.possible_disease}
                      </h4>
                      <Badge variant={item.severity === 'Severe' || item.severity === 'High' ? 'red' : 'amber'}>
                        {item.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-agri-green font-semibold">
                      {item.crop} • {Math.round(item.confidence * 100)}%
                    </p>
                    <p className="text-[11px] text-agri-muted line-clamp-2">
                      {item.recommended_actions?.[0]}
                    </p>
                    <p className="text-[10px] text-agri-muted pt-1">
                      {new Date(item.analyzedAt || item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-agri-muted text-center py-8">
              {t.noHistoryFound}
            </p>
          )}
        </div>
      )}

    </div>
  );
}
