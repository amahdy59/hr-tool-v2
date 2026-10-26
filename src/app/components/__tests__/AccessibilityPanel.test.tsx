import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@/i18n';
import { AccessibilityPanel, type AccessibilitySettings } from '../AccessibilityPanel';

function Preferences({ onChange = vi.fn() }: { onChange?: (value: boolean) => void }) {
  const [highContrast, setHighContrast] = React.useState(false);
  const [theme, setTheme] = React.useState<AccessibilitySettings['theme']>('light');
  const settings: AccessibilitySettings = {
    highContrast, setHighContrast: (value) => { setHighContrast(value); onChange(value); },
    theme, setTheme, language: 'en', setLanguage: vi.fn(),
    largeTargets: false, setLargeTargets: vi.fn(), largeText: false, setLargeText: vi.fn(),
    dyslexic: false, setDyslexic: vi.fn(), focusHeavy: false, setFocusHeavy: vi.fn(),
  };
  return <AccessibilityPanel settings={settings} />;
}

describe('Preferences and accessibility', () => {
  it('opens one dialog and stays open while changing preferences', () => {
    const onChange = vi.fn();
    render(<Preferences onChange={onChange} />);
    expect(screen.getAllByRole('button', { name: 'Preferences and accessibility' })).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Preferences and accessibility' }));
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Preferences and accessibility' }));
    fireEvent.click(screen.getByRole('checkbox', { name: /^High Contrast/ }));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('checkbox', { name: /^High Contrast/ }).getAttribute('aria-checked')).toBe('true');
    fireEvent.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(screen.getByRole('radio', { name: 'Dark' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Reset accessibility options' }));
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('closes and reopens without mounting competing panels', () => {
    render(<Preferences />);
    for (let index = 0; index < 3; index++) {
      fireEvent.click(screen.getByRole('button', { name: 'Preferences and accessibility' }));
      expect(screen.getAllByRole('dialog')).toHaveLength(1);
      fireEvent.click(screen.getByRole('button', { name: index === 2 ? 'Done' : 'Close' }));
      expect(screen.queryByRole('dialog')).toBeNull();
    }
  });
});
