import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Lock, MapPin, Sprout, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../store/useAuthStore';
import { SUPPORTED_LANGUAGES } from '../data/languageData';
import { MANDI_LOCATIONS } from '../data/mandiData';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    preferredLanguage: 'hi',
    state: 'Bihar',
    district: 'Bhagalpur',
    village: '',
    farmSize: '2.5',
    soilType: 'Alluvial Loam',
    primaryCrop: 'Rice / Wheat'
  });

  const [error, setError] = useState('');

  const currentDistricts = MANDI_LOCATIONS.find(loc => loc.state === formData.state)?.districts || ['Bhagalpur', 'Patna'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'state' ? { district: MANDI_LOCATIONS.find(loc => loc.state === value)?.districts[0] || '' } : {})
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError('कृपया नाम और मोबाइल नंबर दर्ज करें (Please enter name and phone)');
      return;
    }
    register(formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6">
        
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-agri-dark text-agri-accent flex items-center justify-center mx-auto mb-3 shadow-lift">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-agri-dark font-sans">
            किसान पंजीकरण / Farmer Registration
          </h2>
          <p className="text-xs text-agri-muted mt-1">
            Join Kisan Saathi to receive personalized hyper-local agronomic assistance.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agri-border shadow-lift space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Row 1: Name and Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-agri-text mb-1">
                  पूरा नाम / Full Name *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-agri-muted">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-green/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text mb-1">
                  मोबाइल नंबर / Phone *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-agri-muted">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10 digit mobile number"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-green/30"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Password and Preferred Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-agri-text mb-1">
                  पासवर्ड / Password *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-agri-muted">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-green/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text mb-1">
                  पसंदीदा भाषा / Preferred Language
                </label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-agri-green/30"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name} ({lang.englishName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: State & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-agri-text mb-1">
                  राज्य / State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-agri-green/30"
                >
                  {MANDI_LOCATIONS.map((loc) => (
                    <option key={loc.state} value={loc.state}>{loc.state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text mb-1">
                  जिला / District
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-agri-green/30"
                >
                  {currentDistricts.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Village and Farm Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-agri-text mb-1">
                  गांव या कस्बा / Village
                </label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="e.g. Kahalgaon"
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-green/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text mb-1">
                  खेत का आकार (एकड़) / Farm Size (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-green/30"
                />
              </div>
            </div>

            {/* Row 5: Soil Type & Primary Crop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-agri-text mb-1">
                  मिट्टी का प्रकार / Soil Type
                </label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-agri-green/30"
                >
                  <option value="Alluvial Loam">Alluvial Loam (जलोढ़ मिट्टी)</option>
                  <option value="Black Cotton Soil">Black Cotton Soil (काली मिट्टी)</option>
                  <option value="Red Sandy Soil">Red Sandy Soil (लाल मिट्टी)</option>
                  <option value="Clayey Loam">Clayey Loam (मटियार दोमट)</option>
                  <option value="Laterite Soil">Laterite Soil (लैटेराइट मिट्टी)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text mb-1">
                  मुख्य फसल / Primary Crop
                </label>
                <input
                  type="text"
                  name="primaryCrop"
                  value={formData.primaryCrop}
                  onChange={handleChange}
                  placeholder="e.g. Rice, Wheat, Maize"
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-green/30"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-agri-dark text-white font-bold text-sm hover:bg-agri-green shadow-subtle transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>पंजीकरण पूरा करें / Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-agri-border text-center text-xs text-agri-muted">
            पहले से पंजीकृत हैं?{' '}
            <Link to="/login" className="font-bold text-agri-green hover:underline">
              यहाँ लॉगिन करें (Login)
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
