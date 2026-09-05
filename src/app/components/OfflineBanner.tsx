import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CheckCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { getPendingOfflineQueue, flushOfflineQueue } from '@/lib/offlineQueue';
import { toast } from 'sonner';

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
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const checkPending = async () => {
    const queue = await getPendingOfflineQueue();
    setPendingCount(queue.length);
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    const res = await flushOfflineQueue(async () => true);
    setIsSyncing(false);
    await checkPending();
    toast.success(
      isArabic
        ? `تمت مزامنة ${res.processed} طلب بنجاح!`
        : `Successfully synced ${res.processed} offline request(s)!`
    );
  };

  useEffect(() => {
    checkPending();
    window.addEventListener('hr-offline-queue-changed', checkPending);

    const handleOnline = async () => {
      setIsOffline(false);
      setShowReconnected(true);
      await handleSyncNow();
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
      checkPending();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('hr-offline-queue-changed', checkPending);
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
        'offline-banner w-full px-4 py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-3 border-b z-50 select-none flex-wrap',
        isOffline
          ? 'bg-amber-500/15 border-amber-500/30 text-amber-900 dark:text-amber-200'
          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
      )}
    >
      {isOffline ? (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <WifiOff className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <span>
            {isArabic
              ? 'أنت غير متصل بالإنترنت حالياً. التعديلات محفوظة محلياً وسيتم المزامنة عند عودة الاتصال.'
              : 'You are currently offline. Changes are saved locally and will sync when reconnected.'}
          </span>
          {pendingCount > 0 && (
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-200">
              {pendingCount} {isArabic ? 'طلبات معلقة' : 'pending'}
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>
            {isArabic ? 'تمت استعادة الاتصال بالإنترنت بنجاح.' : 'Internet connection restored. You are online.'}
          </span>
          {pendingCount > 0 && (
            <button
              type="button"
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={cn("w-3 h-3", isSyncing && "animate-spin")} />
              {isArabic ? 'مزامنة الآن' : 'Sync Now'}
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
