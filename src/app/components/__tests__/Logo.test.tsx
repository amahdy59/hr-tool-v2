import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Logo, LogoIcon } from '../Logo';

describe('Logo Component (Modern Brand Identity & A11y)', () => {
  it('renders LogoIcon with accessible role and title', () => {
    const { container } = render(<LogoIcon ariaLabel="HR Brand Insignia" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBe('HR Brand Insignia');
    expect(container.querySelector('title')?.textContent).toBe('HR Brand Insignia');
  });

  it('renders icon-only variant correctly', () => {
    const { container } = render(<Logo variant="icon" ariaLabel="HR Tool Mark" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBe('HR Tool Mark');
    expect(screen.queryByText(/workforce suite/i)).toBeNull();
  });

  it('renders compact variant with mark and HR initials', () => {
    render(<Logo variant="compact" ariaLabel="HR Compact" />);
    expect(screen.getByText('HR')).toBeTruthy();
  });

  it('renders full brand lockup with wordmark and subtitle', () => {
    render(<Logo variant="full" ariaLabel="HR Tool Logo" showSubtitle={true} />);
    expect(screen.getAllByText(/Tool/).length).toBeGreaterThan(0);
    expect(screen.queryByText('PRO')).toBeNull();
    expect(screen.getByText(/workforce suite/i)).toBeTruthy();
  });
});
