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
const inputClass = 'w-full h-[44px] px-3.5 border border-border/80 rounded-xl bg-card text-foreground text-[var(--text-base)] text-start focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all shadow-2xs hover:border-slate-300 dark:hover:border-slate-700';
const iconButtonClass = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 shadow-2xs hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer';

interface SkillsSectionProps {
  skills: SkillData[];
  searchQuery: string;
  onSave: (skill: SkillData) => void;
  onDelete: (id: string, name: string) => void;
}

const ProfileCard: React.FC<{
  title: string;
  count?: number;
  showAdd?: boolean;
  onAdd?: () => void;
  children: React.ReactNode;
}> = ({ title, count, showAdd = true, onAdd, children }) => {
  const headingId = `professional-profile-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <section aria-labelledby={headingId} className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span id={headingId} className="text-[var(--text-lg)] font-[var(--font-weight-bold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            {title}
          </span>
          {typeof count === 'number' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 dark:bg-primary/15 dark:text-blue-300">
              {count}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {showAdd && onAdd && (
            <button
              onClick={onAdd}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-background text-foreground transition-all hover:bg-muted hover:border-border active:scale-95 shadow-2xs hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              aria-label={`Add ${title}`}
              title={`Add ${title}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {children}
    </section>
  );
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner': 
      return 'bg-slate-500/[0.08] text-slate-800 border-slate-300/80 dark:bg-slate-500/15 dark:text-slate-200 dark:border-slate-700/80 hover:bg-slate-500/[0.14] hover:border-slate-400 dark:hover:border-slate-600';
    case 'Intermediate': 
      return 'bg-sky-500/[0.08] text-sky-900 border-sky-300/80 dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-700/80 hover:bg-sky-500/[0.14] hover:border-sky-400 dark:hover:border-sky-600';
    case 'Advanced': 
      return 'bg-violet-500/[0.08] text-violet-900 border-violet-300/80 dark:bg-violet-500/15 dark:text-violet-200 dark:border-violet-700/80 hover:bg-violet-500/[0.14] hover:border-violet-400 dark:hover:border-violet-600';
    case 'Expert': 
      return 'bg-emerald-500/[0.08] text-emerald-900 border-emerald-300/80 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-700/80 hover:bg-emerald-500/[0.14] hover:border-emerald-400 dark:hover:border-emerald-600';
    default: 
      return 'bg-primary/[0.08] text-primary border-primary/25 dark:bg-primary/15 dark:text-primary-foreground dark:border-primary/40 hover:bg-primary/[0.14] hover:border-primary/50';
  }
};

const getLevelDotColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'bg-slate-500 dark:bg-slate-400';
    case 'Intermediate':
      return 'bg-sky-500 dark:bg-sky-400';
    case 'Advanced':
      return 'bg-violet-500 dark:bg-violet-400';
    case 'Expert':
      return 'bg-emerald-500 dark:bg-emerald-400';
    default:
      return 'bg-primary dark:bg-primary';
  }
};

