import React from 'react';
import { Search, Keyboard, Menu, X, LogOut, LayoutDashboard, CalendarCheck, Users, FileText, Rocket, ShieldCheck, UserCircle, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AccessibilityPanel, AccessibilitySettings } from './AccessibilityPanel';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from './ui/sheet';
import { cn } from '@/lib/utils';
import type { AppTab } from '../App';

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
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export const Header: React.FC<HeaderProps> = ({ currentUser, accessibility, onOpenCommandPalette, onOpenShortcuts, activeTab, setActiveTab, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
    i18n.changeLanguage(isArabic ? 'en' : 'ar');
  };

  return (
    <header className="grid h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 bg-card/80 backdrop-blur-md px-3 sticky top-0 z-[60] sm:px-6">
      <div className="flex min-w-0 items-center justify-start gap-2">
        {/* Hamburger Menu on Mobile/Tablet */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen} modal={false}>
          <SheetTrigger asChild>
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 border border-border bg-card shadow-sm rounded-[var(--radius-button)] hover:bg-muted text-foreground transition-all duration-300 cursor-pointer relative overflow-hidden"
              aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
              title={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
              aria-expanded={isMenuOpen}
            >
              <Menu className={cn("w-4 h-4 transition-all duration-300 absolute", isMenuOpen && "rotate-90 scale-50 opacity-0")} />
              <X className={cn("w-4 h-4 transition-all duration-300 absolute -rotate-90 scale-50 opacity-0", isMenuOpen && "!rotate-0 !scale-100 !opacity-100")} />
            </button>
          </SheetTrigger>
          <SheetContent side={i18n.language === 'ar' ? 'right' : 'left'} className="w-80 p-0 flex flex-col h-full bg-card">
            <SheetHeader className="sr-only">
              <SheetTitle>{t('header.menu')}</SheetTitle>
              <SheetDescription>{t('header.navigationMenu')}</SheetDescription>
            </SheetHeader>
            
            {/* User Info */}
            <div className="p-4 border-b border-border/50">
              <SheetClose asChild>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex w-full items-center gap-3 p-2 rounded-[var(--radius-card)] text-start hover:bg-muted active:scale-[0.98] transition-all cursor-pointer group"
                  aria-label={t('header.goProfile')}
                  title={t('header.goProfile')}
                >
                  {currentUser?.image ? (
                    <img src={currentUser.image} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold shrink-0 group-hover:bg-primary/20 transition-all">
                      {currentUser ? getInitials(currentUser.name) : 'U'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[var(--text-sm)] font-semibold text-foreground truncate group-hover:text-primary transition-colors">{currentUser?.name}</p>
                  </div>
                </button>
              </SheetClose>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
              {[
                { id: 'dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
                { id: 'attendance', label: t('sidebar.attendance'), icon: CalendarCheck },
                { id: 'employees', label: t('sidebar.employees'), icon: Users },
                { id: 'leaves', label: t('sidebar.leaves'), icon: FileText },
                { id: 'missions', label: t('sidebar.missions'), icon: Rocket },
                { id: 'roles', label: t('sidebar.roles'), icon: ShieldCheck },
                { id: 'profile', label: t('sidebar.myProfile'), icon: UserCircle },
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <SheetClose asChild key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id as AppTab)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-[var(--radius)] text-start text-[var(--text-sm)] font-medium transition-colors cursor-pointer",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-foreground hover:bg-muted"
                      )}
                      aria-label={item.label}
                      title={item.label}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  </SheetClose>
                );
              })}
            </nav>

            {/* Bottom Actions (Logout) */}
            <div className="border-t border-border pt-4 mt-auto space-y-2">
              
              {onLogout && (
                <SheetClose asChild>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-start text-[var(--text-sm)] font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
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
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-56 md:justify-between md:px-3 xl:w-80"
          aria-label={t('header.searchCommand')}
          title={`${t('header.search')} (Ctrl+K)`}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden truncate md:inline">{t('header.search')}</span>
          </span>
          <kbd className="hidden h-5 items-center justify-center rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground xl:inline-flex">
            Ctrl K
          </kbd>
        </button>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md hover:opacity-80 transition-opacity flex items-center px-2"
          aria-label={t('header.goDashboard')}
          title={t('header.goDashboard')}
        >
          <h1
            className="text-primary"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 'clamp(var(--text-base), 4vw, var(--text-lg))',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 1.2,
            }}
          >
            {t('common.appName')}
          </h1>
        </button>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-2 lg:gap-3">
        <button
          onClick={onOpenShortcuts}
          className="hidden md:flex w-9 h-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t('header.shortcutsTitle')}
          title={t('header.shortcutsTitle')}
        >
          <Keyboard className="w-4 h-4" aria-hidden="true" />
        </button>

        <button
          onClick={toggleLanguage}
          className="flex w-9 h-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t('header.toggleLanguage')}
          title={t('header.toggleLanguage')}
        >
          <Languages className="w-4 h-4" aria-hidden="true" />
        </button>

        <div>
          <AccessibilityPanel settings={accessibility} />
        </div>

      </div>
    </header>
  );
};
