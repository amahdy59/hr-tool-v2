import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@/i18n';
import { NotificationCenter } from '../NotificationCenter';

describe('Notification center', () => {
  beforeEach(() => localStorage.clear());
  it('provides named actions and keeps focus when a notification is dismissed', () => {
    render(<NotificationCenter />);
    fireEvent.click(screen.getByRole('button', { name: '2 unread notifications' }));
    expect(screen.getByRole('dialog', { name: 'Notifications' })).toBeTruthy();
    expect(screen.queryByText('+ Demo alert')).toBeNull();
    expect(screen.queryByText('PWA Offline Sync Ready')).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss New Leave Request' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'All (2)' }));
    expect(screen.queryByRole('button', { name: 'Dismiss New Leave Request' })).toBeNull();
  });

  it('announces filter state and keeps the panel usable after marking everything read', () => {
    render(<NotificationCenter />);
    fireEvent.click(screen.getByRole('button', { name: '2 unread notifications' }));
    fireEvent.click(screen.getByRole('button', { name: 'Unread (2)' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Mark all as read' }));
    const unread = screen.getByRole('button', { name: 'Unread (0)' });
    expect(unread.getAttribute('aria-pressed')).toBe('true');
    expect(document.activeElement).toBe(unread);
    expect(screen.getByText('No notifications to display')).toBeTruthy();
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
  it('restores dismissed items and read states only for the same account', () => {
    const first = render(<NotificationCenter accountId="first@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: '2 unread notifications' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss New Leave Request' }));
    fireEvent.click(screen.getByRole('button', { name: 'Mark all as read' }));
    first.unmount();
    const second = render(<NotificationCenter accountId="FIRST@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByRole('button', { name: 'Dismiss New Leave Request' })).toBeNull();
    second.unmount();
    render(<NotificationCenter accountId="different@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: '2 unread notifications' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
  it('keeps actions usable and explains when persistence is unavailable', () => {
    const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('unavailable'); });
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(<NotificationCenter accountId="blocked@example.com" />);
      fireEvent.click(screen.getByRole('button', { name: '2 unread notifications' }));
      expect(screen.getByText(/changes last for this session only/)).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: 'Mark all as read' }));
      expect(screen.getByRole('button', { name: 'Unread (0)' })).toBeTruthy();
    } finally { storage.mockRestore(); log.mockRestore(); }
  });
});
