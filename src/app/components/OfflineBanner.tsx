import React from 'react';
import { WifiOff, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { getPendingOfflineQueue, flushOfflineQueue } from '@/lib/offlineQueue';
import { replayOfflineAction } from '@/lib/services/offlineReplay';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export const OfflineBanner: React.FC = () => {
  const { t } = useTranslation();
  const [offline, setOffline] = React.useState(() => !navigator.onLine);
  const [reconnected, setReconnected] = React.useState(false);
  const [pending, setPending] = React.useState(0);
  const [syncing, setSyncing] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const mounted = React.useRef(false);
  const online = React.useRef(navigator.onLine);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const syncingRef = React.useRef(false);

  const checkPending = React.useCallback(async () => {
    try {
      const queue = await getPendingOfflineQueue();
      if (mounted.current) setPending(queue.length);
      return queue.length;
    } catch {
      if (mounted.current) setFailed(true);
      return null;
    }
  }, []);

  const syncNow = React.useCallback(async () => {
    if (!online.current || syncingRef.current) return;
    syncingRef.current = true;
    setSyncing(true);
    setFailed(false);
    try {
      const result = await flushOfflineQueue(replayOfflineAction);
      if (mounted.current) {
        if (result.failed > 0) {
          setFailed(true);
          toast.error(t('reliability.syncFailed'));
        } else if (result.processed > 0) {
          toast.success(t(isSupabaseConfigured ? 'reliability.synced' : 'reliability.savedLocally', { count: result.processed }));
        }
      }
      await checkPending();
    } catch {
      if (mounted.current) { setFailed(true); toast.error(t('reliability.syncFailed')); }
    } finally {
      syncingRef.current = false;
      if (mounted.current) setSyncing(false);
    }
  }, [checkPending, t]);

  React.useEffect(() => {
    mounted.current = true;
    checkPending().then(count => { if (count && online.current && mounted.current) void syncNow(); });
    const handleOnline = () => {
      online.current = true;
      setOffline(false);
      setReconnected(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { if (mounted.current) setReconnected(false); }, 4000);
      void syncNow();
    };
    const handleOffline = () => {
      online.current = false;
      setOffline(true);
      setReconnected(false);
      clearTimeout(timer.current);
      void checkPending();
    };
    window.addEventListener('hr-offline-queue-changed', checkPending);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
      window.removeEventListener('hr-offline-queue-changed', checkPending);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkPending, syncNow]);

  if (!offline && !reconnected && pending === 0 && !failed && !syncing) return null;
  const Icon = offline ? WifiOff : failed ? AlertCircle : syncing ? RefreshCw : CheckCircle;
  const message = offline ? 'reliability.offline' : failed ? 'reliability.syncFailed' : syncing ? 'reliability.syncing' : pending > 0 ? 'reliability.pending' : 'reliability.reconnected';

  return (
    <aside role="status" aria-live="polite" className={cn(
      'offline-banner flex shrink-0 flex-wrap items-center gap-3 border-b px-4 py-3 text-sm',
      offline || failed ? 'border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100' : 'border-border bg-muted text-foreground'
    )}>
      <Icon className={cn('h-4 w-4 shrink-0', syncing && 'animate-spin')} aria-hidden="true" />
      <span className="min-w-0 flex-1 break-words">{t(message)}{pending > 0 && ' ' + t('reliability.pendingCount', { count: pending })}</span>
      {!offline && (pending > 0 || failed) && (
        <button type="button" disabled={syncing} onClick={() => void syncNow()} className="min-h-11 rounded-xl border border-current px-3 text-sm font-medium transition-colors hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">
          {t(syncing ? 'reliability.syncing' : 'reliability.retry')}
        </button>
      )}
    </aside>
  );
};
