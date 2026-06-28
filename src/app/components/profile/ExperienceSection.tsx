import React, { useState, useEffect } from 'react';
import {
  Plus, Pencil, ChevronUp, ChevronDown, Trash2, Briefcase, Calendar, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '../ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { ExperienceData } from './Types';
import { FormField } from './FormField';

const labelClass = 'block text-start w-full text-[var(--text-base)] font-[var(--font-weight-medium)] text-foreground';
const inputClass = 'w-full h-[44px] px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-base)] text-start focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const iconButtonClass = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer';

interface ExperienceSectionProps {
  experiences: ExperienceData[];
  searchQuery: string;
  onSave: (exp: ExperienceData) => void;
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

const ExperienceItem: React.FC<{
  data: ExperienceData;
  isFirst: boolean;
  isLast: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (dir: 'up' | 'down') => void;
}> = React.memo(({ data, isFirst, isLast, expanded, onToggleExpand, onEdit, onDelete, onMove }) => {
  const descPreview = data.desc.length > 150 ? data.desc.substring(0, 150) + '...' : data.desc;
  const bullets = expanded
    ? data.desc.split('\n').filter(b => b.trim() !== '')
    : [descPreview];

  return (
    <div className="relative group space-y-3 pb-6">
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-md border border-border bg-card shadow-sm flex flex-shrink-0 items-center justify-center font-bold text-muted-foreground text-lg uppercase">
          {data.company.charAt(0)}
        </div>
        <h3 className="text-base font-bold text-foreground">{data.company}</h3>
      </div>

      <div className="relative ps-5 ms-4 pb-1">
        <div className="absolute start-0 top-[11px] bottom-0 w-px bg-border" />
        <div className="absolute -start-[5px] top-[6px] w-2.5 h-2.5 bg-muted-foreground rounded-full z-10" />

        <div className="space-y-2">
          <p className="text-base font-bold text-foreground pt-0.5">{data.role}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-border bg-card text-sm text-foreground whitespace-nowrap">
              {data.currentlyWorking ? `${data.startDate} - Present` : `${data.startDate} - ${data.endDate}`}
            </span>
            {data.location && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-border bg-card text-sm text-foreground whitespace-nowrap">
                {data.location} {data.locationType ? `(${data.locationType})` : ''}
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-border bg-card text-sm text-foreground whitespace-nowrap">
              {data.employmentType}
            </span>
          </div>

          {data.desc && (
            <ul className="space-y-2 pt-2 list-disc ps-4 text-base text-foreground/90 marker:text-primary">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="leading-relaxed">
                  {bullet.replace(/^[-•]\s*/, '')}
                </li>
              ))}
            </ul>
          )}

          {data.desc.length > 150 && (
            <button
              onClick={onToggleExpand}
              className="text-sm text-primary hover:underline mt-2 font-medium cursor-pointer"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}

          {data.skillsUsed && data.skillsUsed.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-muted-foreground font-[var(--font-weight-medium)] mr-1">Skills:</span>
              {data.skillsUsed.map((sk, i) => (
                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary/60 text-secondary-foreground text-xs font-medium">
                  {sk}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-0 ltr:right-0 rtl:left-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-card/80 backdrop-blur-sm p-1 rounded-md">
        {!isFirst && <button onClick={() => onMove('up')} className={iconButtonClass} aria-label={`Move ${data.company} experience up`} title="Move up"><ChevronUp className="w-4 h-4" /></button>}
        {!isLast && <button onClick={() => onMove('down')} className={iconButtonClass} aria-label={`Move ${data.company} experience down`} title="Move down"><ChevronDown className="w-4 h-4" /></button>}
        <button onClick={onEdit} className={iconButtonClass} aria-label={`Edit ${data.company} experience`} title="Edit"><Pencil className="w-4 h-4" /></button>
        <button onClick={onDelete} className={cn(iconButtonClass, 'hover:bg-destructive/10 hover:text-destructive')} aria-label={`Delete ${data.company} experience`} title="Delete"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
});
ExperienceItem.displayName = 'ExperienceItem';

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  searchQuery,
  onSave,
  onDelete,
  onMove,
}) => {
  const [expandedExperiences, setExpandedExperiences] = useState<Set<string>>(new Set());
  const [editExpOpen, setEditExpOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceData | null>(null);

  const query = searchQuery.toLowerCase().trim();
  const filtered = experiences.filter(exp =>
    !query ||
    exp.company.toLowerCase().includes(query) ||
    exp.role.toLowerCase().includes(query) ||
    (exp.desc || '').toLowerCase().includes(query) ||
    (exp.skillsUsed || []).some(sk => sk.toLowerCase().includes(query))
  );

  const handleEdit = (exp: ExperienceData) => {
    setSelectedExperience(exp);
    setEditExpOpen(true);
  };

  const handleAdd = () => {
    setSelectedExperience({
      id: Math.random().toString(36).substring(2, 9),
      company: '',
      role: '',
      employmentType: 'Full-time',
      location: '',
      locationType: 'On-site',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      desc: '',
      skillsUsed: [],
      orderIndex: experiences.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setEditExpOpen(true);
  };

  return (
    <>
      <ProfileCard title="Work Experience" onAdd={handleAdd}>
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
            {query ? 'No experiences match your search query.' : 'No work experience added yet.'}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.sort((a, b) => a.orderIndex - b.orderIndex).map((exp, index) => (
              <ExperienceItem
                key={exp.id}
                data={exp}
                isFirst={index === 0}
                isLast={index === experiences.length - 1}
                expanded={expandedExperiences.has(exp.id)}
                onToggleExpand={() => {
                  const newExpanded = new Set(expandedExperiences);
                  if (newExpanded.has(exp.id)) {
                    newExpanded.delete(exp.id);
                  } else {
                    newExpanded.add(exp.id);
                  }
                  setExpandedExperiences(newExpanded);
                }}
                onEdit={() => handleEdit(exp)}
                onDelete={() => onDelete(exp.id, exp.company)}
                onMove={(dir) => onMove(exp.id, dir)}
              />
            ))}
          </div>
        )}
      </ProfileCard>

      {selectedExperience && (
        <EditExperienceModal
          key={selectedExperience.id}
          open={editExpOpen}
          onOpenChange={setEditExpOpen}
          data={selectedExperience}
          onSave={onSave}
        />
      )}
    </>
  );
};

const EditExperienceModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: ExperienceData;
  onSave: (v: ExperienceData) => void;
}> = ({ open, onOpenChange, data, onSave }) => {
  const [company, setCompany] = useState(data.company);
  const [role, setRole] = useState(data.role);
  const [employmentType, setEmploymentType] = useState(data.employmentType);
  const [location, setLocation] = useState(data.location);
  const [locationType, setLocationType] = useState(data.locationType || 'On-site');
  const [startDate, setStartDate] = useState(data.startDate);
  const [endDate, setEndDate] = useState(data.endDate);
  const [currentlyWorking, setCurrentlyWorking] = useState(data.currentlyWorking);
  const [desc, setDesc] = useState(data.desc);
  const [skillsUsed, setSkillsUsed] = useState((data.skillsUsed || []).join(', '));

  useEffect(() => {
    if (!open) return;
    setCompany(data.company);
    setRole(data.role);
    setEmploymentType(data.employmentType);
    setLocation(data.location);
    setLocationType(data.locationType || 'On-site');
    setStartDate(data.startDate);
    setEndDate(data.endDate);
    setCurrentlyWorking(data.currentlyWorking);
    setDesc(data.desc);
    setSkillsUsed((data.skillsUsed || []).join(', '));
  }, [data, open]);

  const handleSave = () => {
    if (!company || !role || !startDate) {
      toast.error('Company, role, and start date are required');
      return;
    }
    onSave({
      ...data,
      company,
      role,
      employmentType,
      location,
      locationType,
      startDate,
      endDate: currentlyWorking ? '' : endDate,
      currentlyWorking,
      desc,
      skillsUsed: skillsUsed.split(',').map(s => s.trim()).filter(s => s),
      updatedAt: new Date().toISOString()
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {data.company ? 'Edit' : 'Add'} Experience
          </DialogTitle>
          <DialogDescription className="sr-only">Edit experience details</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><FormField label="Company *" value={company} onChange={setCompany} /></div>
          <div className="md:col-span-2"><FormField label="Job Title *" value={role} onChange={setRole} /></div>
          <div className="space-y-1">
            <label id="employment-type-label" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Employment Type</label>
            <Select value={employmentType} onValueChange={setEmploymentType}>
              <SelectTrigger aria-labelledby="employment-type-label" className="h-10 rounded-[var(--radius-input)] border-border text-[var(--text-base)]" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label id="location-type-label" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Location Type</label>
            <Select value={locationType} onValueChange={setLocationType}>
              <SelectTrigger aria-labelledby="location-type-label" className="h-10 rounded-[var(--radius-input)] border-border text-[var(--text-base)]" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="On-site">On-site</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormField label="Location" value={location} onChange={setLocation} placeholder="e.g., Cairo, Egypt" />
          <FormField label="Start Date *" value={startDate} onChange={setStartDate} placeholder="e.g., Jan 2023" />
          <FormField label="End Date" value={endDate} onChange={setEndDate} placeholder="e.g., Dec 2024" disabled={currentlyWorking} />
          <div className="md:col-span-2 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input id="currently-working-checkbox" type="checkbox" checked={currentlyWorking} onChange={e => setCurrentlyWorking(e.target.checked)} className="w-4.5 h-4.5 rounded border-border text-chart-3 focus:ring-2 focus:ring-ring/50" />
              <span className="text-[var(--text-base)] text-foreground font-[var(--font-weight-medium)]" style={{ fontFamily: "'Inter', sans-serif" }}>I currently work here</span>
            </label>
          </div>
          <div className="md:col-span-2 space-y-1">
            <label htmlFor="experience-skills-used-input" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Skills Used</label>
            <input id="experience-skills-used-input" type="text" value={skillsUsed} onChange={e => setSkillsUsed(e.target.value)} className={inputClass} placeholder="Separate with commas" style={{ fontFamily: "'Inter', sans-serif" }} />
            <p className="text-[var(--text-sm)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>e.g., Figma, Accessibility, UX Research</p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <label htmlFor="experience-description-textarea" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Description</label>
            <textarea id="experience-description-textarea" dir="auto" value={desc} onChange={e => setDesc(e.target.value)} rows={4} className={cn(inputClass, 'h-auto py-2')} style={{ fontFamily: "'Inter', sans-serif" }} />
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
