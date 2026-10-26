import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import '@/i18n';
import { RequestStatusChart, RequestProgress } from '../RequestVisuals';
describe('request summaries', () => {
  it('provides exact text counts alongside the chart including normalized server statuses', () => {
    render(<RequestStatusChart items={[{ status: 'Approved' }, { status: 'approved' }, { status: 'Pending' }, { status: 'Rejected' }]} />);
    const figure = screen.getByRole('figure', { name: /Request overview/ });
    expect(within(figure).getByText('Total: 4')).toBeTruthy();
    const values = [...figure.querySelectorAll('dd')].map(value => value.textContent);
    expect(values).toEqual(['2', '1', '1', '0']);
    expect(figure.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
  it('identifies the active review stage and handles an empty dataset', () => {
    render(<><RequestProgress status="pending" /><RequestStatusChart items={[]} /></>);
    expect(screen.getByText('Under review').closest('li')?.getAttribute('aria-current')).toBe('step');
    expect(screen.getByText('No requests yet. Your request summary will appear here.')).toBeTruthy();
  });
});
