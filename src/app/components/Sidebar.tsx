import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
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
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'leaves', label: 'Leaves Management', icon: FileText },
  { id: 'missions', label: 'Missions Management', icon: Rocket },
  { id: 'roles', label: 'Roles Management', icon: ShieldCheck },
] as const satisfies ReadonlyArray<{ id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }>;

const footerItems = [
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'logout', label: 'Log out', icon: LogOut },
] as const;

const sidebarItemTextClass = 'text-[var(--text-sm)] font-[var(--font-weight-medium)]';

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, collapsed, onToggle, onLogout }) => {
  const NavButton = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = activeTab === item.id;
    const button = (
      <button
        onClick={() => setActiveTab(item.id)}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'relative flex min-w-[76px] flex-col items-center justify-center gap-1 rounded-[var(--radius)] px-2 py-2 text-center transition-all duration-300 ease-out cursor-pointer overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring sm:w-full sm:min-w-0 sm:flex-row sm:gap-3 sm:px-3 sm:py-2.5 sm:text-start',
          sidebarItemTextClass,
          collapsed ? 'sm:justify-center' : 'sm:justify-start',
          isActive
            ? '!bg-[#EDEFFB] !text-[#111827] shadow-sm scale-[0.98]'
            : 'text-sidebar-foreground hover:bg-[#EDEFFB] hover:text-[#102A56] hover:scale-[1.02] active:scale-[0.98]'
        )}
      >
        {/* Ripple effect on click */}
        <span className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-200" />
        
        <item.icon className={cn(
          "w-5 h-5 shrink-0 transition-transform duration-300 ease-out",
          isActive ? "!text-[#111827] scale-110" : "group-hover:scale-110 group-hover:text-[#102A56]"
        )} />
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
          className={cn(
            "max-w-[68px] overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-300 sm:max-w-none sm:text-start",
            isActive && "!text-[#111827]",
            collapsed && "sm:hidden"
          )}
        >
          {item.label}
        </span>
        
        {/* Active indicator */}
        {isActive && !collapsed && (
          <span className="hidden sm:block ms-auto w-1.5 h-1.5 rounded-full !bg-[#111827] animate-pulse shrink-0" />
        )}
      </button>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} className="hidden sm:block text-[var(--text-sm)] font-[var(--font-weight-medium)]">
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
          'fixed bottom-0 start-0 end-0 z-30 flex h-auto flex-row border-t border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 sm:relative sm:h-screen sm:flex-col sm:border-e sm:border-t-0',
          collapsed ? 'sm:w-[72px]' : 'sm:w-64'
        )}
      >
        {/* Logo */}
        <div className={cn('hidden border-b border-sidebar-border items-center shrink-0 sm:flex', collapsed ? 'h-16 justify-center px-2' : 'h-16 px-4')}>
          {collapsed ? (
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
              className="text-sidebar-foreground"
            >
              HR
            </div>
          ) : (
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
              className="text-sidebar-foreground"
            >
              HR Tool
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav aria-label="Main navigation" className={cn('flex flex-1 gap-1 overflow-x-auto p-2 sm:flex-col sm:overflow-y-auto sm:space-y-1', collapsed ? 'sm:p-2' : 'sm:p-3')}>
          <ul className="flex flex-1 gap-1 overflow-x-auto sm:flex-col sm:overflow-y-auto sm:space-y-1 w-full m-0 p-0 list-none">
            {navItems.map((item) => (
              <li key={item.id} className="sm:w-full">
                <NavButton item={item} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 gap-1 border-s border-sidebar-border p-2 sm:hidden">
          {footerItems.map((item) => {
            const handleClick = () => {
              if (item.id === 'profile') {
                setActiveTab(item.id);
              } else if (item.id === 'logout' && onLogout) {
                onLogout();
              }
            };

            return (
              <button
                key={item.id}
                type="button"
                onClick={handleClick}
                aria-label={item.label}
                className="flex min-w-[44px] min-h-[44px] cursor-pointer items-center justify-center rounded-[var(--radius)] px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              >
                <item.icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className={cn('hidden border-t border-sidebar-border space-y-1 bg-sidebar shrink-0 sm:block', collapsed ? 'p-2' : 'p-3')}>
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
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] transition-all text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                        sidebarItemTextClass
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
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] transition-all text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                  sidebarItemTextClass
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Collapse toggle */}
          <button
            onClick={onToggle}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius)] transition-all text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
              sidebarItemTextClass,
              collapsed ? 'justify-center' : ''
            )}
          >
            {collapsed ? (
              <ChevronsRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronsLeft className="w-5 h-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
};
