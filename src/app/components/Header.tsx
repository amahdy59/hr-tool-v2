import React, { useEffect, useState } from 'react';
import { Search, Keyboard, Menu, X, LogOut, LayoutDashboard, CalendarCheck, Users, FileText, Rocket, ShieldCheck, UserCircle, Palette, CloudOff, Banknote } from 'lucide-react';
import { Logo } from './Logo';
import { useTranslation } from 'react-i18next';
import { AccessibilityPanel, AccessibilitySettings } from './AccessibilityPanel';
import { NotificationCenter } from './NotificationCenter';
import { getPendingOfflineQueue } from '@/lib/offlineQueue';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from './ui/sheet';
import { cn } from '@/lib/utils';
import type { AppTab } from '../App';
import { localizePersonName } from '@/lib/localizedNames';

interface HeaderProps {
  currentUser: {
    name: string;
    email: string;
    position: string;
    image: string;
  } | null;
  accessibility: AccessibilitySettings;
  onOpenCommandPalette?: () => void;
  onOpenShortcuts?: () => void;
  onOpenStyleguide?: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onLogout?: () => void;
}

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export const Header: React.FC<HeaderProps> = ({ currentUser, accessibility, onOpenCommandPalette, onOpenShortcuts, onOpenStyleguide, activeTab, setActiveTab, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [offlinePendingCount, setOfflinePendingCount] = useState(0);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
  const displayName = localizePersonName(currentUser?.name, i18n.resolvedLanguage || i18n.language);

  useEffect(() => {
    const updateCount = async () => {
      const queue = await getPendingOfflineQueue();
      setOfflinePendingCount(queue.length);
    };
    updateCount();

    window.addEventListener('hr-offline-queue-changed', updateCount);
    window.addEventListener('online', updateCount);
    window.addEventListener('offline', updateCount);

    return () => {
      window.removeEventListener('hr-offline-queue-changed', updateCount);
      window.removeEventListener('online', updateCount);
      window.removeEventListener('offline', updateCount);
    };
  }, []);

  return (
    <header className="grid h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/80 border-b border-border/60 shadow-xs px-3 absolute top-0 left-0 right-0 z-[60] w-full sm:px-6 transition-all">
      <div className="flex min-w-0 items-center justify-start gap-2">
        {/* Hamburger Menu on Mobile/Tablet */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen} modal={false}>
          <SheetTrigger asChild>
            <button
              className="lg:hidden flex items-center justify-center w-11 h-11 border border-border/80 bg-card/70 backdrop-blur-md shadow-2xs rounded-xl hover:bg-muted text-foreground transition-all duration-200 active:scale-95 cursor-pointer relative overflow-hidden"
              aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
              title={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
              aria-expanded={isMenuOpen}
            >
              <Menu className={cn("w-4 h-4 transition-all duration-300 absolute", isMenuOpen && "rotate-90 scale-50 opacity-0")} />
              <X className={cn("w-4 h-4 transition-all duration-300 absolute -rotate-90 scale-50 opacity-0", isMenuOpen && "!rotate-0 !scale-100 !opacity-100")} />
            </button>
          </SheetTrigger>
          <SheetContent side={isArabic ? "right" : "left"} dir={isArabic ? "rtl" : "ltr"} className="w-80 p-0 flex flex-col h-full bg-card/95 backdrop-blur-2xl">
            <SheetHeader className="sr-only">
              <SheetTitle>{t('header.menu')}</SheetTitle>
              <SheetDescription>{t('header.navigationMenu')}</SheetDescription>
            </SheetHeader>
            
            {/* User Info */}
            <div className="p-4 border-b border-border/50">
              <SheetClose asChild>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex w-full items-center justify-start gap-3 p-2 rounded-xl text-start hover:bg-muted/70 active:scale-[0.98] transition-all cursor-pointer group"
                  aria-label={t('header.goProfile')}
                  title={t('header.goProfile')}
                >
                  {currentUser?.image ? (
                    <img src={currentUser.image} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold shrink-0 group-hover:bg-primary/20 transition-all">
                      {currentUser ? getInitials(currentUser.name) : 'U'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[var(--text-sm)] font-semibold text-foreground truncate group-hover:text-primary transition-colors">{displayName}</p>
                  </div>
                </button>
              </SheetClose>
            </div>

            {/* Nav Links */}
            <nav aria-label={t('sidebar.mainNavigation', 'Main navigation')} className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
              {[
                { id: 'dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
                { id: 'attendance', label: t('sidebar.attendance'), icon: CalendarCheck },
                { id: 'employees', label: t('sidebar.employees'), icon: Users },
                { id: 'leaves', label: t('sidebar.leaves'), icon: FileText },
                { id: 'missions', label: t('sidebar.missions'), icon: Rocket },
                { id: 'roles', label: t('sidebar.roles'), icon: ShieldCheck },
                { id: 'payrolls', label: t('sidebar.payrolls'), icon: Banknote },
                { id: 'profile', label: t('sidebar.myProfile'), icon: UserCircle },
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <SheetClose asChild key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id as AppTab)}
                      className={cn(
                        "w-full flex items-center justify-start gap-3 px-3.5 py-3 rounded-xl text-start text-[var(--text-sm)] font-medium transition-all duration-200 cursor-pointer",
                        isActive 
                          ? "bg-primary/15 text-primary font-semibold shadow-2xs border-s-4 border-primary" 
                          : "text-foreground hover:bg-muted/70 active:scale-[0.98]"
                      )}
                      aria-label={item.label}
                      title={item.label}
                    >
                      <item.icon className={cn("w-5 h-5 shrink-0 transition-transform", isActive ? "text-primary scale-110" : "text-muted-foreground")} />
                      <span>{item.label}</span>
                    </button>
                  </SheetClose>
                );
              })}
            </nav>

            {/* Bottom Actions (Logout & Offline status) */}
            <div className="border-t border-border/60 pt-4 mt-auto space-y-2 p-3">
              {offlinePendingCount > 0 && (
                <div
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/15 text-[#7C2D12] dark:text-amber-300 border border-amber-500/30 text-xs font-bold"
                  role="status"
                >
                  <CloudOff className="w-4 h-4 shrink-0 animate-pulse" aria-hidden="true" />
                  <span>{t('header.syncPending', { count: offlinePendingCount })}</span>
                </div>
              )}
              {onLogout && (
                <SheetClose asChild>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-start text-[var(--text-sm)] font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    aria-label={t('sidebar.logout')}
                    title={t('sidebar.logout')}
                  >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span>{t('sidebar.logout')}</span>
                  </button>
                </SheetClose>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <button
          onClick={onOpenCommandPalette}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/80 bg-card/60 backdrop-blur-md text-muted-foreground hover:bg-card hover:text-foreground hover:border-primary/40 shadow-2xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-56 md:justify-between md:px-3.5 xl:w-80 cursor-pointer"
          aria-label={t('header.searchCommand')}
          title={`${t('header.search')} (Ctrl+K)`}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden truncate md:inline">{t('header.search')}</span>
          </span>
          <kbd dir="ltr" data-no-auto-translate="true" className="hidden h-5 items-center justify-center rounded-md border border-border bg-background/80 px-1.5 font-mono text-[10px] font-semibold text-muted-foreground shadow-2xs xl:inline-flex">
            Ctrl K
          </kbd>
        </button>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl hover:opacity-85 hover:scale-105 active:scale-95 transition-all flex items-center justify-center p-1 min-h-11 min-w-11"
          aria-label={t('header.goDashboard')}
          title={t('header.goDashboard')}
        >
          <Logo className="w-12 h-12 text-primary" ariaLabel={t('common.appName')} />
        </button>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-2 lg:gap-2.5">
        {offlinePendingCount > 0 && (
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 text-[#7C2D12] dark:text-amber-300 border border-amber-500/30 text-xs font-bold select-none"
            title={t('header.syncPending', { count: offlinePendingCount })}
          >
            <CloudOff className="w-3.5 h-3.5 animate-pulse" aria-hidden="true" />
            <span className="hidden sm:inline">{offlinePendingCount}</span>
          </div>
        )}

        <NotificationCenter />

        {onOpenStyleguide && (
          <button
            type="button"
            onClick={onOpenStyleguide}
            className="hidden md:flex w-11 h-11 items-center justify-center rounded-xl border border-border/80 bg-card/60 backdrop-blur-md text-muted-foreground hover:bg-card hover:text-foreground shadow-2xs hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            aria-label={t('header.styleguide', 'Component Styleguide')}
            title={`${t('header.styleguide', 'Component Styleguide')} (Alt+S)`}
          >
            <Palette className="w-4 h-4" aria-hidden="true" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenShortcuts}
          className="hidden md:flex w-11 h-11 items-center justify-center rounded-xl border border-border/80 bg-card/60 backdrop-blur-md text-muted-foreground hover:bg-card hover:text-foreground shadow-2xs hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          aria-label={t('header.shortcutsTitle')}
          title={t('header.shortcutsTitle')}
        >
          <Keyboard className="w-4 h-4" aria-hidden="true" />
        </button>

        <div>
          <AccessibilityPanel settings={accessibility} />
        </div>
      </div>
    </header>
  );
};
