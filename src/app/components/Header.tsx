import React, { useEffect, useState } from 'react';
import {
  Search,
  Keyboard,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  CalendarCheck,
  Users,
  FileText,
  Rocket,
  ShieldCheck,
  UserCircle,
  Palette,
  CloudOff,
  Banknote,
  Sun,
  Moon,
  Languages,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Logo } from './Logo';
import { useTranslation } from 'react-i18next';
import { AccessibilityPanel, AccessibilitySettings } from './AccessibilityPanel';
import { NotificationCenter } from './NotificationCenter';
import { getPendingOfflineQueue } from '@/lib/offlineQueue';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
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
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

const tabIcons: Record<AppTab, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  attendance: CalendarCheck,
  employees: Users,
  leaves: FileText,
  missions: Rocket,
  roles: ShieldCheck,
  payrolls: Banknote,
  profile: UserCircle,
};

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  accessibility,
  onOpenCommandPalette,
  onOpenShortcuts,
  onOpenStyleguide,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [offlinePendingCount, setOfflinePendingCount] = useState(0);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
  const currentLang = i18n.resolvedLanguage || i18n.language || 'en';
  const displayName = localizePersonName(currentUser?.name, currentLang);

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

  const ActiveIcon = tabIcons[activeTab] || LayoutDashboard;
  const activeTabLabel = t(`sidebar.${activeTab}`, activeTab);

  const isDarkMode =
    accessibility.theme === 'dark' ||
    (accessibility.theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleToggleTheme = () => {
    accessibility.setTheme(isDarkMode ? 'light' : 'dark');
  };

  const handleToggleLanguage = () => {
    accessibility.setLanguage(isArabic ? 'en' : 'ar');
  };

  return (
    <header
      role="banner"
      className="flex h-16 items-center justify-between gap-2 sm:gap-4 bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/80 border-b border-border/60 shadow-xs px-3 sm:px-6 absolute top-0 left-0 right-0 z-[60] w-full transition-all"
    >
      {/* 1. Left Zone: Mobile Nav, Brand Mark (mobile), Search & Breadcrumbs */}
      <div className="flex min-w-0 items-center justify-start gap-2 sm:gap-3 flex-1">
        {/* Hamburger Menu on Mobile/Tablet */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button
              className="lg:hidden flex items-center justify-center w-11 h-11 border border-border/80 bg-card/70 backdrop-blur-md shadow-2xs rounded-xl hover:bg-muted text-foreground transition-all duration-200 active:scale-95 cursor-pointer relative overflow-hidden shrink-0"
              aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
              title={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
              aria-expanded={isMenuOpen}
            >
              <Menu
                className={cn(
                  'w-4 h-4 transition-all duration-300 absolute',
                  isMenuOpen && 'rotate-90 scale-50 opacity-0'
                )}
              />
              <X
                className={cn(
                  'w-4 h-4 transition-all duration-300 absolute -rotate-90 scale-50 opacity-0',
                  isMenuOpen && '!rotate-0 !scale-100 !opacity-100'
                )}
              />
            </button>
          </SheetTrigger>
          <SheetContent
            side={isArabic ? 'right' : 'left'}
            dir={isArabic ? 'rtl' : 'ltr'}
            className="w-80 max-w-[calc(100vw-1rem)] p-0 flex flex-col gap-0 h-dvh bg-card/95 backdrop-blur-2xl pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>{t('header.menu')}</SheetTitle>
              <SheetDescription>{t('header.navigationMenu')}</SheetDescription>
            </SheetHeader>

            {/* User Info on Mobile Drawer */}
            <div className="p-4 pe-16 border-b border-border/50 shrink-0">
              <SheetClose asChild>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex w-full items-center justify-start gap-3 p-2 rounded-xl text-start hover:bg-muted/70 active:scale-[0.98] transition-all cursor-pointer group"
                  aria-label={t('header.goProfile')}
                  title={t('header.goProfile')}
                >
                  {currentUser?.image ? (
                    <img
                      src={currentUser.image}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold shrink-0 group-hover:bg-primary/20 transition-all">
                      {currentUser ? getInitials(currentUser.name) : 'U'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[var(--text-sm)] font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {displayName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentUser?.position || 'Staff'}
                    </p>
                  </div>
                </button>
              </SheetClose>
            </div>

            <nav aria-label={t('header.navigationMenu')} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {(Object.keys(tabIcons) as AppTab[]).filter((tab) => tab !== 'profile').map((tab) => {
                  const Icon = tabIcons[tab];
                  const isActive = tab === activeTab;
                  return (
                    <li key={tab}>
                      <SheetClose asChild>
                        <button
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'flex min-h-11 w-full items-center justify-start gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            isActive ? 'bg-primary/10 text-blue-700 dark:text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                          <span>{t(`sidebar.${tab}`)}</span>
                        </button>
                      </SheetClose>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Drawer Bottom Actions */}
            <div className="border-t border-border/60 p-3 mt-auto space-y-2 shrink-0">
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
                    className="w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-start text-[var(--text-sm)] font-medium text-red-700 dark:text-red-300 hover:bg-destructive/10 transition-colors cursor-pointer"
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

        {/* Mobile/Tablet Brand Logo - Only when desktop sidebar is hidden */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="lg:hidden flex items-center justify-center p-1 rounded-xl text-primary hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
          aria-label={t('header.goDashboard')}
          title={t('header.goDashboard')}
        >
          <Logo variant="icon" size="sm" ariaLabel={t('common.appName')} />
        </button>

        {/* Universal Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/80 bg-card/60 backdrop-blur-md text-muted-foreground hover:bg-card hover:text-foreground hover:border-primary/40 shadow-2xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-52 lg:w-56 xl:w-72 md:justify-between md:px-3.5 cursor-pointer shrink-0"
          aria-label={t('header.searchCommand')}
          title={`${t('header.search')} (Ctrl+K)`}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden truncate md:inline">{t('header.search')}</span>
          </span>
          <kbd
            dir="ltr"
            data-no-auto-translate="true"
            className="hidden h-5 items-center justify-center rounded-md border border-border bg-background/80 px-1.5 font-mono text-[10px] font-semibold text-muted-foreground shadow-2xs xl:inline-flex"
          >
            Ctrl K
          </kbd>
        </button>

        {/* Desktop Contextual Breadcrumb */}
        <nav
          aria-label={t('header.breadcrumb', 'Current location')}
          className="hidden lg:flex items-center gap-1.5 xl:gap-2 select-none ms-1 min-w-0"
        >
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-card/70 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            aria-label={t('header.goDashboard')}
            title={t('header.goDashboard')}
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span style={{ fontFamily: "'Inter', sans-serif" }}>HR Tool</span>
          </button>
          <ChevronRight
            className="w-3.5 h-3.5 text-muted-foreground/50 rtl:rotate-180 shrink-0"
            aria-hidden="true"
          />
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold shadow-2xs min-w-0"
            aria-current="page"
          >
            <ActiveIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate max-w-[120px] xl:max-w-none" style={{ fontFamily: "'Inter', sans-serif" }}>{activeTabLabel}</span>
          </div>
        </nav>
      </div>

      {/* 2. Right Zone: Action Controls & User Account Hub */}
      <div
        role="toolbar"
        aria-label={t('header.toolbar', 'Application toolbar')}
        className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2"
      >
        {offlinePendingCount > 0 && (
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 text-[#7C2D12] dark:text-amber-300 border border-amber-500/30 text-xs font-bold select-none"
            title={t('header.syncPending', { count: offlinePendingCount })}
          >
            <CloudOff className="w-3.5 h-3.5 animate-pulse" aria-hidden="true" />
            <span className="hidden sm:inline">{offlinePendingCount}</span>
          </div>
        )}

        {/* Unified Quick Controls Capsule (Theme + Language) */}
        <div className="hidden sm:inline-flex items-center p-0.5 rounded-xl border border-border/80 bg-card/60 backdrop-blur-md shadow-2xs gap-0.5 shrink-0">
          {/* Quick Theme Switcher */}
          <button
            type="button"
            onClick={handleToggleTheme}
            className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            aria-label={isDarkMode ? t('header.switchToLight') : t('header.switchToDark')}
            title={isDarkMode ? t('header.switchToLight') : t('header.switchToDark')}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 dark:text-slate-200 transition-transform rotate-0" aria-hidden="true" />
            )}
          </button>

          {/* Divider */}
          <div className="hidden md:block h-4 w-px bg-border/60" aria-hidden="true" />

          {/* Quick Language Switcher */}
          <button
            type="button"
            onClick={handleToggleLanguage}
            className="hidden md:inline-flex h-10 px-2.5 items-center justify-center gap-1.5 rounded-lg text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            aria-label={t('header.toggleLanguage')}
            title={t('header.toggleLanguage')}
          >
            <Languages className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
              {isArabic ? 'EN' : 'عربي'}
            </span>
          </button>
        </div>

        {/* Notification Center */}
        <div className="hidden sm:block shrink-0">
          <NotificationCenter />
        </div>

        {/* Subtle Visual Divider */}
        <div className="hidden sm:block h-5 w-px bg-border/60 mx-0.5" aria-hidden="true" />

        {onOpenStyleguide && (
          <button
            type="button"
            onClick={onOpenStyleguide}
            className="hidden xl:flex w-11 h-11 items-center justify-center rounded-xl border border-border/80 bg-card/60 backdrop-blur-md text-muted-foreground hover:bg-card hover:text-foreground shadow-2xs hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            aria-label={t('header.styleguide', 'Component Styleguide')}
            title={`${t('header.styleguide', 'Component Styleguide')} (Alt+S)`}
          >
            <Palette className="w-4 h-4" aria-hidden="true" />
          </button>
        )}

        {onOpenShortcuts && (
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="hidden xl:flex w-11 h-11 items-center justify-center rounded-xl border border-border/80 bg-card/60 backdrop-blur-md text-muted-foreground hover:bg-card hover:text-foreground shadow-2xs hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            aria-label={t('header.shortcutsTitle')}
            title={t('header.shortcutsTitle')}
          >
            <Keyboard className="w-4 h-4" aria-hidden="true" />
          </button>
        )}

        {/* Accessibility Panel Modal */}
        <AccessibilityPanel settings={accessibility} />

        {/* User Account Menu Hub */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 p-1 sm:ps-1.5 sm:pe-2.5 rounded-xl border border-border/80 bg-card/60 hover:bg-card hover:border-primary/40 backdrop-blur-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer group min-h-[44px] min-w-[44px] shadow-2xs active:scale-95"
              aria-label={t('header.userMenu', 'User account menu')}
              title={displayName}
            >
              <div className="relative">
                {currentUser?.image ? (
                  <img
                    src={currentUser.image}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary text-xs font-bold shrink-0 group-hover:bg-primary/20 transition-all">
                    {currentUser ? getInitials(currentUser.name) : 'U'}
                  </div>
                )}
                <span className="absolute bottom-0 end-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-card" aria-hidden="true" />
              </div>
              <div className="hidden xl:flex flex-col text-start min-w-0 max-w-[120px]">
                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {displayName}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {currentUser?.position || 'Staff'}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isArabic ? 'start' : 'end'}
            sideOffset={8}
            className="w-64 p-2 shadow-2xl border-border bg-card/95 backdrop-blur-2xl rounded-2xl z-[100]"
          >
            <div className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-xl mb-1 border border-border/50">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold shrink-0">
                {currentUser ? getInitials(currentUser.name) : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">{displayName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{currentUser?.email}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">Online</span>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveTab('profile')} className="cursor-pointer">
              <UserCircle className="w-4 h-4 me-2 text-primary shrink-0" />
              <span>{t('header.myProfile', 'My Profile')}</span>
            </DropdownMenuItem>
            {onLogout && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={onLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 me-2 shrink-0" />
                  <span>{t('sidebar.logout')}</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
