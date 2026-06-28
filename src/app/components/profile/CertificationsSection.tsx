import React, { useState, useEffect } from 'react';
import {
  Plus, Pencil, ChevronUp, ChevronDown, Trash2, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '../ui/dialog';
import { toast } from 'sonner';
import { CertificationData } from './Types';
import { FormField } from './FormField';

const iconButtonClass = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer';

interface CertificationsSectionProps {
  certifications: CertificationData[];
  searchQuery: string;
  onSave: (cert: CertificationData) => void;
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

const CertificationItem: React.FC<{
  data: CertificationData;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (dir: 'up' | 'down') => void;
}> = React.memo(({ data, isFirst, isLast, onEdit, onDelete, onMove }) => {
  const isExpired = data.expiryDate && new Date(data.expiryDate) < new Date();

  return (
    <div className="relative group space-y-1 pb-6 border-b border-border last:border-b-0 last:pb-0">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-bold text-foreground">{data.title}</h3>
        {isExpired && <span className="px-2 py-0.5 bg-red-50 text-red-900 border border-red-200 dark:bg-red-950/30 dark:text-red-200 dark:border-red-800 rounded-full text-sm font-semibold">Expired</span>}
      </div>
      <p className="text-base text-foreground">{data.issuer}</p>
      <p className="text-base text-muted-foreground pt-1">
        Issued {data.issueDate}{data.expiryDate && ` - Expires ${data.expiryDate}`}
        {data.credentialId && ` - ID: ${data.credentialId}`}
      </p>
      {data.credentialUrl && (
        <div className="pt-3">
          <Button variant="outline" size="default" asChild className="gap-2 text-base font-medium hover:bg-muted whitespace-nowrap min-h-11">
            <a href={/^https?:\/\//i.test(data.credentialUrl) ? data.credentialUrl : `https://${data.credentialUrl}`} target="_blank" rel="noopener noreferrer">
              Show Credential <ExternalLink className="w-4 h-4" /><span className="sr-only"> opens in a new tab</span>
            </a>
          </Button>
        </div>
      )}
      <div className="absolute top-0 ltr:right-0 rtl:left-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-card/80 backdrop-blur-sm p-1 rounded-md">
        {!isFirst && <button onClick={() => onMove('up')} className={iconButtonClass} aria-label={`Move ${data.title} certification up`} title="Move up"><ChevronUp className="w-4 h-4" /></button>}
        {!isLast && <button onClick={() => onMove('down')} className={iconButtonClass} aria-label={`Move ${data.title} certification down`} title="Move down"><ChevronDown className="w-4 h-4" /></button>}
        <button onClick={onEdit} className={iconButtonClass} aria-label={`Edit ${data.title} certification`} title="Edit"><Pencil className="w-4 h-4" /></button>
        <button onClick={onDelete} className={cn(iconButtonClass, 'hover:bg-destructive/10 hover:text-destructive')} aria-label={`Delete ${data.title} certification`} title="Delete"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
});
CertificationItem.displayName = 'CertificationItem';

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
  searchQuery,
  onSave,
  onDelete,
  onMove,
}) => {
  const [editCertOpen, setEditCertOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<CertificationData | null>(null);

  const query = searchQuery.toLowerCase().trim();
  const filtered = certifications.filter(c =>
    !query ||
    c.title.toLowerCase().includes(query) ||
    c.issuer.toLowerCase().includes(query) ||
    (c.credentialId || '').toLowerCase().includes(query)
  );

  const handleEdit = (cert: CertificationData) => {
    setSelectedCertification(cert);
    setEditCertOpen(true);
  };

  const handleAdd = () => {
    setSelectedCertification({
      id: Math.random().toString(36).substring(2, 9),
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      orderIndex: certifications.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setEditCertOpen(true);
  };

  return (
    <>
      <ProfileCard title="Licenses & Certifications" onAdd={handleAdd}>
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
            {query ? 'No certifications match your search query.' : 'No certifications added yet.'}
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.sort((a, b) => a.orderIndex - b.orderIndex).map((cert, index) => (
              <CertificationItem
                key={cert.id}
                data={cert}
                isFirst={index === 0}
                isLast={index === certifications.length - 1}
                onEdit={() => handleEdit(cert)}
                onDelete={() => onDelete(cert.id, cert.title)}
                onMove={(dir) => onMove(cert.id, dir)}
              />
            ))}
          </div>
        )}
      </ProfileCard>

      {selectedCertification && (
        <EditCertificationModal
          key={selectedCertification.id}
          open={editCertOpen}
          onOpenChange={setEditCertOpen}
          data={selectedCertification}
          onSave={onSave}
        />
      )}
    </>
  );
};

const EditCertificationModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: CertificationData;
  onSave: (v: CertificationData) => void;
}> = ({ open, onOpenChange, data, onSave }) => {
  const [title, setTitle] = useState(data.title);
  const [issuer, setIssuer] = useState(data.issuer);
  const [issueDate, setIssueDate] = useState(data.issueDate);
  const [expiryDate, setExpiryDate] = useState(data.expiryDate);
  const [credentialId, setCredentialId] = useState(data.credentialId);
  const [credentialUrl, setCredentialUrl] = useState(data.credentialUrl);

  useEffect(() => {
    if (!open) return;
    setTitle(data.title);
    setIssuer(data.issuer);
    setIssueDate(data.issueDate);
    setExpiryDate(data.expiryDate);
    setCredentialId(data.credentialId);
    setCredentialUrl(data.credentialUrl);
  }, [data, open]);

  const handleSave = () => {
    if (!title || !issuer || !issueDate) {
      toast.error('Title, issuer, and issue date are required');
      return;
    }
    onSave({
      ...data,
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      updatedAt: new Date().toISOString()
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {data.title ? 'Edit' : 'Add'} Certification
          </DialogTitle>
          <DialogDescription className="sr-only">Edit certification details</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><FormField label="Certification Title *" value={title} onChange={setTitle} /></div>
          <FormField label="Issuer *" value={issuer} onChange={setIssuer} placeholder="e.g., Google" />
          <FormField label="Issue Date *" value={issueDate} onChange={setIssueDate} placeholder="e.g., Mar 2023" />
          <FormField label="Expiry Date" value={expiryDate} onChange={setExpiryDate} placeholder="e.g., Mar 2026 (Optional)" />
          <FormField label="Credential ID" value={credentialId} onChange={setCredentialId} placeholder="e.g., GDA-2023-001" />
          <div className="md:col-span-2"><FormField label="Credential URL" value={credentialUrl} onChange={setCredentialUrl} placeholder="https://" /></div>
        </div>
        <DialogFooter className="mt-6 flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
