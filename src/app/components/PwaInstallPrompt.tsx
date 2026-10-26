import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try { setDismissed(Boolean(localStorage.getItem('pwa_prompt_dismissed'))); } catch { /* Keep the prompt usable without storage. */ }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    const installed = () => setDeferredPrompt(null);
    window.addEventListener('appinstalled', installed);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);

  if (!deferredPrompt || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    const prompt = deferredPrompt;
    setDeferredPrompt(null); // Install prompts are single use, including dismissal.
    try { await prompt.prompt(); await prompt.userChoice; }
    catch { toast.error(isArabic ? 'تعذّر فتح التثبيت. استخدم قائمة المتصفح للمحاولة مجدداً.' : 'Could not open installation. Use the browser menu to try again.'); }
  };

  const handleDismiss = () => {
    setDismissed(true);
    try { localStorage.setItem('pwa_prompt_dismissed', 'true'); } catch { /* Dismiss for this session. */ }
  };

  return (
    <aside
      role="region"
      aria-label={isArabic ? 'تثبيت التطبيق' : 'Install Application'}
      className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-muted px-4 py-3 text-sm text-foreground"
    >
      <div className="flex min-w-0 flex-[1_1_12rem] items-start gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
        <p className="min-w-0 break-words font-medium">
          {t('reliability.installDescription')}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleInstallClick}
          className="px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-2xs hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
        >
          {isArabic ? 'تثبيت الآن' : 'Install Now'}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-primary/20 transition-all cursor-pointer"
          aria-label={t('common.close', 'Close')}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
};
