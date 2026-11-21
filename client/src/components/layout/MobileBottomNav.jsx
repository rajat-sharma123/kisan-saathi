import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mic, Sprout, ScanSearch, TrendingUp } from 'lucide-react';
import { useAuth } from '../../store/useAuthStore';
import { getTranslation } from '../../data/languageData';

export default function MobileBottomNav() {
  const { language } = useAuth();
  const t = getTranslation(language);

  const items = [
    { to: '/dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { to: '/voice-assistant', label: t.navVoice, icon: Mic, highlight: true },
    { to: '/crop-advisory', label: t.navCrop, icon: Sprout },
    { to: '/disease-detection', label: t.navDisease, icon: ScanSearch },
    { to: '/market-prices', label: t.navMarket, icon: TrendingUp }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-agri-border shadow-lift px-2 py-1">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-agri-dark font-bold'
                    : 'text-agri-muted hover:text-agri-dark font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-full transition-transform ${
                    item.highlight 
                      ? 'bg-agri-dark text-white -mt-3 shadow-md border-2 border-white' 
                      : isActive 
                        ? 'bg-agri-light text-agri-dark' 
                        : 'text-agri-muted'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
