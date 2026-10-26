import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

export const ReloadPrompt: React.FC = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
  const updateTimer = React.useRef<ReturnType<typeof setInterval>>();
  const [updating, setUpdating] = React.useState(false);
  const [updateFailed, setUpdateFailed] = React.useState(false);
  React.useEffect(() => () => clearInterval(updateTimer.current), []);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Periodically check for SW updates every hour
        clearInterval(updateTimer.current);
        updateTimer.current = setInterval(() => {
          r.update().catch(() => {});
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn('SW registration error:', error);
    },
  });

  const close = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="pwa-reload-prompt w-full border-b border-border bg-card p-4 flex items-start gap-3 text-foreground"
    >
      <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
        <Sparkles className="w-5 h-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1 text-start space-y-1 break-words">
        <h4 className="text-[var(--text-sm)] font-[var(--font-weight-semibold)]">
          {isArabic ? 'تحديث جديد متوفر!' : 'New Version Available!'}
        </h4>
        <p className="text-[var(--text-xs)] text-muted-foreground">
          {isArabic
            ? 'احفظ عملك قبل التحديث. سيُعاد تحميل التطبيق.'
            : 'Save your work before updating. The app will reload.'}
        </p>
        {updateFailed && <p className="text-sm text-destructive">{isArabic ? 'تعذّر التحديث. حاول مرة أخرى.' : 'Update failed. Please try again.'}</p>}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Button
            size="sm"
            disabled={updating}
            onClick={async () => {
              setUpdating(true); setUpdateFailed(false);
              try { await updateServiceWorker(true); }
              catch { setUpdateFailed(true); }
              finally { setUpdating(false); }
            }}
            className="gap-1.5 h-8 text-xs font-medium cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            {isArabic ? 'تحديث الآن' : 'Update Now'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={close}
            className="h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {isArabic ? 'لاحقاً' : 'Later'}
          </Button>
        </div>
      </div>

      <button
        onClick={close}
        className="text-muted-foreground hover:text-foreground p-1 rounded-xl transition-colors cursor-pointer"
        aria-label={isArabic ? 'إغلاق الإشعار' : 'Dismiss notification'}
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};
