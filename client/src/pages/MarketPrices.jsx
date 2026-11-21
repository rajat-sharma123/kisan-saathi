import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  MapPin, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  BarChart3, 
  LineChart as LineChartIcon,
  ShieldCheck,
  RefreshCw,
  Building,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useAuth } from '../store/useAuthStore';
import { mandiService } from '../services/mandiService';
import { getTranslation } from '../data/languageData';
import Badge from '../components/common/Badge';

export default function MarketPrices() {
  const { user, language } = useAuth();
  const t = getTranslation(language);

  // Locations and commodities master data
  const locations = mandiService.getLocations();
  const commodities = mandiService.getCommodities();

  const [selectedState, setSelectedState] = useState(user?.state || 'Bihar');
  const [selectedDistrict, setSelectedDistrict] = useState(user?.district || 'Bhagalpur');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Graph controls
  const [selectedTrendCrop, setSelectedTrendCrop] = useState('wheat');
  const [timeRange, setTimeRange] = useState('30D');

  // Compute all available districts for selected state
  const districtsForState = useMemo(() => {
    const found = locations.find(l => l.state.toLowerCase() === selectedState.toLowerCase());
    return found ? found.districts : ['All'];
  }, [selectedState, locations]);

  // When state changes, ensure selectedDistrict exists in new state
  const handleStateChange = (newState) => {
    setSelectedState(newState);
    const found = locations.find(l => l.state.toLowerCase() === newState.toLowerCase());
    if (found && found.districts.length > 0) {
      setSelectedDistrict(found.districts[0]);
    } else {
      setSelectedDistrict('All');
    }
  };

  // Sync graph crop when user picks a specific crop in the main filter
  const handleCropChange = (newCrop) => {
    setSelectedCrop(newCrop);
    if (newCrop !== 'All') {
      setSelectedTrendCrop(newCrop);
    }
  };

  // Filtered prices list (covering all 780+ districts of India)
  const filteredPrices = useMemo(() => {
    return mandiService.filterPrices({
      state: selectedState,
      district: selectedDistrict,
      crop: selectedCrop,
      searchQuery
    });
  }, [selectedState, selectedDistrict, selectedCrop, searchQuery]);

  // Dynamic historical trend data for Recharts reacting to (crop, state, district, timeRange)
  const trendData = useMemo(() => {
    return mandiService.getHistoricalTrend(selectedTrendCrop, selectedState, selectedDistrict, timeRange);
  }, [selectedTrendCrop, selectedState, selectedDistrict, timeRange]);

  // Dynamic inter-mandi comparison data for Recharts reacting to (state, district, crop)
  const comparisonData = useMemo(() => {
    return mandiService.getMandiComparison(selectedState, selectedDistrict, selectedTrendCrop);
  }, [selectedState, selectedDistrict, selectedTrendCrop]);

  // Inter-market arbitrage recommendation for selected crop and region
  const arbitrageOpportunity = useMemo(() => {
    return mandiService.getBestMandiOpportunity(selectedTrendCrop, selectedState, selectedDistrict);
  }, [selectedTrendCrop, selectedState, selectedDistrict]);

  // Find human-readable label for trend crop
  const currentTrendCropObj = useMemo(() => {
    return commodities.find(c => c.key === selectedTrendCrop) || commodities[0];
  }, [selectedTrendCrop, commodities]);

  const handleExportCSV = () => {
    const headers = ['Crop', 'Variety', 'Mandi', 'District', 'State', 'Min Price (₹/Q)', 'Max Price (₹/Q)', 'Modal Price (₹/Q)', 'Arrival Qty (Q)', 'Date', 'Source'];
    const rows = filteredPrices.map(p => [
      `"${p.crop}"`,
      `"${p.variety || 'Standard'}"`,
      `"${p.mandi}"`,
      `"${p.district}"`,
      `"${p.state}"`,
      p.minPrice,
      p.maxPrice,
      p.modalPrice,
      p.arrivalQtyQuintals,
      p.arrivalDate,
      `"${p.source}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kisan_saathi_${selectedState}_${selectedDistrict}_mandi_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 border border-agri-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-agri-dark text-white">
              <TrendingUp className="w-5 h-5 text-agri-accent" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-agri-dark font-sans">
                  {t.marketPricesTitle || 'मंडी भाव और बाजार विश्लेषण'}
                </h1>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-agri-light text-agri-dark border border-agri-green/30">
                  {locations.length} राज्य • 780+ जिले
                </span>
              </div>
              <p className="text-xs text-agri-muted">
                {t.marketPricesSubtitle || 'भारत के सभी राज्यों और जिलों के दैनिक एगमार्कनेट (AGMARKNET) थोक भाव'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="green" size="md">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-agri-green" />
            <span>AGMARKNET • GoI</span>
          </Badge>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-agri-border text-xs font-bold text-agri-dark bg-agri-bg hover:bg-agri-light transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-agri-green" />
            <span>{t.exportCsv || 'CSV डाउनलोड'}</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon: State, District, Commodity, Search */}
      <div className="bg-white rounded-3xl p-5 border border-agri-border shadow-subtle space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* State Filter (All 36 States & UTs of India) */}
          <div>
            <label className="block text-[11px] font-bold text-agri-dark mb-1">
              {t.state || 'राज्य'} ({locations.length})
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs font-semibold bg-agri-bg text-agri-dark focus:ring-2 focus:ring-agri-green/30"
            >
              {locations.map((loc) => (
                <option key={loc.state} value={loc.state}>{loc.state}</option>
              ))}
            </select>
          </div>

          {/* District Filter (All official districts for the chosen state) */}
          <div>
            <label className="block text-[11px] font-bold text-agri-dark mb-1">
              {t.district || 'जिला'} ({districtsForState.length} जिले)
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs font-semibold bg-agri-bg text-agri-dark focus:ring-2 focus:ring-agri-green/30"
            >
              <option value="All">सभी जिले (All Districts)</option>
              {districtsForState.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Commodity / Crop Filter */}
          <div>
            <label className="block text-[11px] font-bold text-agri-dark mb-1">
              {t.commodity || 'फसल / जिस'}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => handleCropChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs font-semibold bg-agri-bg text-agri-dark focus:ring-2 focus:ring-agri-green/30"
            >
              <option value="All">{t.allCrops || 'सभी फसलें (All Crops)'}</option>
              {commodities.map((c) => (
                <option key={c.key} value={c.key}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Search Text */}
          <div>
            <label className="block text-[11px] font-bold text-agri-dark mb-1">
              {t.search || 'खोजें'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="मंडी, जिला, किस्म या फसल खोजें..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-agri-border text-xs focus:ring-2 focus:ring-agri-green/30"
              />
              <Search className="w-3.5 h-3.5 text-agri-muted absolute left-2.5 top-2.5" />
            </div>
          </div>

        </div>

        {/* Current Selection Summary Bar */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-agri-border/60 text-xs text-agri-muted gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-agri-dark">सक्रिय चयन:</span>
            <span className="px-2 py-0.5 rounded-lg bg-agri-light text-agri-dark font-medium border border-agri-border">
              📍 {selectedState} • {selectedDistrict}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-agri-light text-agri-dark font-medium border border-agri-border">
              🌾 {selectedCrop === 'All' ? 'सभी फसलें' : currentTrendCropObj.name}
            </span>
          </div>
          <span className="text-[11px]">
            दिखाए जा रहे हैं: <strong className="text-agri-dark">{filteredPrices.length}</strong> रिकॉर्ड
          </span>
        </div>
      </div>

      {/* Inter-Mandi Price Arbitrage Opportunity Banner */}
      {arbitrageOpportunity && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-agri-light via-agri-light/60 to-white border border-agri-accent/50 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-agri-green text-white text-[10px] font-bold uppercase tracking-wider">
                {t.arbitrageInsight || 'मंडी मुनाफा विश्लेषण'}
              </span>
              <span className="text-xs font-bold text-agri-dark capitalize">
                {currentTrendCropObj.name} • {selectedDistrict}, {selectedState}
              </span>
            </div>
            <p className="text-xs text-agri-text/90 leading-relaxed font-medium">
              {arbitrageOpportunity.opportunityNote}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-agri-muted">{t.modalPrice || 'उच्चतम भाव'}</p>
              <p className="text-base font-black text-agri-dark">
                ₹{arbitrageOpportunity.highestMandi?.modalPrice?.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-agri-muted">/Q</span>
              </p>
              <span className="text-[10px] font-semibold text-agri-green block">
                +₹{arbitrageOpportunity.priceDifference}/Q अंतर
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-agri-dark text-white">
              <ArrowUpRight className="w-5 h-5 text-agri-accent" />
            </div>
          </div>
        </div>
      )}

      {/* Main Prices Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-agri-dark flex items-center gap-2">
            <span>दैनिक मंडी भाव सूची</span>
            <span className="text-xs font-normal text-agri-muted">
              ({selectedDistrict === 'All' ? selectedState : `${selectedDistrict}, ${selectedState}`})
            </span>
          </h2>
          <span className="text-xs text-agri-muted">
            नवीनतम अपडेट: 18 Nov 2026
          </span>
        </div>

        {filteredPrices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-agri-border shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-agri-dark">{item.crop}</h3>
                      <p className="text-[11px] text-agri-muted">किस्म: {item.variety}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-agri-bg border border-agri-border text-agri-dark">
                      {item.district}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-agri-green font-semibold mb-3">
                    <Building className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate" title={item.mandi}>{item.mandi}</span>
                  </div>

                  {/* Price Matrix */}
                  <div className="grid grid-cols-3 gap-2 bg-agri-bg p-3 rounded-xl border border-agri-border/70 text-center mb-3">
                    <div>
                      <span className="text-[10px] text-agri-muted block">{t.minPrice || 'न्यूनतम'}</span>
                      <span className="text-xs font-bold text-agri-dark">₹{item.minPrice}</span>
                    </div>
                    <div className="border-x border-agri-border">
                      <span className="text-[10px] text-agri-green font-bold block">{t.modalPrice || 'मॉडल भाव'}</span>
                      <span className="text-sm font-black text-agri-dark">₹{item.modalPrice}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-agri-muted block">{t.maxPrice || 'अधिकतम'}</span>
                      <span className="text-xs font-bold text-agri-dark">₹{item.maxPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-agri-border/60 flex items-center justify-between text-[11px]">
                  <span className="text-agri-muted">
                    {t.arrivals || 'आवक'}: <strong>{item.arrivalQtyQuintals} Q</strong>
                  </span>
                  <span className={`font-semibold ${item.priceChange.startsWith('+') ? 'text-agri-green' : item.priceChange.startsWith('-') ? 'text-rose-600' : 'text-agri-muted'}`}>
                    {item.priceChange}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-agri-border text-xs text-agri-muted">
            {t.noHistoryFound || 'चयनित फिल्टर के लिए कोई मंडी भाव नहीं मिला।'}
          </div>
        )}
      </div>

      {/* DYNAMIC GRAPHS SECTION: Historical Trend & APMC Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Dynamic Historical Trend Line Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-agri-border shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agri-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <LineChartIcon className="w-4 h-4 text-agri-green" />
                <h3 className="text-sm sm:text-base font-bold text-agri-dark">
                  मूल्य प्रवृत्ति / Historical Price Trend
                </h3>
              </div>
              <p className="text-[11px] text-agri-muted mt-0.5">
                {currentTrendCropObj.name} • {selectedDistrict}, {selectedState} (₹/क्विंटल)
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Time Range Selector */}
              <div className="inline-flex rounded-xl bg-agri-bg border border-agri-border p-0.5">
                {['7D', '15D', '30D'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      timeRange === range
                        ? 'bg-agri-green text-white shadow-xs'
                        : 'text-agri-muted hover:text-agri-dark'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              {/* Crop Selector for Graph */}
              <select
                value={selectedTrendCrop}
                onChange={(e) => setSelectedTrendCrop(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-agri-border text-xs font-bold bg-agri-bg text-agri-dark focus:ring-2 focus:ring-agri-green/30"
              >
                {commodities.map((c) => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Line Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E9DE" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#687568' }} />
                <YAxis unit="₹" domain={['dataMin - 30', 'dataMax + 30']} tick={{ fontSize: 11, fill: '#687568' }} />
                <Tooltip 
                  formatter={(val, name) => [
                    `₹${val}/Q`, 
                    name === 'price' ? `${currentTrendCropObj.name} मॉडल भाव` : name
                  ]}
                  labelFormatter={(lbl) => `दिनांक: ${lbl}`}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E3E9DE', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  name="price"
                  stroke="#315D2A" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#82BD4B' }}
                  activeDot={{ r: 6, fill: '#315D2A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-agri-muted pt-2 border-t border-agri-border/60">
            <span>आवृत्ति: दैनिक एगमार्कनेट आंकड़े</span>
            <span className="font-semibold text-agri-green">
              वर्तमान भाव: ₹{trendData[trendData.length - 1]?.price}/Q
            </span>
          </div>
        </div>

        {/* Dynamic Multi-Mandi Comparison Bar Chart */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-agri-border shadow-subtle space-y-4">
          <div className="border-b border-agri-border pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-agri-dark flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-agri-green" />
                <span>मंडी भाव तुलना (APMC Comparison)</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-agri-bg border border-agri-border text-agri-dark">
                {selectedDistrict}
              </span>
            </div>
            <p className="text-[11px] text-agri-muted mt-0.5">
              {selectedDistrict}, {selectedState} के प्रमुख कृषि यार्ड्स में {currentTrendCropObj.name} के भाव
            </p>
          </div>

          {/* Bar Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E9DE" />
                <XAxis dataKey="mandi" tick={{ fontSize: 10, fill: '#687568' }} />
                <YAxis unit="₹" domain={['dataMin - 50', 'dataMax + 50']} tick={{ fontSize: 10, fill: '#687568' }} />
                <Tooltip 
                  formatter={(val, name, item) => [
                    `₹${val}/Q`, 
                    name === 'price' ? `${item.payload.cropName} (मॉडल भाव)` : `${item.payload.secondaryName} (तुलनात्मक भाव)`
                  ]}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E3E9DE', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar 
                  dataKey="price" 
                  name={`${currentTrendCropObj.name}`} 
                  fill="#315D2A" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  dataKey="secondaryPrice" 
                  name="मानक तुलनात्मक जिस" 
                  fill="#D97706" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-agri-muted pt-2 border-t border-agri-border/60">
            <span>क्षेत्रीय फैलाव: 3 - 52 किमी दायरा</span>
            <span className="font-semibold text-agri-dark">
              स्रोत: DMI, AGMARKNET
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
