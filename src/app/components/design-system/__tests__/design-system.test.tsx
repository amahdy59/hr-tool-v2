import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@/i18n';
import { StatCard } from '../StatCard';
import { FilterToolbar } from '../FilterToolbar';
import { ChartCard } from '../ChartCard';
import { DataTable, ColumnDef } from '../DataTable';
import { Users } from 'lucide-react';

describe('Design System Primitives', () => {
  describe('StatCard', () => {
    it('renders title, value, icon, and trend badge', () => {
      render(
        <StatCard
          title="Total Employees"
          value={128}
          icon={<Users className="size-5" />}
          subtitle="Active team members"
          badge={{ text: '+12% vs last month', variant: 'positive' }}
        />
      );

      expect(screen.getByText('Total Employees')).toBeTruthy();
      expect(screen.getByText('128')).toBeTruthy();
      expect(screen.getByText('Active team members')).toBeTruthy();
      expect(screen.getByText('+12% vs last month')).toBeTruthy();
    });
  });

  describe('FilterToolbar', () => {
    it('renders search input, filter count, and triggers callbacks', () => {
      const handleSearchChange = vi.fn();
      const handleFilterClick = vi.fn();

      render(
        <FilterToolbar
          searchQuery="engineer"
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search staff..."
          activeFilterCount={3}
          onFilterClick={handleFilterClick}
          filterButtonLabel="Filters"
        />
      );

      const input = screen.getByPlaceholderText('Search staff...') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.value).toBe('engineer');
      expect(screen.getByText('3')).toBeTruthy();

      fireEvent.change(input, { target: { value: 'manager' } });
      expect(handleSearchChange).toHaveBeenCalledWith('manager');

      const filterBtn = screen.getByRole('button', { name: /Filters \(3 active\)/i });
      fireEvent.click(filterBtn);
      expect(handleFilterClick).toHaveBeenCalled();

      const clearBtn = screen.getByRole('button', { name: /Clear search/i });
      fireEvent.click(clearBtn);
      expect(handleSearchChange).toHaveBeenCalledWith('');
      expect(document.activeElement).toBe(input);
    });
  });

  describe('ChartCard', () => {
    it('renders title, subtitle, badge, and children content', () => {
      render(
        <ChartCard
          title="Attendance Breakdown"
          subtitle="Hours recorded by category"
          badge={<span data-testid="chart-badge">Active</span>}
        >
          <div data-testid="chart-dummy">Chart Content</div>
        </ChartCard>
      );

      expect(screen.getByText('Attendance Breakdown')).toBeTruthy();
      expect(screen.getByText('Hours recorded by category')).toBeTruthy();
      expect(screen.getByTestId('chart-badge')).toBeTruthy();
      expect(screen.getByTestId('chart-dummy')).toBeTruthy();
    });
  });

  describe('DataTable', () => {
    interface TestItem {
      id: string;
      name: string;
      role: string;
    }

    const columns: ColumnDef<TestItem>[] = [
      { key: 'name', header: 'Name', isRowHeader: true, render: (row) => row.name },
      { key: 'role', header: 'Role', render: (row) => row.role },
    ];

    it('renders table headers and rows accurately with accessible row headers', () => {
      const data: TestItem[] = [
        { id: '1', name: 'Sara Miller', role: 'Staff Engineer' },
        { id: '2', name: 'Omar Tarek', role: 'Product Designer' },
      ];

      render(
        <DataTable
          data={data}
          columns={columns}
          keyExtractor={(item) => item.id}
          caption="Team directory"
        />
      );

      expect(screen.getByText('Name')).toBeTruthy();
      expect(screen.getByText('Role')).toBeTruthy();
      expect(screen.getByText('Sara Miller')).toBeTruthy();
      expect(screen.getByText('Omar Tarek')).toBeTruthy();

      // Verify row header scope
      const rowHeader = screen.getByRole('rowheader', { name: 'Sara Miller' });
      expect(rowHeader).toBeTruthy();
    });

    it('renders selection banner and highlights selected rows', () => {
      const data: TestItem[] = [
        { id: '1', name: 'Sara Miller', role: 'Staff Engineer' },
        { id: '2', name: 'Omar Tarek', role: 'Product Designer' },
      ];

      const handleClear = vi.fn();

      render(
        <DataTable
          data={data}
          columns={columns}
          keyExtractor={(item) => item.id}
          selectedRowKeys={['1']}
          selectionBanner={{
            count: 1,
            total: 2,
            onClear: handleClear,
          }}
        />
      );

      expect(screen.getByText('1 of 2 selected')).toBeTruthy();
      const clearBtn = screen.getByRole('button', { name: /clear/i });
      fireEvent.click(clearBtn);
      expect(handleClear).toHaveBeenCalled();
    });

    it('renders empty state when data array is empty', () => {
      render(
        <DataTable
          data={[]}
          columns={columns}
          keyExtractor={(item) => item.id}
          emptyTitle="No staff found"
          emptyDescription="Try adjusting your search criteria"
        />
      );

      expect(screen.getByText('No staff found')).toBeTruthy();
      expect(screen.getByText('Try adjusting your search criteria')).toBeTruthy();
    });

    it('keeps nested row actions independent from opening the row', () => {
      const onRowClick = vi.fn();
      const onAction = vi.fn();
      render(
        <DataTable
          data={[{ id: '1', name: 'Sara Miller', role: 'Staff Engineer' }]}
          columns={[...columns, { key: 'actions', header: 'Actions', render: () => <button onClick={onAction}>Edit employee</button> }]}
          keyExtractor={(item) => item.id}
          onRowClick={onRowClick}
        />
      );

      const action = screen.getByRole('button', { name: 'Edit employee' });
      fireEvent.keyDown(action, { key: 'Enter' });
      fireEvent.keyDown(action, { key: ' ' });
      fireEvent.click(action);
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(onRowClick).not.toHaveBeenCalled();

      const row = screen.getByRole('rowheader', { name: 'Sara Miller' }).closest('tr')!;
      fireEvent.keyDown(row, { key: 'Enter' });
      fireEvent.keyDown(row, { key: ' ' });
      fireEvent.click(screen.getByText('Sara Miller'));
      expect(onRowClick).toHaveBeenCalledTimes(3);
    });
  });
});
