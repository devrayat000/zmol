'use client';

import { useEffect, useState } from 'react';

export function LoadingSpinner({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizes[size]} animate-spin rounded-full border-2 border-border border-t-primary`} />
  );
}

export function GlowingLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-primary/30 rounded-full animate-spin border-t-primary glow-border" />
        <div className="absolute inset-0 w-12 h-12 border-2 border-transparent rounded-full animate-pulse glow-border-strong" />
      </div>
    </div>
  );
}
