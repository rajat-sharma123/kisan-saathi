import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Mic, 
  ScanSearch, 
  CloudSun, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  PhoneCall, 
  ShieldCheck, 
  Users, 
  Sparkles,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../store/useAuthStore';
import { getTranslation } from '../data/languageData';
import { INNOVIX_INFO } from '../data/innovixTeam';

export default function Landing() {
  const { language } = useAuth();
  const t = getTranslation(language);

  const modules = [
    {
      id: 'voice',
      title: t.navVoice,
      desc: t.voiceSubtitle,
      icon: Mic,
      tag: 'Voice AI',
      link: '/voice-assistant',
      cta: t.openModule || 'Open'
    },
    {
      id: 'crop',
      title: t.navCrop,
      desc: t.cropAdvisorySubtitle,
      icon: Sprout,
      tag: 'Offline ML',
      link: '/crop-advisory',
      cta: t.openModule || 'Open'
    },
    {
      id: 'disease',
      title: t.navDisease,
      desc: t.diseaseSubtitle,
      icon: ScanSearch,
      tag: 'Photo AI',
      link: '/disease-detection',
      cta: t.openModule || 'Open'
    },
    {
      id: 'weather',
      title: t.navWeather,
      desc: t.weatherAlertsSubtitle,
      icon: CloudSun,
      tag: 'Live Radar',
      link: '/weather-alerts',
      cta: t.openModule || 'Open'
    },
    {
      id: 'mandi',
      title: t.navMarket,
      desc: t.marketPricesSubtitle,
      icon: TrendingUp,
      tag: 'Mandi Rates',
      link: '/market-prices',
      cta: t.openModule || 'Open'
    }
  ];

  const comparisonRows = [
    { feature: '1. Offline Functionality', gov: 'Basic', comm: 'Online only', ks: 'Full AI Advice (Offline)' },
    { feature: '2. Language & Voice', gov: 'Text only', comm: 'Text only', ks: 'Voice-First (Local Dialects)' },
    { feature: '3. Personalized Advice', gov: 'Generic', comm: 'Limited', ks: 'Hyper-Personalized (Soil & NPK)' },
    { feature: '4. Pest/Disease AI', gov: 'Basic list', comm: 'Photo AI only', ks: 'Advanced Photo AI + Offline Queue' },
    { feature: '5. Predictive Alerts', gov: 'Basic stats', comm: 'Limited', ks: 'Actionable (e.g., Delay spraying)' },
    { feature: '6. Market Prices', gov: 'Delayed', comm: 'Variable', ks: 'Hyper-Local & Trend Charts' },
    { feature: '7. Trust & Bias', gov: 'High', comm: 'Biased to inputs', ks: 'High (Neutral, Science-backed)' },
    { feature: '8. Ease of Use', gov: 'Clunky', comm: 'Text-heavy', ks: 'Intuitive Voice & Large Targets' }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-agri-border pt-12 pb-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-agri-light border border-agri-accent/40 text-agri-dark text-xs font-bold shadow-subtle">
                <span className="w-2 h-2 rounded-full bg-agri-green animate-pulse"></span>
                <span>Team INNOVIX • Society Academia Internship-1 (IIIT Bhagalpur)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-agri-text tracking-tight font-sans leading-tight">
                {t.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-agri-muted max-w-2xl leading-relaxed">
                {t.heroDesc || "Your intelligent farming companion for crop recommendations, disease detection, weather alerts, and better market prices."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-agri-dark text-white font-bold text-sm sm:text-base hover:bg-agri-green shadow-lift transition-all"
                >
                  <Sprout className="w-5 h-5 text-agri-accent" />
                  <span>{t.exploreFarm || "Explore Your Farm"}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/voice-assistant"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-agri-light text-agri-dark border border-agri-border font-bold text-sm sm:text-base hover:bg-agri-light/80 transition-all shadow-subtle"
                >
                  <Mic className="w-5 h-5 text-agri-green" />
                  <span>{t.talkToKisan || "Talk to Kisan Saathi"}</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-agri-border/60 grid grid-cols-3 gap-4 text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-agri-dark">100%</p>
                  <p className="text-xs text-agri-muted">Offline ML Engine</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-agri-dark">8+</p>
                  <p className="text-xs text-agri-muted">Indian Languages</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-agri-dark">20-30%</p>
                  <p className="text-xs text-agri-muted">Expected Yield Boost</p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Highlight Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-gradient-to-b from-agri-light to-white p-6 sm:p-8 border border-agri-border shadow-lift">
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-agri-border px-2.5 py-1 rounded-full text-xs font-semibold text-agri-dark flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-agri-green" />
                  Live Agri-Intelligence
                </div>

                <div className="space-y-4 pt-2">
                  <div className="bg-white rounded-2xl p-4 border border-agri-border shadow-subtle flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-agri-light flex items-center justify-center text-agri-dark shrink-0">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-agri-green uppercase tracking-wider">Recommended Crop</p>
                      <h4 className="text-base font-bold text-agri-dark">Wheat (गेहूं - HD 3086)</h4>
                      <p className="text-xs text-agri-muted mt-0.5">Matched for Alluvial soil • High NPK suitability (94%)</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-agri-border shadow-subtle flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                      <CloudSun className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Actionable Weather</p>
                      <h4 className="text-sm font-bold text-agri-dark">Delay Pesticide Spraying</h4>
                      <p className="text-xs text-agri-muted mt-0.5">Rain expected in next 24h (65% probability)</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-agri-border shadow-subtle flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-agri-light flex items-center justify-center text-agri-dark shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-agri-dark uppercase tracking-wider">Nearby Mandi Intelligence</p>
                      <div className="flex items-center justify-between gap-4 mt-0.5">
                        <span className="text-sm font-bold text-agri-dark">Bhagalpur APMC</span>
                        <span className="text-sm font-extrabold text-agri-green">₹2,360 / quintal</span>
                      </div>
                      <p className="text-[11px] text-agri-muted">Modal rate updated today • +1.5% weekly gain</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-agri-green hover:text-agri-dark"
                  >
                    <span>Launch interactive farmer dashboard</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5 Core Modules Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-agri-green uppercase tracking-widest bg-agri-light px-3 py-1 rounded-full border border-agri-accent/30">
            {t.tagline}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-dark mt-3">
            {t.fiveCoreModules}
          </h2>
          <p className="text-sm sm:text-base text-agri-muted mt-2">
            {t.allSystemsActive}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div 
                key={mod.id}
                className="bg-white rounded-2xl p-6 border border-agri-border shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-agri-light flex items-center justify-center text-agri-dark">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-agri-bg border border-agri-border text-agri-muted">
                      {mod.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-agri-dark mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-agri-muted leading-relaxed mb-6">
                    {mod.desc}
                  </p>
                </div>

                <Link
                  to={mod.link}
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-agri-bg hover:bg-agri-light text-agri-dark font-bold text-xs border border-agri-border transition-colors group"
                >
                  <span>{mod.cta}</span>
                  <ArrowRight className="w-4 h-4 text-agri-green group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}

          {/* Quick Help Card */}
          <div className="bg-gradient-to-br from-agri-dark to-agri-green rounded-2xl p-6 text-white shadow-lift flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/20 text-white uppercase tracking-wider">
                Government Helpline
              </span>
              <h3 className="text-lg font-bold mt-3 mb-2">
                Need Immediate Agronomic Support?
              </h3>
              <p className="text-xs text-white/80 leading-relaxed mb-4">
                Connect with agricultural extension officers and Krishi Vigyan Kendra scientists in your mother tongue.
              </p>
            </div>
            <a
              href="tel:18001801551"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-agri-dark font-extrabold text-sm hover:bg-agri-light transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-agri-green" />
              <span>Call 1800-180-1551 (Free)</span>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white border-y border-agri-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-agri-green uppercase tracking-widest">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-dark mt-2">
              How Kisan Saathi Works for Every Farmer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-agri-bg border border-agri-border">
              <div className="w-12 h-12 rounded-full bg-agri-dark text-white font-black text-lg flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-agri-dark mb-2">Input Soil or Speak Query</h4>
              <p className="text-xs text-agri-muted leading-relaxed">
                Enter your NPK values from a Soil Health Card or tap the microphone to ask in Bhojpuri, Maithili, or Hindi.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-agri-bg border border-agri-border">
              <div className="w-12 h-12 rounded-full bg-agri-green text-white font-black text-lg flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-agri-dark mb-2">Edge ML & Weather Evaluation</h4>
              <p className="text-xs text-agri-muted leading-relaxed">
                Our offline model matches crops and fertilizer doses, while our rule engine checks live rain and wind thresholds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-agri-bg border border-agri-border">
              <div className="w-12 h-12 rounded-full bg-agri-accent text-agri-dark font-black text-lg flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-agri-dark mb-2">Act & Maximize Revenue</h4>
              <p className="text-xs text-agri-muted leading-relaxed">
                Receive actionable spraying advice, disease remedies, and compare nearby mandis to sell at the best price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparative Advantage Table (From PPT Slide 7) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-agri-green uppercase tracking-widest bg-agri-light px-3 py-1 rounded-full border border-agri-accent/30">
            Market Benchmarking
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-dark mt-2">
            Why Kisan Saathi Outperforms Existing Solutions
          </h2>
          <p className="text-xs sm:text-sm text-agri-muted mt-1">
            Direct comparison based on Team INNOVIX research (IIIT Bhagalpur SAI-1).
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-agri-border bg-white shadow-subtle">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-agri-light/60 text-agri-dark border-b border-agri-border font-bold">
              <tr>
                <th className="py-3 px-4">Core Feature</th>
                <th className="py-3 px-4 text-gray-600">Government Apps</th>
                <th className="py-3 px-4 text-gray-600">Commercial Apps</th>
                <th className="py-3 px-4 bg-agri-green text-white font-extrabold">🏆 Kisan Saathi (INNOVIX)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-agri-border">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-agri-bg/40'}>
                  <td className="py-3 px-4 font-semibold text-agri-dark">{row.feature}</td>
                  <td className="py-3 px-4 text-gray-500">{row.gov}</td>
                  <td className="py-3 px-4 text-gray-500">{row.comm}</td>
                  <td className="py-3 px-4 font-bold text-agri-dark bg-agri-light/30">
                    <span className="inline-flex items-center gap-1.5 text-agri-dark font-bold">
                      <CheckCircle2 className="w-4 h-4 text-agri-green shrink-0" />
                      {row.ks}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Team INNOVIX Presentation Attribution */}
      <section className="bg-agri-light/40 border-t border-agri-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agri-border shadow-subtle">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-agri-border pb-6 mb-6">
              <div>
                <span className="text-[11px] font-bold text-agri-green uppercase tracking-wider">
                  Academic Project & Research
                </span>
                <h3 className="text-xl font-black text-agri-dark">
                  Developed by Team {INNOVIX_INFO.teamName}
                </h3>
                <p className="text-xs text-agri-muted">
                  {INNOVIX_INFO.institution} • {INNOVIX_INFO.program}
                </p>
              </div>
              <div className="text-left md:text-right bg-agri-bg px-4 py-2 rounded-xl border border-agri-border">
                <p className="text-xs text-agri-muted">Project Guide & Mentor</p>
                <p className="text-sm font-bold text-agri-dark">{INNOVIX_INFO.guide.name}</p>
                <p className="text-[11px] text-agri-muted">{INNOVIX_INFO.guide.department}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-agri-muted uppercase tracking-wider mb-3">
                Team Members:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {INNOVIX_INFO.members.map((member) => (
                  <div key={member.roll} className="bg-agri-bg rounded-xl p-3 border border-agri-border/70 text-center">
                    <p className="text-xs font-bold text-agri-dark leading-tight">{member.name}</p>
                    <p className="text-[10px] text-agri-green font-mono mt-0.5">{member.roll}</p>
                    <p className="text-[10px] text-agri-muted mt-1">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-agri-muted space-y-2">
        <p className="font-semibold text-agri-dark">
          KISAN SAATHI — Smart Crop Advisory System for Small and Marginal Farmers
        </p>
        <p>
          Designed for Indian Agriculture • Data aligned with ICAR, Open-Meteo & data.gov.in AGMARKNET
        </p>
        <p className="text-[11px] text-agri-muted/80">
          © 2025-2026 Team INNOVIX, IIIT Bhagalpur. All Rights Reserved.
        </p>
      </footer>

    </div>
  );
}
