import React from 'react';
import { User, Search, Keyboard, Menu, X, LogOut, LayoutDashboard, CalendarCheck, Users, FileText, Rocket, ShieldCheck, UserCircle } from 'lucide-react';
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
  return (
    <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between sticky top-0 z-[60] sm:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu on Mobile/Tablet */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen} modal={false}>
          <SheetTrigger asChild>
            <button
              className="lg:hidden flex items-center justify-center w-11 h-11 border border-border bg-card shadow-sm rounded-[var(--radius-button)] hover:bg-muted text-foreground transition-all duration-300 cursor-pointer relative overflow-hidden"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              title={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
            >
              <Menu className={cn("w-5 h-5 transition-all duration-300 absolute", isMenuOpen && "rotate-90 scale-50 opacity-0")} />
              <X className={cn("w-5 h-5 transition-all duration-300 absolute -rotate-90 scale-50 opacity-0", isMenuOpen && "!rotate-0 !scale-100 !opacity-100")} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 flex flex-col h-full bg-card">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Navigation menu</SheetDescription>
            </SheetHeader>
            
            {/* User Info */}
            <div className="p-4 border-b border-border/50">
              <SheetClose asChild>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex w-full items-center gap-3 p-2 rounded-[var(--radius-card)] text-start hover:bg-muted active:scale-[0.98] transition-all cursor-pointer group"
                  aria-label="Go to my profile"
                  title="Go to my profile"
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
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
                { id: 'employees', label: 'Employees', icon: Users },
                { id: 'leaves', label: 'Leaves Management', icon: FileText },
                { id: 'missions', label: 'Missions Management', icon: Rocket },
                { id: 'roles', label: 'Roles Management', icon: ShieldCheck },
                { id: 'profile', label: 'My Profile', icon: UserCircle },
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
                      aria-label={`Go to ${item.label}`}
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
                    aria-label="Log out"
                    title="Log out"
                  >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span>Log out</span>
                  </button>
                </SheetClose>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Centered HR Tool Logo */}
      <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className="pointer-events-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md hover:opacity-80 transition-opacity"
          aria-label="Go to Dashboard"
          title="Go to Dashboard"
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
            HR Tool
          </h1>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 z-10">
        <button
          onClick={onOpenCommandPalette}
          className="flex w-9 h-9 sm:w-64 sm:h-9 sm:px-3 items-center justify-center sm:justify-between rounded-md border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Search or command palette (Ctrl+K)"
          title="Search or command palette (Ctrl+K)"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search...</span>
          </span>
          <kbd className="hidden sm:inline-flex h-5 items-center justify-center rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            Ctrl K
          </kbd>
        </button>

        <button
          onClick={onOpenShortcuts}
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Keyboard Shortcuts (?)"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <div>
          <AccessibilityPanel settings={accessibility} />
        </div>

        <button
          onClick={() => setActiveTab('profile')}
          className="hidden items-center gap-2.5 sm:flex rounded-[var(--radius)] px-1.5 py-1 hover:bg-muted transition-colors cursor-pointer"
          aria-label="Go to my profile"
          title="Go to my profile"
        >
          {currentUser?.image ? (
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-border">
              <img 
                src={currentUser.image} 
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div 
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border"
              role="img"
              aria-label={`Profile: ${currentUser?.name || 'User'}`}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              <span className="text-primary">
                {currentUser ? getInitials(currentUser.name) : 'U'}
              </span>
            </div>
          )}
          <span
            className="text-foreground"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {currentUser?.name || 'User'}
          </span>
        </button>
      </div>
    </header>
  );
};
