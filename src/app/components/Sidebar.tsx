import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Wallet,
  Users,
  FileText,
  Rocket,
  ShieldCheck,
  UserCircle,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from './ui/tooltip';
import type { AppTab } from '../App';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  collapsed: boolean;
  onToggle: () => void;
  onLogout?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'payrolls', label: 'Payrolls', icon: Wallet },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'leaves', label: 'Leaves Management', icon: FileText },
  { id: 'missions', label: 'Missions Management', icon: Rocket },
  { id: 'roles', label: 'Roles Management', icon: ShieldCheck },
] as const satisfies ReadonlyArray<{ id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }>;

const footerItems = [
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'logout', label: 'Log out', icon: LogOut },
] as const;

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, collapsed, onToggle, onLogout }) => {
  const NavButton = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = activeTab === item.id;
    const button = (
      <button
        onClick={() => setActiveTab(item.id)}
        className={cn(
          'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] transition-all duration-300 ease-out text-[var(--text-sm)] cursor-pointer overflow-hidden group justify-start',
          collapsed ? 'justify-center' : 'justify-start',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm scale-[0.98]'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground hover:scale-[1.02] active:scale-[0.98]'
        )}
      >
        {/* Ripple effect on click */}
        <span className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-200" />
        
        <item.icon className={cn(
          "w-5 h-5 shrink-0 transition-transform duration-300 ease-out",
          isActive ? "scale-110" : "group-hover:scale-110"
        )} />
        {!collapsed && (
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 'var(--font-weight-medium)',
            }}
            className="transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis text-left"
          >
            {item.label}
          </span>
        )}
        
        {/* Active indicator */}
        {isActive && !collapsed && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-accent-foreground animate-pulse shrink-0" />
        )}
      </button>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} className="text-[var(--text-sm)] font-[var(--font-weight-medium)]">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-all duration-300 h-screen',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className={cn('border-b border-sidebar-border flex items-center shrink-0', collapsed ? 'h-16 justify-center px-2' : 'h-16 px-4')}>
          {collapsed ? (
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
              }}
              className="text-sidebar-foreground"
            >
              AM
            </div>
          ) : (
            <div className="flex flex-col">
              <div
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '20px',
                  fontWeight: 700,
                }}
                className="text-sidebar-foreground"
              >
                AM
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                className="text-sidebar-foreground/70"
              >
                Technologies
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn('flex-1 overflow-y-auto space-y-1', collapsed ? 'p-2' : 'p-3')}>
          {navItems.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
        </nav>

        {/* Footer - Fixed at bottom */}
        <div className={cn('border-t border-sidebar-border space-y-1 bg-sidebar shrink-0', collapsed ? 'p-2' : 'p-3')}>
          {footerItems.map((item) => {
            const handleClick = () => {
              if (item.id === 'profile') {
                setActiveTab(item.id);
              } else if (item.id === 'logout' && onLogout) {
                onLogout();
              }
            };

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleClick}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] transition-all text-[var(--text-sm)] text-sidebar-foreground/70 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground cursor-pointer justify-center'
                      )}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8} className="text-[var(--text-sm)] font-[var(--font-weight-medium)]">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <button
                key={item.id}
                onClick={handleClick}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] transition-all text-[var(--text-sm)] text-sidebar-foreground/70 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground cursor-pointer'
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-[var(--font-weight-medium)]">{item.label}</span>
              </button>
            );
          })}

          {/* Collapse toggle */}
          <button
            onClick={onToggle}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius)] transition-all text-[var(--text-sm)] text-sidebar-foreground/50 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground cursor-pointer mt-2',
              collapsed ? 'justify-center' : ''
            )}
          >
            {collapsed ? (
              <ChevronsRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronsLeft className="w-5 h-5" />
                <span className="font-[var(--font-weight-medium)]">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
};
