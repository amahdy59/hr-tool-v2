import React from 'react';
import { User } from 'lucide-react';

interface HeaderProps {
  currentUser: {
    name: string;
    email: string;
    position: string;
    image: string;
  } | null;
}

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export const Header: React.FC<HeaderProps> = ({ currentUser }) => {
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
        <span
          className="hidden bg-muted px-2 py-0.5 rounded-[var(--radius-sm)] border border-border text-muted-foreground sm:inline-flex"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-normal)',
          }}
        >
          Beta 1.0
        </span>
      </div>

      <div className="hidden items-center gap-6 sm:flex">
        <div className="flex items-center gap-2.5">
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
