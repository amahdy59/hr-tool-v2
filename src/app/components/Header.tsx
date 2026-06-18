import React from 'react';
import { User, Search, Keyboard } from 'lucide-react';
import { AccessibilityPanel, AccessibilitySettings } from './AccessibilityPanel';

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
}

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export const Header: React.FC<HeaderProps> = ({ currentUser, accessibility, onOpenCommandPalette, onOpenShortcuts }) => {
  return (
    <header className="min-h-14 border-b border-border bg-card px-4 py-3 flex items-center justify-between sticky top-0 z-10 sm:h-16 sm:px-6 sm:py-0">
      <div className="flex items-center gap-3">
        <h1
          className="text-primary"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(var(--text-base), 4vw, var(--text-lg))',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 1.2,
          }}
        >
          Human Resources Tool
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
          onClick={onOpenCommandPalette}
          className="flex sm:hidden w-9 h-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenShortcuts}
          className="flex w-9 h-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
