import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    const isDismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (isDismissed) {
      setDismissed(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!deferredPrompt || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  return (
    <aside
      role="region"
      aria-label={isArabic ? 'تثبيت التطبيق' : 'Install Application'}
      className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-between gap-3 text-xs sm:text-sm text-foreground select-none transition-all z-40"
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
        <p className="truncate font-medium">
          {isArabic
            ? 'قم بتثبيت HR Tool على جهازك لتجربة أسرع ودعم وضع عدم الاتصال.'
            : 'Install HR Tool on your device for faster access and full offline support.'}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleInstallClick}
          className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-md shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
        >
          {isArabic ? 'تثبيت الآن' : 'Install Now'}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
          aria-label={t('common.close', 'Close')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
