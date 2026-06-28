import React, { useState, useEffect } from 'react';
import {
  Plus, X
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
import { SkillData } from './Types';
import { FormField } from './FormField';

const labelClass = 'block text-start w-full text-[var(--text-base)] font-[var(--font-weight-medium)] text-foreground';
const inputClass = 'w-full h-[44px] px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-base)] text-start focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const iconButtonClass = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer';

interface SkillsSectionProps {
  skills: SkillData[];
  searchQuery: string;
  onSave: (skill: SkillData) => void;
  onDelete: (id: string, name: string) => void;
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

const SkillBadge: React.FC<{ data: SkillData; onEdit: () => void; onDelete: () => void }> = React.memo(({ data, onEdit, onDelete }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': 
        return 'bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800/40 dark:text-slate-200 dark:border-slate-700';
      case 'Intermediate': 
        return 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-800';
      case 'Advanced': 
        return 'bg-violet-50 text-violet-900 border-violet-200 dark:bg-violet-950/30 dark:text-violet-200 dark:border-violet-800';
      case 'Expert': 
        return 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200 dark:border-emerald-800';
      default: 
        return 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-800';
    }
  };

  return (
    <span
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEdit(); } }}
      className={cn("group relative min-h-8 w-fit rounded-full border ps-3.5 pe-1.5 py-1 text-sm sm:text-base font-[var(--font-weight-semibold)] inline-flex items-center justify-center gap-1.5 text-center leading-none cursor-pointer transition-all hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary whitespace-nowrap", getLevelColor(data.level))}
      onClick={onEdit}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <span className="font-[var(--font-weight-semibold)] text-inherit">{data.name}</span>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        aria-label={`Delete ${data.name} skill`}
        title={`Delete ${data.name} skill`}
        className="flex h-4 w-4 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100 hover:scale-110 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-1 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
});
SkillBadge.displayName = 'SkillBadge';

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  searchQuery,
  onSave,
  onDelete,
}) => {
  const [editSkillOpen, setEditSkillOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);

  const query = searchQuery.toLowerCase().trim();
  const filtered = skills.filter(s =>
    !query ||
    s.name.toLowerCase().includes(query) ||
    s.category.toLowerCase().includes(query) ||
    (s.level || '').toLowerCase().includes(query)
  );

  const handleEdit = (skill: SkillData) => {
    setSelectedSkill(skill);
    setEditSkillOpen(true);
  };

  const handleAdd = () => {
    setSelectedSkill({
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      category: 'Core UX & Design',
      level: 'Advanced',
      createdAt: new Date().toISOString(),
    });
    setEditSkillOpen(true);
  };

  return (
    <>
      <ProfileCard title="Skills" onAdd={handleAdd}>
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
            {query ? 'No skills match your search query.' : 'No skills added yet.'}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Category 1 */}
            <div className="space-y-3.5">
              <h4 className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground border-b border-border pb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Core UX & Design</h4>
              <div className="space-y-3 ps-1">
                {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map(lvl => {
                  const levelSkills = filtered.filter(s => s.category === 'Core UX & Design' && s.level === lvl);
                  if (levelSkills.length === 0) return null;
                  return (
                    <div key={lvl} className="space-y-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest block">
                        {lvl}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {levelSkills.map(s => (
                          <SkillBadge key={s.id} data={s} onEdit={() => handleEdit(s)} onDelete={() => onDelete(s.id, s.name)} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category 2 */}
            <div className="space-y-3.5 pt-1">
              <h4 className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground border-b border-border pb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Data Analysis & Visualization</h4>
              <div className="space-y-3 ps-1">
                {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map(lvl => {
                  const levelSkills = filtered.filter(s => s.category === 'Data Analysis & Visualization' && s.level === lvl);
                  if (levelSkills.length === 0) return null;
                  return (
                    <div key={lvl} className="space-y-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest block">
                        {lvl}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {levelSkills.map(s => (
                          <SkillBadge key={s.id} data={s} onEdit={() => handleEdit(s)} onDelete={() => onDelete(s.id, s.name)} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </ProfileCard>

      {selectedSkill && (
        <EditSkillModal
          key={selectedSkill.id}
          open={editSkillOpen}
          onOpenChange={setEditSkillOpen}
          data={selectedSkill}
          onSave={onSave}
        />
      )}
    </>
  );
};

const EditSkillModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: SkillData;
  onSave: (v: SkillData) => void;
}> = ({ open, onOpenChange, data, onSave }) => {
  const predefinedCategories = ['Core UX & Design', 'Data Analysis & Visualization'];
  const [name, setName] = useState(data.name);
  const [category, setCategory] = useState(data.category);
  const [level, setLevel] = useState(data.level);
  const [isCustomCategory, setIsCustomCategory] = useState(!predefinedCategories.includes(data.category) && data.category !== '');

  const handleSave = () => {
    if (!name || !category) {
      toast.error('Skill name and category are required');
      return;
    }
    onSave({ ...data, name, category, level });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {data.name ? 'Edit' : 'Add'} Skill
          </DialogTitle>
          <DialogDescription className="sr-only">Edit skill details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <FormField label="Skill Name *" value={name} onChange={setName} placeholder="e.g., Figma" />
          <div className="space-y-1.5">
            <label id="skill-category-label" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Category *</label>
            {isCustomCategory ? (
              <div className="flex gap-2">
                <input id="custom-category-input" type="text" value={category} onChange={e => setCategory(e.target.value)} className={inputClass} placeholder="e.g., Programming" style={{ fontFamily: "'Inter', sans-serif" }} />
                <Button variant="ghost" type="button" onClick={() => { setIsCustomCategory(false); setCategory(predefinedCategories[0]); }} className="rounded-[var(--radius-button)]">Cancel</Button>
              </div>
            ) : (
              <Select value={category} onValueChange={(val) => {
                if (val === 'custom') {
                  setIsCustomCategory(true);
                  setCategory('');
                } else {
                  setCategory(val);
                }
              }}>
                <SelectTrigger aria-labelledby="skill-category-label" className="h-10 rounded-[var(--radius-input)] border-border text-[var(--text-base)]" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
                <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                  {predefinedCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Category...</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-1.5">
            <label id="skill-level-label" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Proficiency Level</label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger aria-labelledby="skill-level-label" className="h-10 rounded-[var(--radius-input)] border-border text-[var(--text-base)]" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="Expert">Expert</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
              </SelectContent>
            </Select>
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
