import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';

describe('useTheme Hook (Dark/Light/System & Print Integrity)', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');

    originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('defaults to system theme when no stored theme is found', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('initializes from localStorage if valid theme exists', () => {
    localStorage.setItem('app-theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('updates theme to dark and reflects on documentElement', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(localStorage.getItem('app-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('updates theme to light and removes dark class', () => {
    localStorage.setItem('app-theme', 'dark');
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');
    expect(localStorage.getItem('app-theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('forces light mode during beforeprint event and restores on afterprint', () => {
    localStorage.setItem('app-theme', 'dark');
    renderHook(() => useTheme());

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Trigger beforeprint
    act(() => {
      window.dispatchEvent(new Event('beforeprint'));
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Trigger afterprint
    act(() => {
      window.dispatchEvent(new Event('afterprint'));
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
