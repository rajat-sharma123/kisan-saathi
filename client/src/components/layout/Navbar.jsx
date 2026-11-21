import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PhoneCall, Sprout, Menu, X, User, LogOut, Sparkles } from 'lucide-react';
import LanguageSelector from '../common/LanguageSelector';
import { useAuth } from '../../store/useAuthStore';
import { getTranslation } from '../../data/languageData';

export default function Navbar() {
  const { user, isLoggedIn, logout, resetToDemoFarmer, language } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const t = getTranslation(language);

  const isLandingPage = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-agri-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-agri-dark flex items-center justify-center text-agri-accent shadow-subtle group-hover:bg-agri-green transition-colors">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-agri-dark font-sans">
                  KISAN SAATHI
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-agri-light text-agri-dark border border-agri-border">
                  INNOVIX
                </span>
              </div>
              <p className="text-[11px] text-agri-muted leading-tight font-medium hidden sm:block">
                Smart Crop Advisory • IIIT Bhagalpur
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (For Landing Page or Global) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/dashboard' ? 'text-agri-dark border-b-2 border-agri-green pb-1' : 'text-agri-muted hover:text-agri-dark'
              }`}
            >
              {t.navDashboard}
            </Link>
            <Link 
              to="/crop-advisory" 
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/crop-advisory' ? 'text-agri-dark border-b-2 border-agri-green pb-1' : 'text-agri-muted hover:text-agri-dark'
              }`}
            >
              {t.navCrop}
            </Link>
            <Link 
              to="/disease-detection" 
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/disease-detection' ? 'text-agri-dark border-b-2 border-agri-green pb-1' : 'text-agri-muted hover:text-agri-dark'
              }`}
            >
              {t.navDisease}
            </Link>
            <Link 
              to="/weather-alerts" 
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/weather-alerts' ? 'text-agri-dark border-b-2 border-agri-green pb-1' : 'text-agri-muted hover:text-agri-dark'
              }`}
            >
              {t.navWeather}
            </Link>
            <Link 
              to="/market-prices" 
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/market-prices' ? 'text-agri-dark border-b-2 border-agri-green pb-1' : 'text-agri-muted hover:text-agri-dark'
              }`}
            >
              {t.navMarket}
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {/* Toll-Free Kisan Helpline Badge */}
            <a
              href="tel:18001801551"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-agri-light/70 text-agri-dark text-xs font-semibold hover:bg-agri-light border border-agri-border"
              title="Call Kisan Call Center (Government of India)"
            >
              <PhoneCall className="w-3.5 h-3.5 text-agri-green" />
              <span>1800-180-1551 (टोल-फ्री)</span>
            </a>

            {/* Language Switcher */}
            <LanguageSelector />

            {/* Farmer Profile / Auth */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-agri-bg border border-agri-border hover:bg-agri-light/50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-agri-dark text-white flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name.charAt(0) : 'K'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-agri-dark leading-tight">{user?.name || 'Kisan'}</p>
                    <p className="text-[10px] text-agri-muted leading-none">{user?.district || 'Bhagalpur'}</p>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={resetToDemoFarmer}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-agri-light text-agri-dark text-xs font-bold border border-agri-accent hover:bg-agri-accent/20"
                >
                  <Sparkles className="w-3.5 h-3.5 text-agri-green" />
                  Demo Login
                </button>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg bg-agri-dark text-white text-xs font-semibold hover:bg-agri-green transition-colors"
                >
                  {t.navLogin}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-agri-text hover:bg-agri-light focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-agri-border bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-agri-dark hover:bg-agri-light"
          >
            🌾 {t.navDashboard}
          </Link>
          <Link
            to="/voice-assistant"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-agri-dark hover:bg-agri-light"
          >
            🎙️ {t.navVoice}
          </Link>
          <Link
            to="/crop-advisory"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-agri-dark hover:bg-agri-light"
          >
            🌱 {t.navCrop}
          </Link>
          <Link
            to="/disease-detection"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-agri-dark hover:bg-agri-light"
          >
            🌿 {t.navDisease}
          </Link>
          <Link
            to="/weather-alerts"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-agri-dark hover:bg-agri-light"
          >
            ☀️ {t.navWeather}
          </Link>
          <Link
            to="/market-prices"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-agri-dark hover:bg-agri-light"
          >
            💰 {t.navMarket}
          </Link>
          <div className="pt-2 border-t border-agri-border flex items-center justify-between">
            <a
              href="tel:18001801551"
              className="text-xs font-semibold text-agri-green flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              1800-180-1551 (Kisan Helpline)
            </a>
            {isLoggedIn && (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="text-xs text-red-600 font-semibold"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
