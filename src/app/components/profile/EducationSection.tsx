import React, { useState, useEffect } from 'react';
import {
  Plus, Pencil, ChevronUp, ChevronDown, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '../ui/dialog';
import { toast } from 'sonner';
import { EducationData } from './Types';
import { FormField } from './FormField';

const labelClass = 'block text-start w-full text-[var(--text-base)] font-[var(--font-weight-medium)] text-foreground';
const inputClass = 'w-full h-[44px] px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-base)] text-start focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const iconButtonClass = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer';

interface EducationSectionProps {
  educations: EducationData[];
  searchQuery: string;
  onSave: (edu: EducationData) => void;
  onDelete: (id: string, name: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}

const ProfileCard: React.FC<{
  title: string;
  showAdd?: boolean;
  onAdd?: () => void;
  children: React.ReactNode;
}> = ({ title, showAdd = true, onAdd, children }) => {
  const headingId = `professional-profile-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <section aria-labelledby={headingId} className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)] space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span id={headingId} className="text-[var(--text-lg)] font-[var(--font-weight-bold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{title}</span>
        <div className="flex gap-1">
          {showAdd && onAdd && <button onClick={onAdd} className={iconButtonClass} aria-label={`Add ${title}`} title={`Add ${title}`}><Plus className="w-5 h-5" /></button>}
        </div>
      </div>
      {children}
    </section>
  );
};

const EducationItem: React.FC<{
  data: EducationData;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (dir: 'up' | 'down') => void;
}> = React.memo(({ data, isFirst, isLast, onEdit, onDelete, onMove }) => (
  <div className="relative group space-y-3 pb-6">
    <div className="flex items-center gap-3 relative z-10">
      <div className="w-10 h-10 rounded-md border border-border bg-card shadow-sm flex flex-shrink-0 items-center justify-center font-bold text-muted-foreground text-lg uppercase">
        {data.school.charAt(0)}
      </div>
      <h3 className="text-base font-bold text-foreground">{data.school}</h3>
    </div>

    <div className="relative ps-5 ms-4 pb-1">
      <div className="absolute start-0 top-[11px] bottom-0 w-px bg-border" />
      <div className="absolute -start-[5px] top-[6px] w-2.5 h-2.5 bg-muted-foreground rounded-full z-10" />

      <div className="space-y-2">
        <p className="text-base font-bold text-foreground pt-0.5">{data.degree}{data.fieldOfStudy && `, ${data.fieldOfStudy}`}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-border bg-card text-sm text-foreground whitespace-nowrap">
            {data.currentlyStudying ? `${data.startDate} - Present` : `${data.startDate} - ${data.endDate}`}
          </span>
          {data.grade && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-border bg-card text-sm text-foreground whitespace-nowrap">
              Grade: {data.grade}
            </span>
          )}
        </div>

        {data.activities && (
          <p className="text-sm text-muted-foreground pt-1 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            <strong>Activities & Societies:</strong> {data.activities}
          </p>
        )}
        {data.desc && (
          <p className="text-sm text-foreground/80 leading-relaxed pt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            {data.desc}
          </p>
        )}
      </div>
    </div>

    <div className="absolute top-0 ltr:right-0 rtl:left-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-card/80 backdrop-blur-sm p-1 rounded-md">
      {!isFirst && <button onClick={() => onMove('up')} className={iconButtonClass} aria-label={`Move ${data.school} education up`} title="Move up"><ChevronUp className="w-4 h-4" /></button>}
      {!isLast && <button onClick={() => onMove('down')} className={iconButtonClass} aria-label={`Move ${data.school} education down`} title="Move down"><ChevronDown className="w-4 h-4" /></button>}
      <button onClick={onEdit} className={iconButtonClass} aria-label={`Edit ${data.school} education`} title="Edit"><Pencil className="w-4 h-4" /></button>
      <button onClick={onDelete} className={cn(iconButtonClass, 'hover:bg-destructive/10 hover:text-destructive')} aria-label={`Delete ${data.school} education`} title="Delete"><Trash2 className="w-4 h-4" /></button>
    </div>
  </div>
));
EducationItem.displayName = 'EducationItem';

export const EducationSection: React.FC<EducationSectionProps> = ({
  educations,
  searchQuery,
  onSave,
  onDelete,
  onMove,
}) => {
  const [editEduOpen, setEditEduOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<EducationData | null>(null);

  const query = searchQuery.toLowerCase().trim();
  const filtered = educations.filter(edu =>
    !query ||
    edu.school.toLowerCase().includes(query) ||
    edu.degree.toLowerCase().includes(query) ||
    (edu.fieldOfStudy || '').toLowerCase().includes(query) ||
    (edu.desc || '').toLowerCase().includes(query)
  );

  const handleEdit = (edu: EducationData) => {
    setSelectedEducation(edu);
    setEditEduOpen(true);
  };

  const handleAdd = () => {
    setSelectedEducation({
      id: Math.random().toString(36).substring(2, 9),
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      currentlyStudying: false,
      grade: '',
      activities: '',
      desc: '',
      orderIndex: educations.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setEditEduOpen(true);
  };

  return (
    <>
      <ProfileCard title="Education" onAdd={handleAdd}>
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
            {query ? 'No education records match your search query.' : 'No education records added yet.'}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.sort((a, b) => a.orderIndex - b.orderIndex).map((edu, index) => (
              <EducationItem
                key={edu.id}
                data={edu}
                isFirst={index === 0}
                isLast={index === educations.length - 1}
                onEdit={() => handleEdit(edu)}
                onDelete={() => onDelete(edu.id, edu.school)}
                onMove={(dir) => onMove(edu.id, dir)}
              />
            ))}
          </div>
        )}
      </ProfileCard>

      {selectedEducation && (
        <EditEducationModal
          key={selectedEducation.id}
          open={editEduOpen}
          onOpenChange={setEditEduOpen}
          data={selectedEducation}
          onSave={onSave}
        />
      )}
    </>
  );
};

const EditEducationModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: EducationData;
  onSave: (v: EducationData) => void;
}> = ({ open, onOpenChange, data, onSave }) => {
  const [school, setSchool] = useState(data.school);
  const [degree, setDegree] = useState(data.degree);
  const [fieldOfStudy, setFieldOfStudy] = useState(data.fieldOfStudy);
  const [startDate, setStartDate] = useState(data.startDate);
  const [endDate, setEndDate] = useState(data.endDate);
  const [currentlyStudying, setCurrentlyStudying] = useState(data.currentlyStudying);
  const [grade, setGrade] = useState(data.grade);
  const [activities, setActivities] = useState(data.activities || '');
  const [desc, setDesc] = useState(data.desc);

  useEffect(() => {
    if (!open) return;
    setSchool(data.school);
    setDegree(data.degree);
    setFieldOfStudy(data.fieldOfStudy);
    setStartDate(data.startDate);
    setEndDate(data.endDate);
    setCurrentlyStudying(data.currentlyStudying);
    setGrade(data.grade);
    setActivities(data.activities || '');
    setDesc(data.desc);
  }, [data, open]);

  const handleSave = () => {
    if (!school || !degree || !startDate) {
      toast.error('School, degree, and start date are required');
      return;
    }
    onSave({
      ...data,
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate: currentlyStudying ? '' : endDate,
      currentlyStudying,
      grade,
      activities,
      desc,
      updatedAt: new Date().toISOString()
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {data.school ? 'Edit' : 'Add'} Education
          </DialogTitle>
          <DialogDescription className="sr-only">Edit education details</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><FormField label="School *" value={school} onChange={setSchool} /></div>
          <FormField label="Degree *" value={degree} onChange={setDegree} placeholder="e.g., Bachelor's" />
          <FormField label="Field of Study" value={fieldOfStudy} onChange={setFieldOfStudy} placeholder="e.g., Computer Science" />
          <FormField label="Start Date *" value={startDate} onChange={setStartDate} placeholder="e.g., Sep 2016" />
          <FormField label="End Date" value={endDate} onChange={setEndDate} placeholder="e.g., Jun 2020" disabled={currentlyStudying} />
          <FormField label="Grade" value={grade} onChange={setGrade} placeholder="e.g., Excellent, 3.8 GPA" />
          <div className="md:col-span-2 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input id="currently-studying-checkbox" type="checkbox" checked={currentlyStudying} onChange={e => setCurrentlyStudying(e.target.checked)} className="w-4.5 h-4.5 rounded border-border text-chart-3 focus:ring-2 focus:ring-ring/50" />
              <span className="text-[var(--text-base)] text-foreground font-[var(--font-weight-medium)]" style={{ fontFamily: "'Inter', sans-serif" }}>I currently study here</span>
            </label>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label htmlFor="education-activities-input" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Activities and Societies</label>
            <input id="education-activities-input" type="text" value={activities} onChange={e => setActivities(e.target.value)} className={inputClass} placeholder="e.g., Debate Club, Design Committee" style={{ fontFamily: "'Inter', sans-serif" }} />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Description (Optional)</label>
            <textarea dir="auto" value={desc} onChange={e => setDesc(e.target.value)} rows={3} className={cn(inputClass, 'h-auto py-2')} style={{ fontFamily: "'Inter', sans-serif" }} />
          </div>
        </div>
        <DialogFooter className="mt-6 flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
