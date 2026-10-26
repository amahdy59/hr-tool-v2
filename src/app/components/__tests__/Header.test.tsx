import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@/i18n';
import { Header } from '../Header';
import type { AccessibilitySettings } from '../AccessibilityPanel';

const createMockAccessibility = (overrides?: Partial<AccessibilitySettings>): AccessibilitySettings => ({
  highContrast: false,
  setHighContrast: vi.fn(),
  largeTargets: false,
  setLargeTargets: vi.fn(),
  largeText: false,
  setLargeText: vi.fn(),
  dyslexic: false,
  setDyslexic: vi.fn(),
  focusHeavy: false,
  setFocusHeavy: vi.fn(),
  theme: 'light',
  setTheme: vi.fn(),
  language: 'en',
  setLanguage: vi.fn(),
  ...overrides,
});

const mockUser = {
  name: 'Ahmed Mahdy',
  email: 'ahmed.mahdy@advansys-is.com',
  position: 'HR Director',
  image: '',
};

describe('Header Component (State of the Art Toolbar & A11y)', () => {
  it('renders application toolbar banner with active section breadcrumb', () => {
    const accessibility = createMockAccessibility();
    render(
      <Header
        currentUser={mockUser}
        accessibility={accessibility}
        activeTab="leaves"
        setActiveTab={vi.fn()}
      />
    );

    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('toolbar', { name: /application toolbar/i })).toBeTruthy();
    expect(screen.getAllByText('HR Tool').length).toBeGreaterThan(0);
  });

  it('triggers command palette when search bar is clicked', () => {
    const accessibility = createMockAccessibility();
    const onOpenCommandPaletteSpy = vi.fn();

    render(
      <Header
        currentUser={mockUser}
        accessibility={accessibility}
        activeTab="dashboard"
        setActiveTab={vi.fn()}
        onOpenCommandPalette={onOpenCommandPaletteSpy}
      />
    );

    const searchButton = screen.getByRole('button', { name: /search or command palette/i });
    fireEvent.click(searchButton);

    expect(onOpenCommandPaletteSpy).toHaveBeenCalledTimes(1);
  });

  it('toggles theme when quick theme button is clicked', () => {
    const setThemeSpy = vi.fn();
    const accessibility = createMockAccessibility({
      theme: 'light',
      setTheme: setThemeSpy,
    });

    render(
      <Header
        currentUser={mockUser}
        accessibility={accessibility}
        activeTab="dashboard"
        setActiveTab={vi.fn()}
      />
    );

    const themeButton = screen.getByRole('button', { name: /switch to dark theme/i });
    fireEvent.click(themeButton);

    expect(setThemeSpy).toHaveBeenCalledWith('dark');
  });

  it('toggles language when quick language button is clicked', () => {
    const setLanguageSpy = vi.fn();
    const accessibility = createMockAccessibility({
      language: 'en',
      setLanguage: setLanguageSpy,
    });

    render(
      <Header
        currentUser={mockUser}
        accessibility={accessibility}
        activeTab="dashboard"
        setActiveTab={vi.fn()}
      />
    );

    const langButton = screen.getByRole('button', { name: /toggle language/i });
    fireEvent.click(langButton);

    expect(setLanguageSpy).toHaveBeenCalledWith('ar');
  });

  it('renders user menu trigger with user name and online indicator', () => {
    const accessibility = createMockAccessibility();

    render(
      <Header
        currentUser={mockUser}
        accessibility={accessibility}
        activeTab="dashboard"
        setActiveTab={vi.fn()}
      />
    );

    const userMenuTrigger = screen.getByRole('button', { name: /user account menu/i });
    expect(userMenuTrigger).toBeTruthy();
    expect(screen.getAllByText('Ahmed Mahdy').length).toBeGreaterThan(0);
  });
});
