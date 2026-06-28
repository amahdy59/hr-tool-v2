import React, { useState, useEffect } from 'react';
import {
  Plus, Pencil, Trash2
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
import { LanguageData } from './Types';
import { FormField } from './FormField';

const labelClass = 'block text-start w-full text-[var(--text-base)] font-[var(--font-weight-medium)] text-foreground';
const iconButtonClass = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer';

interface LanguagesSectionProps {
  languages: LanguageData[];
  searchQuery: string;
  onSave: (lang: LanguageData) => void;
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

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  languages,
  searchQuery,
  onSave,
  onDelete,
}) => {
  const [editLangOpen, setEditLangOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageData | null>(null);

  const query = searchQuery.toLowerCase().trim();
  const filtered = languages.filter(lang =>
    !query ||
    lang.name.toLowerCase().includes(query) ||
    lang.proficiency.toLowerCase().includes(query)
  );

  const handleEdit = (lang: LanguageData) => {
    setSelectedLanguage(lang);
    setEditLangOpen(true);
  };

  const handleAdd = () => {
    setSelectedLanguage({
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      proficiency: 'Professional Working',
      createdAt: new Date().toISOString(),
    });
    setEditLangOpen(true);
  };

  return (
    <>
      <ProfileCard title="Languages" onAdd={handleAdd}>
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              {query ? 'No languages match your search query.' : 'No languages added yet.'}
            </div>
          ) : (
            filtered.map((lang) => (
              <div key={lang.id} className="relative group flex items-center justify-between py-1.5 border-b border-border last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <p className="text-[var(--text-base)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {lang.name}
                  </p>
                  <p className="text-[var(--text-sm)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {lang.proficiency}
                  </p>
                </div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(lang)} className={iconButtonClass} aria-label={`Edit ${lang.name} language`} title="Edit"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(lang.id, lang.name)} className={cn(iconButtonClass, 'hover:bg-destructive/10 hover:text-destructive')} aria-label={`Delete ${lang.name} language`} title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </ProfileCard>

      {selectedLanguage && (
        <EditLanguageModal
          key={selectedLanguage.id}
          open={editLangOpen}
          onOpenChange={setEditLangOpen}
          data={selectedLanguage}
          onSave={onSave}
        />
      )}
    </>
  );
};

const EditLanguageModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: LanguageData;
  onSave: (v: LanguageData) => void;
}> = ({ open, onOpenChange, data, onSave }) => {
  const [name, setName] = useState(data.name);
  const [proficiency, setProficiency] = useState(data.proficiency);

  useEffect(() => {
    if (!open) return;
    setName(data.name);
    setProficiency(data.proficiency);
  }, [data, open]);

  const handleSave = () => {
    if (!name) {
      toast.error('Language name is required');
      return;
    }
    onSave({ ...data, name, proficiency });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {data.name ? 'Edit' : 'Add'} Language
          </DialogTitle>
          <DialogDescription className="sr-only">Edit language details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <FormField label="Language Name *" value={name} onChange={setName} placeholder="e.g., Arabic, English, German" />
          <div className="space-y-1">
            <label id="language-proficiency-label" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Proficiency Level</label>
            <Select value={proficiency} onValueChange={setProficiency}>
              <SelectTrigger aria-labelledby="language-proficiency-label" className="h-10 rounded-[var(--radius-input)] border-border text-[var(--text-base)]" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="Elementary">Elementary</SelectItem>
                <SelectItem value="Limited Working">Limited Working</SelectItem>
                <SelectItem value="Professional Working">Professional Working</SelectItem>
                <SelectItem value="Full Professional">Full Professional</SelectItem>
                <SelectItem value="Native or Bilingual">Native or Bilingual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
