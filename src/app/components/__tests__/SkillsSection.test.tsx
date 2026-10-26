import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillsSection } from '../profile/SkillsSection';
import { SkillData } from '../profile/Types';

const mockSkills: SkillData[] = [
  { id: '1', name: 'Interaction Design', category: 'Core UX & Design', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
  { id: '2', name: 'Figma', category: 'Core UX & Design', level: 'Expert', createdAt: '2023-01-01T00:00:00Z' },
  { id: '3', name: 'Python', category: 'Data Analysis & Visualization', level: 'Intermediate', createdAt: '2023-01-01T00:00:00Z' },
  { id: '4', name: 'Excel Basics', category: 'Data Analysis & Visualization', level: 'Beginner', createdAt: '2023-01-01T00:00:00Z' },
];

describe('SkillsSection & SkillBadge Pills', () => {
  it('renders skill pills with correct text and proficiency level indicators', () => {
    const onSave = vi.fn();
    const onDelete = vi.fn();

    render(
      <SkillsSection
        skills={mockSkills}
        searchQuery=""
        onSave={onSave}
        onDelete={onDelete}
      />
    );

    // Verify pills are rendered
    expect(screen.getByText('Interaction Design')).toBeDefined();
    expect(screen.getByText('Figma')).toBeDefined();
    expect(screen.getByText('Python')).toBeDefined();
    expect(screen.getByText('Excel Basics')).toBeDefined();

    // Verify categories are rendered
    expect(screen.getByText('Core UX & Design')).toBeDefined();
    expect(screen.getByText('Data Analysis & Visualization')).toBeDefined();

    // Verify level section labels
    expect(screen.getByText('Advanced')).toBeDefined();
    expect(screen.getByText('Expert')).toBeDefined();
    expect(screen.getByText('Intermediate')).toBeDefined();
    expect(screen.getByText('Beginner')).toBeDefined();
  });

  it('triggers delete callback when remove button on pill is clicked', () => {
    const onSave = vi.fn();
    const onDelete = vi.fn();

    render(
      <SkillsSection
        skills={mockSkills}
        searchQuery=""
        onSave={onSave}
        onDelete={onDelete}
      />
    );

    const deleteBtn = screen.getByLabelText('Delete Interaction Design skill');
    fireEvent.click(deleteBtn);

    expect(onDelete).toHaveBeenCalledWith('1', 'Interaction Design');
  });

  it('filters skills according to search query', () => {
    const onSave = vi.fn();
    const onDelete = vi.fn();

    const { rerender } = render(
      <SkillsSection
        skills={mockSkills}
        searchQuery="Figma"
        onSave={onSave}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('Figma')).toBeDefined();
    expect(screen.queryByText('Interaction Design')).toBeNull();

    // Re-render with no matching query
    rerender(
      <SkillsSection
        skills={mockSkills}
        searchQuery="NonExistentSkillXYZ"
        onSave={onSave}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('No skills match your search query.')).toBeDefined();
  });
});
