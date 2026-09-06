import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../EmptyState';
import { Users } from 'lucide-react';

describe('EmptyState Component (WCAG 2.2 AAA Guidance & Affordance)', () => {
  it('renders icon, title, and description text', () => {
    render(
      <EmptyState
        icon={Users}
        title="No Employees Found"
        description="Try adjusting your search criteria or add a new employee."
      />
    );

    expect(screen.getByRole('heading', { name: /no employees found/i })).toBeTruthy();
    expect(
      screen.getByText(/try adjusting your search criteria or add a new employee/i)
    ).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders call-to-action button when actionLabel and onAction are provided', () => {
    const onActionSpy = vi.fn();
    render(
      <EmptyState
        icon={Users}
        title="Empty Leave History"
        description="Submit your first leave request to get started."
        actionLabel="Request Leave"
        onAction={onActionSpy}
      />
    );

    const actionBtn = screen.getByRole('button', { name: /request leave/i });
    expect(actionBtn).toBeTruthy();

    fireEvent.click(actionBtn);
    expect(onActionSpy).toHaveBeenCalledTimes(1);
  });
});
