import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@/i18n';
import { NotificationCenter } from '../NotificationCenter';

describe('Notification center', () => {
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
});
