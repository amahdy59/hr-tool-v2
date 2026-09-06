import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../Pagination';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (typeof options === 'string') return options;
      if (options && typeof options === 'object') {
        let str = options.defaultValue || key;
        for (const [k, v] of Object.entries(options)) {
          str = str.replace(`{{${k}}}`, String(v));
        }
        return str;
      }
      return key;
    },
    i18n: { resolvedLanguage: 'en', language: 'en' },
  }),
}));

describe('Pagination Component (Keyboard, Nav & A11y)', () => {
  it('renders total pages and highlights current page', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={vi.fn()}
      />
    );

    const page2Button = screen.getByRole('button', { name: /page 2/i });
    expect(page2Button.getAttribute('aria-current')).toBe('page');

    expect(screen.getByRole('button', { name: /page 1/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /page 3/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /page 4/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /page 5/i })).toBeTruthy();
  });

  it('disables previous button on the first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={vi.fn()}
      />
    );

    const prevBtn = screen.getByRole('button', { name: /previous page/i });
    expect(prevBtn.hasAttribute('disabled') || prevBtn.getAttribute('aria-disabled') === 'true').toBe(true);
  });

  it('disables next button on the last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={vi.fn()}
      />
    );

    const nextBtn = screen.getByRole('button', { name: /next page/i });
    expect(nextBtn.hasAttribute('disabled') || nextBtn.getAttribute('aria-disabled') === 'true').toBe(true);
  });

  it('calls onPageChange with selected page index when clicked', () => {
    const onPageChangeSpy = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={onPageChangeSpy}
      />
    );

    const page4Button = screen.getByRole('button', { name: /page 4/i });
    fireEvent.click(page4Button);

    expect(onPageChangeSpy).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with next page when next button is clicked', () => {
    const onPageChangeSpy = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={onPageChangeSpy}
      />
    );

    const nextBtn = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextBtn);

    expect(onPageChangeSpy).toHaveBeenCalledWith(3);
  });
});
