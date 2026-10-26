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
  CloudOff,
  Banknote,
} from 'lucide-react';
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
  DropdownMenuLabel,
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
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const openingShortcuts = React.useRef(false);
  const [offlinePendingCount, setOfflinePendingCount] = useState(0);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
  const currentLang = i18n.resolvedLanguage || i18n.language || 'en';
  const displayName = localizePersonName(currentUser?.name, currentLang);

  useEffect(() => {
    const updateCount = async () => {
      try {
        const queue = await getPendingOfflineQueue();
        setOfflinePendingCount(queue.length);
      } catch { /* Keep the last known count when offline storage is unavailable. */ }
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

  const activeTabLabel = t('sidebar.' + activeTab, activeTab);

  return (
    <header
      role="banner"
      className="relative z-[60] flex h-16 w-full shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-3 sm:gap-4 sm:px-6"
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

        <span className="min-w-0 truncate text-sm font-semibold text-foreground sm:text-base">{activeTabLabel}</span>
      </div>

      <div role="group" aria-label={t('header.toolbar')} className="flex shrink-0 items-center gap-1 sm:gap-2">
        {onOpenCommandPalette && (
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-48 md:justify-start md:border md:border-border md:px-3 xl:w-64"
            aria-label={t('header.searchCommand')}
            title={t('header.searchCommand')}
          >
            <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="hidden text-sm md:inline">{t('header.search')}</span>
          </button>
        )}
        <NotificationCenter accountId={currentUser?.email || 'demo'} />
        <AccessibilityPanel settings={accessibility} compact />

        {/* User Account Menu Hub */}
        <DropdownMenu dir={isArabic ? 'rtl' : 'ltr'}>
          <DropdownMenuTrigger asChild>
            <button
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t('header.userMenu', 'User account menu')}
              title={displayName}
            >
              {currentUser?.image ? (
                <img src={currentUser.image} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-blue-700 dark:text-primary" aria-hidden="true">
                  {currentUser ? getInitials(currentUser.name) : 'U'}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isArabic ? 'start' : 'end'}
            sideOffset={8}
            className="w-64 max-w-[calc(100vw-2rem)] bg-popover"
            onCloseAutoFocus={(event) => {
              if (openingShortcuts.current) { event.preventDefault(); openingShortcuts.current = false; }
            }}
          >
            <DropdownMenuLabel className="px-3 py-2">
              <span className="block truncate text-sm font-semibold">{displayName}</span>
              <span className="mt-1 block truncate text-xs font-normal text-muted-foreground" dir="ltr" data-no-auto-translate>{currentUser?.email}</span>
              <span className="mt-2 block text-xs font-normal text-muted-foreground">{t('reliability.demoWorkspace')}</span>
            </DropdownMenuLabel>
            {offlinePendingCount > 0 && (
              <div role="status" className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                <CloudOff className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t('header.syncPending', { count: offlinePendingCount })}</span>
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveTab('profile')} className="cursor-pointer">
              <UserCircle className="w-4 h-4 me-2 text-primary shrink-0" />
              <span>{t('header.myProfile', 'My Profile')}</span>
            </DropdownMenuItem>
            {onOpenShortcuts && (
              <DropdownMenuItem onSelect={() => { openingShortcuts.current = true; onOpenShortcuts(); }} className="gap-2">
                <Keyboard className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t('header.shortcuts')}</span>
              </DropdownMenuItem>
            )}
            {onLogout && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={onLogout}
                  className="cursor-pointer text-red-700 focus:text-red-800 dark:text-red-300 dark:focus:text-red-200"
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