const SkillBadge: React.FC<{
  data: SkillData;
  onEdit: () => void;
  onDelete: () => void;
  showLevelDot?: boolean;
}> = React.memo(({ data, onEdit, onDelete, showLevelDot = true }) => {
  return (
    <span
      tabIndex={0}
      role="button"
      aria-label={`${data.name} (${data.level}) - Click to edit`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit();
        }
      }}
      onClick={onEdit}
      title={`Click to edit ${data.name} (${data.level})`}
      className={cn(
        "group/pill relative inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none whitespace-nowrap cursor-pointer transition-all duration-150 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1",
        getLevelColor(data.level)
      )}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {showLevelDot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-150 group-hover/pill:scale-125",
            getLevelDotColor(data.level)
          )}
          aria-hidden="true"
        />
      )}
      <span className="text-inherit">{data.name}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label={`Delete ${data.name} skill`}
        title={`Delete ${data.name} skill`}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full opacity-50 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/20 transition-all hover:scale-110 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive shrink-0 -me-0.5 cursor-pointer"
      >
        <X className="w-3 h-3" />
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

  // Dynamically collect all categories that have matching skills
  const categories = Array.from(new Set([
    'Core UX & Design',
    'Data Analysis & Visualization',
    ...skills.map(s => s.category).filter(Boolean)
  ])).filter(cat => filtered.some(s => s.category === cat));

  const knownLevels = ['Expert', 'Advanced', 'Intermediate', 'Beginner'];

  return (
    <>
      <ProfileCard title="Skills" count={filtered.length} onAdd={handleAdd}>
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            {query ? 'No skills match your search query.' : 'No skills added yet.'}
          </div>
        ) : (
          <div className="space-y-5">
            {categories.map((category) => {
              const categorySkills = filtered.filter(s => s.category === category);
              if (categorySkills.length === 0) return null;

              // Compute any custom levels beyond standard 4
              const customLevels = Array.from(new Set(categorySkills.map(s => s.level).filter(lvl => !knownLevels.includes(lvl))));
              const displayLevels = [...knownLevels, ...customLevels];

              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span>{category}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border/50">
                        {categorySkills.length}
                      </span>
                    </h4>
                  </div>

                  <div className="space-y-3 ps-0.5">
                    {displayLevels.map(lvl => {
                      const levelSkills = categorySkills.filter(s => s.level === lvl);
                      if (levelSkills.length === 0) return null;

                      return (
                        <div key={lvl} className="space-y-1.5">
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <span className={cn("w-2 h-2 rounded-full ring-2 ring-background shrink-0", getLevelDotColor(lvl))} aria-hidden="true" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                              {lvl}
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground/80 bg-muted/70 px-1.5 py-0.2 rounded-full border border-border/40">
                              {levelSkills.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {levelSkills.map(s => (
                              <SkillBadge
                                key={s.id}
                                data={s}
                                onEdit={() => handleEdit(s)}
                                onDelete={() => onDelete(s.id, s.name)}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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

  useEffect(() => {
    if (!open) return;
    setName(data.name);
    setCategory(data.category);
    setLevel(data.level);
    setIsCustomCategory(!predefinedCategories.includes(data.category) && data.category !== '');
  }, [data, open]);

  const handleSave = () => {
    if (!name.trim() || !category.trim()) {
      toast.error('Skill name and category are required');
      return;
    }
    onSave({ ...data, name: name.trim(), category: category.trim(), level });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {data.name ? 'Edit' : 'Add'} Skill
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Configure your skill name, category, and proficiency level.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <FormField label="Skill Name *" value={name} onChange={setName} placeholder="e.g., Figma" />
          <div className="space-y-1">
            <label id="skill-category-label" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Category *</label>
            {isCustomCategory ? (
              <div className="flex gap-2">
                <input id="custom-category-input" type="text" value={category} onChange={e => setCategory(e.target.value)} className={inputClass} placeholder="e.g., Programming" style={{ fontFamily: "'Inter', sans-serif" }} />
                <Button variant="ghost" type="button" onClick={() => { setIsCustomCategory(false); setCategory(predefinedCategories[0]); }} className="rounded-xl">Cancel</Button>
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
                <SelectTrigger aria-labelledby="skill-category-label" className="min-h-[44px] rounded-xl border-border/80 text-[var(--text-base)]" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
                <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                  {predefinedCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Category...</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-1">
            <label id="skill-level-label" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Proficiency Level</label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger aria-labelledby="skill-level-label" className="min-h-[44px] rounded-xl border-border/80 text-[var(--text-base)]" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="Expert">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Expert</span>
                  </div>
                </SelectItem>
                <SelectItem value="Advanced">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    <span>Advanced</span>
                  </div>
                </SelectItem>
                <SelectItem value="Intermediate">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span>Intermediate</span>
                  </div>
                </SelectItem>
                <SelectItem value="Beginner">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>Beginner</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Live Preview */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-medium text-muted-foreground">Preview:</span>
            <div className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-center min-h-[48px]">
              <SkillBadge
                data={{
                  id: 'preview',
                  name: name.trim() || 'Skill Name',
                  category: category || 'Category',
                  level: level || 'Advanced',
                  createdAt: '',
                }}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6 flex gap-2 justify-end">
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="rounded-xl" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
