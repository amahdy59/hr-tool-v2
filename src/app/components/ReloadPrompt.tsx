import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

export const ReloadPrompt: React.FC = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Periodically check for SW updates every hour
        setInterval(() => {
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
      role="alert"
      aria-live="assertive"
      className="pwa-reload-prompt fixed bottom-5 end-5 z-50 max-w-md bg-card/95 backdrop-blur-md border border-primary/30 rounded-[var(--radius-card)] p-4 shadow-[var(--elevation-lg)] flex items-start gap-3 text-foreground animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-2 rounded-[var(--radius-sm)] bg-primary/10 text-primary shrink-0 mt-0.5">
        <Sparkles className="w-5 h-5" aria-hidden="true" />
      </div>

      <div className="flex-1 text-start space-y-1">
        <h4 className="text-[var(--text-sm)] font-[var(--font-weight-semibold)]">
          {isArabic ? 'تحديث جديد متوفر!' : 'New Version Available!'}
        </h4>
        <p className="text-[var(--text-xs)] text-muted-foreground">
          {isArabic
            ? 'تم نشر تحديث جديد لنظام الموارد البشرية. انقر لتحديث التطبيق فوراً.'
            : 'A newer version of the HR portal is ready. Click to refresh and activate.'}
        </p>
        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => updateServiceWorker(true)}
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
        className="text-muted-foreground hover:text-foreground p-1 rounded-[var(--radius-sm)] transition-colors cursor-pointer"
        aria-label={isArabic ? 'إغلاق الإشعار' : 'Dismiss notification'}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
