import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KeyboardShortcutsPanel } from '../KeyboardShortcutsPanel';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultVal?: string) => defaultVal || key,
    i18n: { resolvedLanguage: 'en', language: 'en' },
  }),
}));

describe('KeyboardShortcutsPanel Component (A11y, Semantic Kbd, Categories)', () => {
  it('renders modal dialog when open is true', () => {
    render(<KeyboardShortcutsPanel open={true} onOpenChange={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('heading', { name: /keyboard shortcuts/i })).toBeTruthy();
  });

  it('renders categorized sections for Navigation, Actions, and Global shortcuts', () => {
    render(<KeyboardShortcutsPanel open={true} onOpenChange={vi.fn()} />);

    expect(screen.getByText(/sequential navigation/i)).toBeTruthy();
    expect(screen.getByText(/quick actions/i)).toBeTruthy();
    expect(screen.getByText(/global & system controls/i)).toBeTruthy();
  });

  it('renders semantic <kbd> tags for shortcut key sequences', () => {
    render(<KeyboardShortcutsPanel open={true} onOpenChange={vi.fn()} />);

    const kbds = document.body.querySelectorAll('kbd');
    expect(kbds.length).toBeGreaterThan(10);

    const kbdTexts = Array.from(kbds).map((k) => k.textContent?.trim());
    expect(kbdTexts).toContain('G');
    expect(kbdTexts).toContain('D');
    expect(kbdTexts).toContain('?');
    expect(kbdTexts).toContain('Esc');
  });

  it('does not render dialog content when open is false', () => {
    render(<KeyboardShortcutsPanel open={false} onOpenChange={vi.fn()} />);

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
