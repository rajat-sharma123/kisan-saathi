import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'लोड हो रहा है... / Loading...', size = 'md' }) {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <Loader2 className={`${iconSizes[size] || iconSizes.md} animate-spin text-agri-green mb-3`} />
      {text && <p className="text-sm font-medium text-agri-muted">{text}</p>}
    </div>
  );
}
