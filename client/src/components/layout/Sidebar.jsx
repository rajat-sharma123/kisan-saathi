import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Mic, 
  Sprout, 
  ScanSearch, 
  CloudSun, 
  TrendingUp, 
  UserCheck,
  ShieldCheck,
  Building2,
  Phone
} from 'lucide-react';
import { useAuth } from '../../store/useAuthStore';
import { getTranslation } from '../../data/languageData';
import { INNOVIX_INFO } from '../../data/innovixTeam';

export default function Sidebar() {
  const { user, language } = useAuth();
  const t = getTranslation(language);

  const navItems = [
    { to: '/dashboard', label: t.navDashboard, icon: LayoutDashboard, badge: t.home || 'Home' },
    { to: '/voice-assistant', label: t.navVoice, icon: Mic, badge: t.voiceAi || 'Voice AI' },
    { to: '/crop-advisory', label: t.navCrop, icon: Sprout, badge: t.offlineMl || 'Offline ML' },
    { to: '/disease-detection', label: t.navDisease, icon: ScanSearch, badge: t.photoAi || 'Photo AI' },
    { to: '/weather-alerts', label: t.navWeather, icon: CloudSun, badge: t.liveRadar || 'Live Radar' },
    { to: '/market-prices', label: t.navMarket, icon: TrendingUp, badge: t.mandiRates || 'Mandi Rates' },
    { to: '/profile', label: t.profileTitle || 'Farmer Profile', icon: UserCheck, badge: null }
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-agri-border min-h-[calc(100vh-4rem)] p-4 justify-between select-none">
      <div className="space-y-6">
        
        {/* Quick Farmer Card */}
        <div className="bg-agri-bg rounded-xl p-3 border border-agri-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-agri-dark text-white flex items-center justify-center font-bold text-sm shadow-subtle">
              {user?.name ? user.name.charAt(0) : 'K'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-agri-dark truncate">{user?.name || 'Kisan Saathi User'}</h4>
              <p className="text-[11px] text-agri-muted truncate">{user?.village || 'Kahalgaon'}, {user?.district || 'Bhagalpur'}</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-agri-border/60 flex items-center justify-between text-[11px]">
            <span className="text-agri-muted">{t.farmSize || 'Farm'}: <strong>{user?.farmSize || '3.5'} Acres</strong></span>
            <span className="text-agri-green font-semibold">{user?.soilType?.split(' ')[0] || 'Alluvial'}</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[10px] font-bold text-agri-muted uppercase tracking-wider mb-2">
            {t.fiveCoreModules}
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-agri-dark text-white shadow-subtle'
                        : 'text-agri-text hover:bg-agri-light/60 hover:text-agri-dark'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-agri-accent' : 'text-agri-green'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          isActive 
                            ? 'bg-agri-green/60 text-white' 
                            : 'bg-agri-light text-agri-dark'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Advisory Quick Helpline */}
        <div className="bg-agri-light/50 rounded-xl p-3 border border-agri-border/70 text-xs">
          <div className="flex items-center gap-1.5 text-agri-dark font-bold mb-1">
            <Phone className="w-3.5 h-3.5 text-agri-green" />
            <span>Kisan Call Center</span>
          </div>
          <p className="text-[11px] text-agri-muted leading-tight mb-2">
            Direct agronomic advice from ICAR experts in your regional dialect.
          </p>
          <a
            href="tel:18001801551"
            className="block text-center py-1.5 px-2 bg-agri-green text-white rounded-lg font-bold text-xs hover:bg-agri-dark transition-colors"
          >
            1800-180-1551 (Free)
          </a>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pt-4 border-t border-agri-border text-[11px] text-agri-muted">
        <div className="flex items-center gap-1.5 font-bold text-agri-dark mb-0.5">
          <Building2 className="w-3.5 h-3.5 text-agri-green" />
          <span>Team {INNOVIX_INFO.teamName}</span>
        </div>
        <p className="leading-tight text-[10px]">
          {INNOVIX_INFO.institutionShort} • {INNOVIX_INFO.program}
        </p>
        <p className="text-[9px] text-agri-muted mt-1">
          Mentor: {INNOVIX_INFO.guide.name}
        </p>
      </div>
    </aside>
  );
}
