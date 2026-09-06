import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from '../ConfirmDialog';

describe('ConfirmDialog Component (WCAG 2.2 AAA Modal & Actions)', () => {
  it('renders modal with title, message, and action buttons when open is true', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Delete Employee Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep Record"
      />
    );

    expect(screen.getByRole('heading', { name: /delete employee record/i })).toBeTruthy();
    expect(
      screen.getByText(/are you sure you want to delete this record/i)
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: /delete/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /keep record/i })).toBeTruthy();
  });

  it('does not render dialog content when open is false', () => {
    render(
      <ConfirmDialog
        open={false}
        onOpenChange={vi.fn()}
        title="Hidden Dialog"
        message="Should not be visible"
      />
    );

    expect(screen.queryByText('Hidden Dialog')).toBeNull();
  });

  it('invokes onConfirm when confirm button is clicked', () => {
    const onConfirmSpy = vi.fn();
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Confirm Action"
        message="Please proceed"
        confirmLabel="Yes, Proceed"
        onConfirm={onConfirmSpy}
      />
    );

    const confirmBtn = screen.getByRole('button', { name: /yes, proceed/i });
    fireEvent.click(confirmBtn);

    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
  });

  it('invokes onCancel and onOpenChange when cancel button is clicked', () => {
    const onCancelSpy = vi.fn();
    const onOpenChangeSpy = vi.fn();

    render(
      <ConfirmDialog
        open={true}
        onOpenChange={onOpenChangeSpy}
        title="Cancel Action"
        message="Abort operation"
        cancelLabel="Discard"
        onCancel={onCancelSpy}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: /discard/i });
    fireEvent.click(cancelBtn);

    expect(onCancelSpy).toHaveBeenCalledTimes(1);
    expect(onOpenChangeSpy).toHaveBeenCalledWith(false);
  });
});
