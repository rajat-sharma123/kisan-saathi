import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Sprout, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Building2, 
  ShieldCheck,
  Globe
} from 'lucide-react';
import { useAuth } from '../store/useAuthStore';
import { SUPPORTED_LANGUAGES, getTranslation } from '../data/languageData';
import { MANDI_LOCATIONS } from '../data/mandiData';
import { INNOVIX_INFO } from '../data/innovixTeam';
import Badge from '../components/common/Badge';

export default function Profile() {
  const { user, updateProfile, resetToDemoFarmer, changeLanguage, language } = useAuth();
  const t = getTranslation(language);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    preferredLanguage: user?.preferredLanguage || 'hi',
    state: user?.state || 'Bihar',
    district: user?.district || 'Bhagalpur',
    village: user?.village || 'Kahalgaon',
    farmSize: user?.farmSize || '3.5',
    soilType: user?.soilType || 'Alluvial Loam',
    primaryCrop: user?.primaryCrop || 'Rice & Wheat',
    irrigationType: user?.irrigationType || 'Borewell & Canal'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    changeLanguage(formData.preferredLanguage);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-agri-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-agri-dark text-white">
              <User className="w-5 h-5 text-agri-accent" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-agri-dark font-sans">
                {t.profileTitle}
              </h1>
              <p className="text-xs text-agri-muted">
                {t.personalInfo} & {t.farmHoldings}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={resetToDemoFarmer}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-agri-border text-xs font-bold text-agri-dark bg-agri-bg hover:bg-agri-light transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-agri-green" />
          <span>{t.resetDemo}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-agri-light border border-agri-accent/50 text-agri-dark text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-agri-green" />
          <span>{t.profileSaved || 'Profile updated successfully'}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agri-border shadow-lift space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-bold text-agri-dark uppercase tracking-wider mb-3 pb-2 border-b border-agri-border">
              {t.personalInfo}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-agri-dark mb-1">{t.fullName}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:ring-2 focus:ring-agri-green/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-dark mb-1">{t.phone}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:ring-2 focus:ring-agri-green/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-dark mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:ring-2 focus:ring-agri-green/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-dark mb-1">{t.preferredLanguage}</label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm bg-white focus:ring-2 focus:ring-agri-green/30"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name} ({lang.englishName})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Farm Details */}
          <div>
            <h3 className="text-sm font-bold text-agri-dark uppercase tracking-wider mb-3 pb-2 border-b border-agri-border">
              {t.farmHoldings}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-agri-dark mb-1">{t.state}</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:ring-2 focus:ring-agri-green/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-dark mb-1">{t.district}</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:ring-2 focus:ring-agri-green/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-dark mb-1">{t.village}</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:ring-2 focus:ring-agri-green/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-dark mb-1">{t.farmSize}</label>
                <input
                  type="number"
                  step="0.5"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:ring-2 focus:ring-agri-green/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-dark mb-1">{t.soilType}</label>
                <input
                  type="text"
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:ring-2 focus:ring-agri-green/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-dark mb-1">{t.irrigationType}</label>
                <input
                  type="text"
                  name="irrigationType"
                  value={formData.irrigationType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-agri-border text-xs sm:text-sm focus:ring-2 focus:ring-agri-green/30"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-agri-dark text-white font-bold text-xs sm:text-sm hover:bg-agri-green transition-colors shadow-subtle"
            >
              <Save className="w-4 h-4 text-agri-accent" />
              <span>{t.saveChanges}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Team INNOVIX Project Attribution Footer */}
      <div className="bg-agri-light/40 rounded-3xl p-6 border border-agri-border text-xs text-agri-muted space-y-2">
        <div className="flex items-center gap-2 text-agri-dark font-bold">
          <Building2 className="w-4 h-4 text-agri-green" />
          <span>KISAN SAATHI by Team {INNOVIX_INFO.teamName}</span>
        </div>
        <p>
          {INNOVIX_INFO.institution} ({INNOVIX_INFO.program}) • Mentor: {INNOVIX_INFO.guide.name}
        </p>
      </div>

    </div>
  );
}
