import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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
  it('provides every section in the mobile drawer and closes after navigation', () => {
    const setActiveTab = vi.fn();
    render(
      <Header
        currentUser={mockUser}
        accessibility={createMockAccessibility()}
        activeTab="leaves"
        setActiveTab={setActiveTab}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    const dialog = screen.getByRole('dialog');
    const navigation = within(dialog).getByRole('navigation', { name: 'Navigation menu' });
    expect(within(navigation).getAllByRole('button')).toHaveLength(7);
    expect(within(navigation).getByRole('button', { name: 'Leaves Management' }).getAttribute('aria-current')).toBe('page');

    fireEvent.click(within(navigation).getByRole('button', { name: 'Employees' }));
    expect(setActiveTab).toHaveBeenCalledWith('employees');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

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
    expect(screen.getByRole('group', { name: /application toolbar/i })).toBeTruthy();
    expect(screen.getByText('Leaves Management')).toBeTruthy();
    expect(screen.queryByText('HR Tool')).toBeNull();
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

    const searchButton = screen.getByRole('button', { name: /find a section/i });
    fireEvent.click(searchButton);

    expect(onOpenCommandPaletteSpy).toHaveBeenCalledTimes(1);
  });

  it('keeps theme settings inside one preferences dialog', () => {
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

    expect(screen.queryByRole('button', { name: /switch to dark theme/i })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Preferences and accessibility' }));
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    fireEvent.click(screen.getByRole('radio', { name: 'Dark' }));

    expect(setThemeSpy).toHaveBeenCalledWith('dark');
  });

  it('keeps language settings inside preferences with readable labels', () => {
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

    expect(screen.queryByRole('button', { name: /toggle language/i })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Preferences and accessibility' }));
    fireEvent.click(screen.getByRole('radio', { name: 'العربية' }));

    expect(setLanguageSpy).toHaveBeenCalledWith('ar');
  });

  it('keeps account details in the account menu and removes static online status', () => {
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
    expect(userMenuTrigger.title).toBe('Ahmed Mahdy');
    expect(screen.queryByText('Online')).toBeNull();
    expect(screen.queryByText('HR Director')).toBeNull();
    fireEvent.keyDown(userMenuTrigger, { key: 'ArrowDown' });
    expect(screen.getByText('Ahmed Mahdy')).toBeTruthy();
  });

  it('offers keyboard shortcuts from the account menu', () => {
    const onOpenShortcuts = vi.fn();
    render(<Header currentUser={mockUser} accessibility={createMockAccessibility()} activeTab="dashboard" setActiveTab={vi.fn()} onOpenShortcuts={onOpenShortcuts} />);
    expect(screen.queryByRole('button', { name: /keyboard shortcuts/i })).toBeNull();
    fireEvent.keyDown(screen.getByRole('button', { name: 'User account menu' }), { key: 'ArrowDown' });
    fireEvent.click(screen.getByRole('menuitem', { name: 'Keyboard Shortcuts' }));
    expect(onOpenShortcuts).toHaveBeenCalledOnce();
  });
});
