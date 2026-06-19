import React from 'react';
import { User, Search, Keyboard, Menu, LogOut, LayoutDashboard, CalendarCheck, Users, FileText, Rocket, ShieldCheck, UserCircle } from 'lucide-react';
import { AccessibilityPanel, AccessibilitySettings } from './AccessibilityPanel';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from './ui/sheet';
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
  return (
    <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between sticky top-0 z-[60] sm:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu on Mobile/Tablet */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="lg:hidden flex items-center justify-center w-11 h-11 border border-border bg-muted/50 rounded-md hover:bg-muted text-foreground transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-5 flex flex-col h-full bg-card">
            <SheetHeader className="border-b border-border pb-4 mb-4">
              <SheetTitle style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-primary text-xl font-bold">
                HR Tool
              </SheetTitle>
            </SheetHeader>
            
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-[var(--radius-card)] border border-border/50 mb-4">
              {currentUser?.image ? (
                <img src={currentUser.image} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-border text-primary font-bold">
                  {currentUser ? getInitials(currentUser.name) : 'U'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[var(--text-sm)] font-semibold text-foreground truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{currentUser?.email}</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto space-y-1">
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
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-start text-[var(--text-sm)] font-medium transition-colors cursor-pointer",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  </SheetClose>
                );
              })}
            </nav>

            {/* Logout footer */}
            {onLogout && (
              <div className="border-t border-border pt-4 mt-auto">
                <SheetClose asChild>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-start text-[var(--text-sm)] font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span>Log out</span>
                  </button>
                </SheetClose>
              </div>
            )}
          </SheetContent>
        </Sheet>

        <h1
          className="text-primary"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(var(--text-base), 4vw, var(--text-lg))',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 1.2,
          }}
        >
          HR Tool
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center justify-between w-48 sm:w-64 h-9 px-3 border border-border rounded-md bg-muted/50 text-sm text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Search or command palette (Ctrl+K)"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Search...</span>
          </span>
          <kbd className="hidden sm:inline-flex h-5 items-center justify-center rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            Ctrl K
          </kbd>
        </button>

        <button
          onClick={onOpenShortcuts}
          className="hidden lg:flex w-9 h-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Keyboard Shortcuts (?)"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <AccessibilityPanel settings={accessibility} />

        <div className="hidden items-center gap-2.5 sm:flex">
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
        </div>
      </div>
    </header>
  );
};
