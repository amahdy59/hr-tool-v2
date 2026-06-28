import React, { useState, useEffect } from 'react';
import {
  Plus, Pencil, ChevronUp, ChevronDown, Trash2, Star, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '../ui/dialog';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { ProjectData, ExperienceData, EducationData } from './Types';
import { FormField } from './FormField';

const labelClass = 'block text-start w-full text-[var(--text-base)] font-[var(--font-weight-medium)] text-foreground';
const inputClass = 'w-full h-[44px] px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-base)] text-start focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const iconButtonClass = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer';

interface ProjectsSectionProps {
  projects: ProjectData[];
  experiences: ExperienceData[];
  educations: EducationData[];
  searchQuery: string;
  onSave: (project: ProjectData) => void;
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

const ProjectItem: React.FC<{
  data: ProjectData;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (dir: 'up' | 'down') => void;
  experiences: ExperienceData[];
  educations: EducationData[];
}> = React.memo(({ data, isFirst, isLast, onEdit, onDelete, onMove, experiences = [], educations = [] }) => {
  let associationName = '';
  if (data.associatedWith) {
    if (data.associatedWith.startsWith('exp-')) {
      const expId = data.associatedWith.replace('exp-', '');
      const exp = experiences.find(e => e.id === expId);
      if (exp) associationName = exp.company;
    } else if (data.associatedWith.startsWith('edu-')) {
      const eduId = data.associatedWith.replace('edu-', '');
      const edu = educations.find(e => e.id === eduId);
      if (edu) associationName = edu.school;
    }
  }

  return (
    <div className="relative group space-y-2.5 pb-6 border-b border-border last:border-b-0 last:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <h3 className="text-lg font-bold text-foreground">{data.title}</h3>
          {data.featured && <span title="Featured project"><Star className="w-4.5 h-4.5 text-[#0F766E] fill-[#0F766E] dark:text-[#2DD4BF] dark:fill-[#2DD4BF]" /></span>}
        </div>
        <span className="px-2.5 py-1 bg-muted/50 text-foreground rounded-full text-sm font-medium shrink-0 w-fit">
          {data.category}
        </span>
      </div>
      <p className="text-base text-foreground font-[var(--font-weight-medium)]">
        {data.role} - {data.issueDate}
      </p>
      {associationName && (
        <p className="text-xs text-muted-foreground italic" style={{ fontFamily: "'Inter', sans-serif" }}>
          Associated with: {associationName}
        </p>
      )}
      <p className="text-base text-foreground/90 leading-relaxed pt-1">
        {data.desc}
      </p>
      {data.toolsUsed.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {data.toolsUsed.map((tool, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-[#EFF6FF] text-[#1D4ED8] dark:bg-[#1E3A8A]/30 dark:text-[#93C5FD] rounded text-sm font-medium">
              {tool}
            </span>
          ))}
        </div>
      )}
      {data.url && (
        <div className="pt-3">
          <Button variant="outline" size="default" asChild className="gap-2 text-base font-medium hover:bg-muted whitespace-nowrap min-h-11">
            <a href={/^https?:\/\//i.test(data.url) ? data.url : `https://${data.url}`} target="_blank" rel="noopener noreferrer">
              View Project <ExternalLink className="w-4 h-4" /><span className="sr-only"> opens in a new tab</span>
            </a>
          </Button>
        </div>
      )}
      <div className="absolute top-0 ltr:right-0 rtl:left-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-card/80 backdrop-blur-sm p-1 rounded-md">
        {!isFirst && <button onClick={() => onMove('up')} className={iconButtonClass} aria-label={`Move ${data.title} project up`} title="Move up"><ChevronUp className="w-4 h-4" /></button>}
        {!isLast && <button onClick={() => onMove('down')} className={iconButtonClass} aria-label={`Move ${data.title} project down`} title="Move down"><ChevronDown className="w-4 h-4" /></button>}
        <button onClick={onEdit} className={iconButtonClass} aria-label={`Edit ${data.title} project`} title="Edit"><Pencil className="w-4 h-4" /></button>
        <button onClick={onDelete} className={cn(iconButtonClass, 'hover:bg-destructive/10 hover:text-destructive')} aria-label={`Delete ${data.title} project`} title="Delete"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
});
ProjectItem.displayName = 'ProjectItem';

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  experiences,
  educations,
  searchQuery,
  onSave,
  onDelete,
  onMove,
}) => {
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const query = searchQuery.toLowerCase().trim();
  const filtered = projects.filter(p =>
    !query ||
    p.title.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    (p.role || '').toLowerCase().includes(query) ||
    (p.desc || '').toLowerCase().includes(query) ||
    (p.toolsUsed || []).some(t => t.toLowerCase().includes(query))
  );

  const handleEdit = (project: ProjectData) => {
    setSelectedProject(project);
    setEditProjectOpen(true);
  };

  const handleAdd = () => {
    setSelectedProject({
      id: Math.random().toString(36).substring(2, 9),
      title: '',
      category: 'UX Projects',
      role: '',
      issueDate: '',
      desc: '',
      toolsUsed: [],
      url: '',
      associatedWith: '',
      featured: false,
      orderIndex: projects.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setEditProjectOpen(true);
  };

  return (
    <>
      <ProfileCard title="Featured Projects" onAdd={handleAdd}>
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
            {query ? 'No projects match your search query.' : 'No projects added yet.'}
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.sort((a, b) => {
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              return a.orderIndex - b.orderIndex;
            }).map((project, index) => (
              <ProjectItem
                key={project.id}
                data={project}
                isFirst={index === 0}
                isLast={index === projects.length - 1}
                onEdit={() => handleEdit(project)}
                onDelete={() => onDelete(project.id, project.title)}
                onMove={(dir) => onMove(project.id, dir)}
                experiences={experiences}
                educations={educations}
              />
            ))}
          </div>
        )}
      </ProfileCard>

      {selectedProject && (
        <EditProjectModal
          key={selectedProject.id}
          open={editProjectOpen}
          onOpenChange={setEditProjectOpen}
          data={selectedProject}
          onSave={onSave}
          experiences={experiences}
          educations={educations}
        />
      )}
    </>
  );
};

const EditProjectModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: ProjectData;
  onSave: (v: ProjectData) => void;
  experiences: ExperienceData[];
  educations: EducationData[];
}> = ({ open, onOpenChange, data, onSave, experiences, educations }) => {
  const [title, setTitle] = useState(data.title);
  const [category, setCategory] = useState(data.category);
  const [role, setRole] = useState(data.role);
  const [issueDate, setIssueDate] = useState(data.issueDate);
  const [desc, setDesc] = useState(data.desc);
  const [toolsUsed, setToolsUsed] = useState(data.toolsUsed.join(', '));
  const [url, setUrl] = useState(data.url);
  const [associatedWith, setAssociatedWith] = useState(data.associatedWith || '');
  const [featured, setFeatured] = useState(data.featured);

  useEffect(() => {
    if (!open) return;
    setTitle(data.title);
    setCategory(data.category);
    setRole(data.role);
    setIssueDate(data.issueDate);
    setDesc(data.desc);
    setToolsUsed(data.toolsUsed.join(', '));
    setUrl(data.url);
    setAssociatedWith(data.associatedWith || '');
    setFeatured(data.featured);
  }, [data, open]);

  const handleSave = () => {
    if (!title || !category) {
      toast.error('Title and category are required');
      return;
    }
    onSave({
      ...data,
      title,
      category,
      role,
      issueDate,
      desc,
      toolsUsed: toolsUsed.split(',').map(t => t.trim()).filter(t => t),
      url,
      associatedWith: associatedWith === 'none' ? '' : associatedWith,
      featured,
      updatedAt: new Date().toISOString()
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {data.title ? 'Edit' : 'Add'} Project
          </DialogTitle>
          <DialogDescription className="sr-only">Edit project details</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><FormField label="Project Title *" value={title} onChange={setTitle} /></div>
          <div className="space-y-1">
            <label htmlFor="project-category-select" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Category *</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="project-category-select" className="h-10 rounded-[var(--radius-input)] border-border text-[var(--text-base)]" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="UX Projects">UX Projects</SelectItem>
                <SelectItem value="Data Analysis & Visualization Projects">Data Analysis & Visualization Projects</SelectItem>
                <SelectItem value="Research Projects">Research Projects</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label id="project-associated-label" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Associated With</label>
            <Select value={associatedWith || 'none'} onValueChange={setAssociatedWith}>
              <SelectTrigger aria-labelledby="project-associated-label" className="h-10 rounded-[var(--radius-input)] border-border text-[var(--text-base)]" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="none">None (Independent Project)</SelectItem>
                {experiences.length > 0 && (
                  <SelectGroup>
                    <SelectLabel className="px-2 py-1 text-xs font-bold text-muted-foreground">Employment</SelectLabel>
                    {experiences.map(exp => (
                      <SelectItem key={exp.id} value={`exp-${exp.id}`}>{exp.company} - {exp.role}</SelectItem>
                    ))}
                  </SelectGroup>
                )}
                {educations.length > 0 && (
                  <SelectGroup>
                    <SelectLabel className="px-2 py-1 text-xs font-bold text-muted-foreground">Education</SelectLabel>
                    {educations.map(edu => (
                      <SelectItem key={edu.id} value={`edu-${edu.id}`}>{edu.school} - {edu.degree}</SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          </div>
          <FormField label="Your Role" value={role} onChange={setRole} placeholder="e.g., UX Designer" />
          <FormField label="Issue Date" value={issueDate} onChange={setIssueDate} placeholder="e.g., 2024" />
          <FormField label="Project URL" value={url} onChange={setUrl} placeholder="https://" />
          <div className="md:col-span-2 space-y-1">
            <label htmlFor="tools-used-input" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Tools Used</label>
            <input id="tools-used-input" type="text" value={toolsUsed} onChange={e => setToolsUsed(e.target.value)} className={inputClass} placeholder="Separate with commas" style={{ fontFamily: "'Inter', sans-serif" }} />
            <p className="text-[var(--text-sm)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>e.g., Figma, Adobe XD, User Research</p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <label htmlFor="project-description-textarea" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Description</label>
            <textarea id="project-description-textarea" dir="auto" value={desc} onChange={e => setDesc(e.target.value)} rows={4} className={cn(inputClass, 'h-auto py-2')} style={{ fontFamily: "'Inter', sans-serif" }} />
          </div>
          <div className="md:col-span-2 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input id="featured-checkbox" type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4.5 h-4.5 rounded border-border text-chart-3 focus:ring-2 focus:ring-ring/50" />
              <span className="text-[var(--text-base)] text-foreground font-[var(--font-weight-medium)]" style={{ fontFamily: "'Inter', sans-serif" }}>Feature this project (pin to top)</span>
            </label>
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
