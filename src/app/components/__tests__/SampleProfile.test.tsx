import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@/i18n';
import { LinkedInImportModal } from '../profile/LinkedInImportModal';
vi.mock('sonner', () => ({ toast: { success: vi.fn() } }));
describe('sample profile preview', () => {
  it('does not collect a file or URL or imply a real LinkedIn connection', () => {
    const onImport = vi.fn();
    const { container } = render(<LinkedInImportModal open onOpenChange={vi.fn()} onImport={onImport} />);
    expect(screen.getByRole('dialog', { name: 'Sample profile' })).toBeTruthy();
    expect(screen.getByText(/PDF import are not available/)).toBeTruthy();
    expect(document.querySelector('input[type="file"]')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Preview sample' }));
    expect(onImport).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Use sample summary and skills' }));
    expect(onImport).toHaveBeenCalledWith({ about: expect.any(String), skills: expect.any(Array) });
    expect(Object.keys(onImport.mock.calls[0][0])).toEqual(['about', 'skills']);
  });
});
