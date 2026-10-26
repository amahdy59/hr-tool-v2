import React, { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@/i18n';
import { ScrollToTop } from '../ScrollToTop';

function ScrollablePage() {
  const ref = useRef<HTMLElement>(null);
  return <><main ref={ref} tabIndex={-1} data-testid="scroll-container" /><ScrollToTop scrollContainerRef={ref} /></>;
}

afterEach(() => vi.unstubAllGlobals());

describe('Scroll to top', () => {
  it('keeps the control out of keyboard navigation until the page is scrolled', () => {
    render(<ScrollablePage />);
    expect(screen.queryByRole('button', { name: 'Scroll to top' })).toBeNull();
    const container = screen.getByTestId('scroll-container');
    fireEvent.scroll(container, { target: { scrollTop: 400 } });
    expect(screen.getByRole('button', { name: 'Scroll to top' })).toBeTruthy();
    fireEvent.scroll(container, { target: { scrollTop: 0 } });
    expect(screen.queryByRole('button', { name: 'Scroll to top' })).toBeNull();
  });

  it.each([true, false])('respects reduced motion (%s) and returns focus to the content', (reducedMotion) => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: reducedMotion })));
    render(<ScrollablePage />);
    const container = screen.getByTestId('scroll-container');
    const scrollTo = vi.fn();
    container.scrollTo = scrollTo;
    fireEvent.scroll(container, { target: { scrollTop: 400 } });
    fireEvent.click(screen.getByRole('button', { name: 'Scroll to top' }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
    expect(document.activeElement).toBe(container);
  });
});
