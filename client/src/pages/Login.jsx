import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock, Sprout, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../store/useAuthStore';

export default function Login() {
  const { login, resetToDemoFarmer } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('kisan123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें (Please enter a valid 10-digit mobile number)');
      return;
    }
    login({ phone });
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    resetToDemoFarmer();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* Card Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-agri-dark text-agri-accent flex items-center justify-center mx-auto mb-3 shadow-lift">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-agri-dark font-sans">
            किसान लॉगिन / Farmer Login
          </h2>
          <p className="text-xs text-agri-muted mt-1">
            Access your personalized crop advisory, weather alerts, and local mandi rates.
          </p>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="bg-agri-light/60 border border-agri-accent/40 rounded-2xl p-4 flex items-center justify-between shadow-subtle">
          <div className="space-y-0.5">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-agri-dark">
              <Sparkles className="w-3.5 h-3.5 text-agri-green" />
              Quick Testing Mode
            </span>
            <p className="text-[11px] text-agri-muted">
              Pre-filled verified profile (Ramesh Kumar, Bhagalpur)
            </p>
          </div>
          <button
            onClick={handleDemoLogin}
            type="button"
            className="px-3.5 py-2 bg-agri-dark text-white rounded-xl text-xs font-bold hover:bg-agri-green transition-colors shadow-subtle"
          >
            1-Click Login
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agri-border shadow-lift space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                मोबाइल नंबर / Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-agri-muted">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10 digit mobile number"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-agri-border text-sm focus:outline-none focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                पासवर्ड / Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-agri-muted">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-agri-border text-sm focus:outline-none focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-agri-muted">
                <input type="checkbox" defaultChecked className="rounded text-agri-green focus:ring-agri-green" />
                <span>याद रखें (Remember me)</span>
              </label>
              <a href="#" className="font-semibold text-agri-green hover:underline">
                पासवर्ड भूल गए?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-agri-dark text-white font-bold text-sm hover:bg-agri-green shadow-subtle transition-all flex items-center justify-center gap-2"
            >
              <span>लॉग इन करें / Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-agri-border text-center text-xs text-agri-muted">
            नया खाता बनाना चाहते हैं?{' '}
            <Link to="/register" className="font-bold text-agri-green hover:underline">
              यहाँ नया पंजीकरण करें (Register)
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
