import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../StatusBadge';

describe('StatusBadge', () => {
  it('renders children content correctly', () => {
    render(<StatusBadge variant="approved">Approved</StatusBadge>);
    expect(screen.getByText('Approved')).toBeDefined();
  });

  it('includes high-contrast dark mode classes for approved status', () => {
    const { container } = render(<StatusBadge variant="approved">Approved</StatusBadge>);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('dark:text-emerald-200');
    expect(badge?.className).toContain('dark:border-emerald-700');
  });

  it('includes high-contrast dark mode classes for pending status', () => {
    const { container } = render(<StatusBadge variant="pending">Pending</StatusBadge>);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('dark:text-amber-200');
    expect(badge?.className).toContain('dark:border-amber-700');
  });

  it('includes high-contrast dark mode classes for error/cancelled status', () => {
    const { container } = render(<StatusBadge variant="cancelled">Cancelled</StatusBadge>);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('dark:text-red-200');
    expect(badge?.className).toContain('dark:border-red-700');
  });
});
