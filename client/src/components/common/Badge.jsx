import React from 'react';

export default function Badge({ children, variant = 'green', size = 'sm', className = '' }) {
  const styles = {
    green: 'bg-agri-light text-agri-dark border-agri-accent/30',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    red: 'bg-red-50 text-red-800 border-red-200',
    blue: 'bg-sky-50 text-sky-800 border-sky-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${styles[variant] || styles.green} ${sizes[size] || sizes.sm} ${className}`}>
      {children}
    </span>
  );
}
