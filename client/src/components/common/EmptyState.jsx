import React from 'react';
import { Sprout } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Sprout, 
  title = 'कोई डेटा उपलब्ध नहीं / No Data Available', 
  description = 'कृपया खोज या फ़िल्टर बदलकर दोबारा प्रयास करें।',
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-agri-border shadow-subtle my-4">
      <div className="w-14 h-14 rounded-full bg-agri-light flex items-center justify-center text-agri-green mb-3">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-agri-text mb-1">{title}</h3>
      <p className="text-sm text-agri-muted max-w-sm mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
