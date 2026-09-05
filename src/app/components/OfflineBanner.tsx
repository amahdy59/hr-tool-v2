import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export const OfflineBanner: React.FC = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  const [isOffline, setIsOffline] = useState(() => {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return !navigator.onLine;
    }
    return false;
  });

  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !showReconnected) {
    return null;
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      className={cn(
        'offline-banner w-full px-4 py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 border-b z-50 select-none',
        isOffline
          ? 'bg-amber-500/15 border-amber-500/30 text-amber-900 dark:text-amber-200'
          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
      )}
    >
      {isOffline ? (
        <>
          <WifiOff className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <span>
            {isArabic
              ? 'أنت غير متصل بالإنترنت حالياً. التعديلات محفوظة محلياً وسيتم المزامنة عند عودة الاتصال.'
              : 'You are currently offline. Changes are saved locally and will sync when reconnected.'}
          </span>
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>
            {isArabic ? 'تمت استعادة الاتصال بالإنترنت بنجاح.' : 'Internet connection restored. You are online.'}
          </span>
        </>
      )}
    </aside>
  );
};
