import React, { useState, useRef, useEffect } from 'react';
import {
  Pencil, Mail, Phone, Globe, Plus, ExternalLink, Upload,
  Pause, X, Search, Info, ChevronLeft, ChevronRight, Download, Camera, ArrowUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { DatePicker } from './ui/date-picker';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from './ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { Resume } from './Resume';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ProfessionalProfile } from './ProfessionalProfile';
import { BasicInfo } from './BasicInfo';

// ── Shared styles ──
const inputClass = 'w-full h-10 px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const labelClass = 'text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground';

interface DocumentItem {
  id: string;
  title: string;
  desc: string;
  fileName: string;
  status: 'Required' | 'Uploaded';
  uploadedAt?: string;
  url?: string;
  img: string;
}

const svgDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const identificationCardPlaceholder = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="440" viewBox="0 0 720 440">
  <rect width="720" height="440" rx="28" fill="#f8fafc"/>
  <rect x="28" y="28" width="664" height="384" rx="22" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/>
  <rect x="28" y="28" width="664" height="86" rx="22" fill="#1d4ed8"/>
  <text x="56" y="82" font-family="Inter, Arial" font-size="30" font-weight="700" fill="#ffffff">EMPLOYEE IDENTIFICATION</text>
  <rect x="56" y="150" width="140" height="168" rx="16" fill="#e2e8f0"/>
  <circle cx="126" cy="212" r="38" fill="#94a3b8"/>
  <path d="M76 306c18-42 82-42 100 0" fill="#94a3b8"/>
  <g fill="#334155" font-family="Inter, Arial">
    <text x="230" y="166" font-size="18" font-weight="700">NAME</text>
    <text x="230" y="196" font-size="28" font-weight="700">Sample Employee</text>
    <text x="230" y="244" font-size="18" font-weight="700">ROLE</text>
    <text x="230" y="274" font-size="24">UX Designer</text>
    <text x="230" y="322" font-size="18" font-weight="700">ID NUMBER</text>
    <text x="230" y="352" font-size="24" letter-spacing="4">EMP-0000</text>
  </g>
  <rect x="520" y="152" width="118" height="118" rx="12" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/>
  <path d="M544 246h70M544 222h70M544 198h70M568 176v70M592 176v70" stroke="#2563eb" stroke-width="6" stroke-linecap="round"/>
  <rect x="56" y="358" width="582" height="18" rx="9" fill="#cbd5e1"/>
</svg>`);

const passportPlaceholder = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="440" viewBox="0 0 720 440">
  <rect width="720" height="440" rx="28" fill="#eff6ff"/>
  <rect x="132" y="38" width="456" height="364" rx="24" fill="#1e3a8a"/>
  <rect x="164" y="72" width="392" height="300" rx="18" fill="#1d4ed8" stroke="#bfdbfe" stroke-width="3"/>
  <text x="360" y="134" text-anchor="middle" font-family="Inter, Arial" font-size="34" font-weight="700" fill="#ffffff">PASSPORT</text>
  <circle cx="360" cy="224" r="72" fill="none" stroke="#bfdbfe" stroke-width="8"/>
  <path d="M288 224h144M360 152c34 38 34 106 0 144M360 152c-34 38-34 106 0 144M310 184c30 16 70 16 100 0M310 264c30-16 70-16 100 0" stroke="#bfdbfe" stroke-width="6" fill="none" stroke-linecap="round"/>
  <text x="360" y="332" text-anchor="middle" font-family="Inter, Arial" font-size="22" fill="#dbeafe" letter-spacing="5">SAMPLE DOCUMENT</text>
</svg>`);

const defaultDocuments: DocumentItem[] = [
  {
    id: 'identification',
    title: 'Identification Card',
    desc: 'Please ensure you upload both the front and back of your ID.',
    fileName: 'Not uploaded yet',
    status: 'Required',
    img: identificationCardPlaceholder,
  },
  {
    id: 'passport',
    title: 'Passport',
    desc: 'Upload a clear copy of your passport main page.',
    fileName: 'Not uploaded yet',
    status: 'Required',
    img: passportPlaceholder,
  },
];

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

interface ProfileProps {
  currentUser: {
    name: string;
    email: string;
    position: string;
    image: string;
  } | null;
  onUpdateImage: (newImage: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ currentUser, onUpdateImage }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'professional', label: 'Professional Profile' },
    { id: 'bulletin', label: 'Employee Bulletin' },
    { id: 'documents', label: 'Download Center' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row border-b border-border gap-1 sm:gap-6 sm:overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'border-s-2 border-b-0 sm:border-s-0 sm:border-b-2 border-transparent px-3 py-2 sm:px-0 sm:pb-3 sm:pt-1 text-start sm:text-center text-[var(--text-sm)] whitespace-nowrap transition-colors cursor-pointer shrink-0',
              activeTab === tab.id
                ? "text-accent font-[var(--font-weight-semibold)] border-accent"
                : 'text-muted-foreground hover:text-foreground font-[var(--font-weight-medium)]'
            )}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search this profile area..." className={cn(inputClass, 'ps-10 cursor-text')} style={{ fontFamily: "'Inter', sans-serif" }} />
        </div>
      </div>

      <div className="min-h-[560px]">
        {activeTab === 'basic' && <BasicInfo currentUser={currentUser} onUpdateImage={onUpdateImage} />}
        {activeTab === 'professional' && <ProfessionalProfile currentUser={currentUser} />}
        {activeTab === 'bulletin' && <EmployeeBulletin searchQuery={searchQuery} />}
        {activeTab === 'documents' && <DownloadCenter searchQuery={searchQuery} />}
      </div>
    </div>
  );
};

// ═══════════════════════════════════
// ── Employee Bulletin Tab ──
// ═══════════════════════════════════
const EmployeeBulletin: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const bulletins = [
    { title: 'Annual Health Screening', date: 'February 10, 2026', content: 'All employees are required to complete their annual health screening by March 15, 2026. Please book your appointment through the HR portal.' },
    { title: 'New Parking Policy', date: 'January 28, 2026', content: 'Starting February 1st, parking spots will be assigned on a first-come-first-served basis. Please register your vehicle through the facilities portal.' },
    { title: 'Ramadan Working Hours', date: 'January 15, 2026', content: 'During the month of Ramadan, working hours will be reduced to 6 hours per day (9:00 AM - 3:00 PM). This applies to all offices in the MEA region.' },
    { title: 'Q1 Town Hall Meeting', date: 'January 5, 2026', content: 'The Q1 Town Hall meeting will be held on February 20, 2026 at 10:00 AM in the main auditorium. All employees are encouraged to attend.' },
  ].filter((bulletin) => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return true;
    return [bulletin.title, bulletin.date, bulletin.content].some((value) => value.toLowerCase().includes(normalized));
  });

  return (
  <div className="space-y-6">
    <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Employee Bulletin</h3>
    {bulletins.map((bulletin, i) => (
      <div key={i} className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)] space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-foreground text-[var(--text-base)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>{bulletin.title}</h4>
          <span className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{bulletin.date}</span>
        </div>
        <p className="text-[var(--text-sm)] text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{bulletin.content}</p>
      </div>
    ))}
    {bulletins.length === 0 && (
      <div className="bg-card border border-border rounded-[var(--radius-card)] p-6 text-center text-muted-foreground">
        No bulletin posts match your search.
      </div>
    )}
  </div>
  );
};

// ════════════════════════════════════
// ── Download Center Tab ──
// ════════════════════════════════════
const DownloadCenter: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(defaultDocuments);
  const [uploadingDocumentId, setUploadingDocumentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingDocumentIdRef = useRef<string | null>(null);

  const visibleDocuments = documents.filter((document) => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return true;
    return [document.title, document.desc, document.fileName, document.status].some((value) => value.toLowerCase().includes(normalized));
  });

  const openPicker = (documentId?: string) => {
    pendingDocumentIdRef.current = documentId ?? null;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const targetId = pendingDocumentIdRef.current ?? `doc-${Date.now()}`;
    const existingDocument = documents.find((document) => document.id === targetId);
    const objectUrl = URL.createObjectURL(file);
    const isImage = file.type.startsWith('image/');
    const nextDocument: DocumentItem = {
      id: targetId,
      title: existingDocument?.title ?? file.name.replace(/\.[^.]+$/, ''),
      desc: existingDocument?.desc ?? 'Temporary uploaded document for testing.',
      fileName: file.name,
      status: 'Uploaded',
      uploadedAt: new Date().toLocaleString(),
      url: objectUrl,
      img: isImage ? objectUrl : existingDocument?.img ?? defaultDocuments[0].img,
    };

    setUploadingDocumentId(targetId);
    window.setTimeout(() => {
      setDocuments((current) => {
        const exists = current.some((document) => document.id === targetId);
        return exists ? current.map((document) => (document.id === targetId ? nextDocument : document)) : [nextDocument, ...current];
      });
      setUploadingDocumentId(null);
      toast.success('Document added', { description: file.name });
    }, 350);

    event.target.value = '';
  };

  const removeDocument = (documentId: string) => {
    setDocuments((current) => current.filter((document) => document.id !== documentId));
    toast.info('Document removed from this test session');
  };

  return (
    <div className="space-y-6">
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">My Documents</h3>
        <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white gap-2" style={{ fontFamily: "'Inter', sans-serif" }} onClick={() => openPicker()}>
          <Upload className="w-4 h-4" /> Upload Document
        </Button>
      </div>

      <div className="space-y-4">
        {visibleDocuments.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            isUploading={uploadingDocumentId === document.id}
            onUpload={() => openPicker(document.id)}
            onRemove={() => removeDocument(document.id)}
          />
        ))}
        {visibleDocuments.length === 0 && (
          <div className="bg-card border border-border rounded-[var(--radius-card)] p-6 text-center text-muted-foreground">
            No documents match your search.
          </div>
        )}
      </div>
    </div>
  );
};

const LegacyDownloadCenter = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">My Documents</h3>
      <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white gap-2" style={{ fontFamily: "'Inter', sans-serif" }} onClick={() => toast.success('Upload dialog would open')}>
        <Upload className="w-4 h-4" /> Upload Document
      </Button>
    </div>

    <div className="space-y-4">
      <DocumentCard title="Identification Card" desc="Please ensure you upload both the front and back of your ID." img="https://images.unsplash.com/photo-1621348160394-211bc0a5a60d?w=400&h=200&fit=crop" />
      <DocumentCard title="Passport" desc="Upload a clear copy of your passport main page." img="https://images.unsplash.com/photo-1593006517807-19c67fdc54b2?w=400&h=200&fit=crop" />

      {/* Upload progress */}
      <div className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground">Uploading...</p>
            <p className="text-[var(--text-xs)] text-muted-foreground">65% • 10 seconds remaining</p>
          </div>
          <div className="flex gap-1.5">
            <button className="p-1.5 text-muted-foreground hover:bg-muted rounded-[var(--radius-sm)] cursor-pointer transition-colors"><Pause className="w-4 h-4" /></button>
            <button className="p-1.5 text-destructive hover:bg-destructive/10 rounded-[var(--radius-sm)] cursor-pointer transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div className="bg-chart-3 h-full w-[65%] rounded-full transition-all" />
        </div>
      </div>
    </div>
  </div>
);

// ════════════════════════════════════
// ── Reusable sub-components ──
// ════════════════════════════════════

const InfoSection: React.FC<{ title: string; onEdit?: () => void; children: React.ReactNode }> = ({ title, onEdit, children }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between border-b border-border pb-2">
      <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">{title}</span>
      {onEdit && <button onClick={onEdit} className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><Pencil className="w-4 h-4" /></button>}
    </div>
    <div className="space-y-2.5">{children}</div>
  </div>
);

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-start gap-3 text-[var(--text-sm)]">
    <span className="w-32 shrink-0 text-muted-foreground font-[var(--font-weight-medium)]">{label}</span>
    <span className="text-foreground">{value}</span>
  </div>
);

const ProfileCard: React.FC<{ title: string; children: React.ReactNode; onEdit?: () => void; showAdd?: boolean; onAdd?: () => void }> = ({ title, children, onEdit, showAdd, onAdd }) => (
  <div className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)] space-y-4">
    <div className="flex items-center justify-between border-b border-border pb-2.5">
      <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">{title}</span>
      <div className="flex gap-1">
        {showAdd && <button onClick={onAdd} className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><Plus className="w-4 h-4" /></button>}
        {onEdit && <button onClick={onEdit} className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><Pencil className="w-4 h-4" /></button>}
      </div>
    </div>
    {children}
  </div>
);

const ExperienceItem: React.FC<{ company: string; role: string; period: string; desc: string; onEdit?: () => void }> = ({ company, role, period, desc, onEdit }) => (
  <div className="relative group">
    <div className="absolute -start-[19px] top-[6px] w-3 h-3 bg-primary border-2 border-card rotate-45" />
    <div className="space-y-1 pe-8">
      <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">{company}</p>
      <p className="text-[var(--text-sm)] text-primary font-[var(--font-weight-medium)]">{role}</p>
      <p className="text-[var(--text-xs)] text-muted-foreground">{period}</p>
      <p className="text-[var(--text-sm)] text-muted-foreground pt-1">{desc}</p>
    </div>
    {onEdit && (
      <button 
        onClick={onEdit}
        className="absolute top-0 end-0 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-muted rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-all cursor-pointer"
      >
        <Pencil className="w-4 h-4" />
      </button>
    )}
  </div>
);

const EducationItem: React.FC<{ school: string; degree: string; period: string; onEdit?: () => void }> = ({ school, degree, period, onEdit }) => (
  <div className="relative group">
    <div className="absolute -start-[19px] top-[6px] w-3 h-3 bg-primary border-2 border-card rotate-45" />
    <div className="space-y-0.5 pe-8">
      <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">{school}</p>
      <p className="text-[var(--text-sm)] text-muted-foreground">{degree}</p>
      <p className="text-[var(--text-xs)] text-muted-foreground">{period}</p>
    </div>
    {onEdit && (
      <button 
        onClick={onEdit}
        className="absolute top-0 end-0 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-muted rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-all cursor-pointer"
      >
        <Pencil className="w-4 h-4" />
      </button>
    )}
  </div>
);

const ProjectItem: React.FC<{ title: string; date: string; desc: string; onEdit?: () => void }> = ({ title, date, desc, onEdit }) => (
  <div className="relative group space-y-1 pe-8">
    <div className="flex items-center justify-between">
      <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">{title}</p>
    </div>
    <p className="text-[var(--text-xs)] text-muted-foreground">Issued {date}</p>
    <p className="text-[var(--text-sm)] text-muted-foreground">{desc}</p>
    <Button variant="outline" size="sm" className="gap-1.5 mt-1 text-[var(--text-xs)]">
      Show Credential <ExternalLink className="w-3 h-3" />
    </Button>
    {onEdit && (
      <button 
        onClick={onEdit}
        className="absolute top-0 end-0 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-muted rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-all cursor-pointer"
      >
        <Pencil className="w-4 h-4" />
      </button>
    )}
  </div>
);

const CertificationItem: React.FC<{ title: string; issuer: string; date: string }> = ({ title, issuer, date }) => (
  <div className="space-y-1">
    <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">{title}</p>
    <p className="text-[var(--text-xs)] text-muted-foreground">{issuer}</p>
    <p className="text-[var(--text-xs)] text-muted-foreground">{date}</p>
    <Button variant="outline" size="sm" className="gap-1.5 mt-1 text-[var(--text-xs)]">
      Show Credential <ExternalLink className="w-3 h-3" />
    </Button>
  </div>
);

const DocumentCard: React.FC<{
  document?: DocumentItem;
  isUploading?: boolean;
  onUpload?: () => void;
  onRemove?: () => void;
  title?: string;
  desc?: string;
  img?: string;
}> = ({ document, isUploading = false, onUpload, onRemove, title, desc, img }) => {
  const item: DocumentItem = document ?? {
    id: title ?? 'document',
    title: title ?? 'Document',
    desc: desc ?? '',
    fileName: 'Not uploaded yet',
    status: 'Required',
    img: img ?? defaultDocuments[0].img,
  };

  return (
    <div className="flex flex-col md:flex-row bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
      <div className="w-full md:w-60 h-36 bg-muted relative group shrink-0">
        <ImageWithFallback src={item.img} alt="" className="w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <button type="button" aria-label={`Previous preview for ${item.title}`} className="p-1 bg-card/70 rounded-full hover:bg-card transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4 text-foreground" /></button>
          <button type="button" aria-label={`Next preview for ${item.title}`} className="p-1 bg-card/70 rounded-full hover:bg-card transition-colors cursor-pointer"><ChevronRight className="w-4 h-4 text-foreground" /></button>
        </div>
      </div>
      <div className="flex-1 p-5 flex flex-col justify-center gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[var(--text-base)] font-[var(--font-weight-semibold)] text-foreground">{item.title}</p>
            <span className={cn(
              'px-2 py-0.5 rounded-full border text-[var(--text-xs)] font-[var(--font-weight-semibold)]',
              item.status === 'Uploaded'
                ? 'bg-[#E7F6EF] text-[#064E3B] border-[#047857]'
                : 'bg-[#FFF4DE] text-[#7C2D12] border-[#C2410C]'
            )}>
              {item.status}
            </span>
          </div>
          <p className="text-[var(--text-xs)] text-muted-foreground mt-0.5">{item.desc}</p>
          <p className="text-[var(--text-xs)] text-foreground mt-2">
            {item.fileName}{item.uploadedAt ? ` - uploaded ${item.uploadedAt}` : ''}
          </p>
        </div>
        {isUploading && (
          <div className="space-y-2" role="status" aria-live="polite">
            <p className="text-[var(--text-xs)] text-muted-foreground">Uploading...</p>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div className="bg-chart-3 h-full w-2/3 rounded-full transition-all" />
            </div>
          </div>
        )}
        <div className="border-t border-dashed border-border pt-3 flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex-1 gap-2" onClick={onUpload}>
            <Upload className="w-4 h-4" /> {item.status === 'Uploaded' ? 'Reupload File' : 'Upload File'}
          </Button>
          {item.url && (
            <Button asChild variant="outline" className="flex-1 gap-2">
              <a href={item.url} download={item.fileName}>
                <Download className="w-4 h-4" /> Download
              </a>
            </Button>
          )}
          {item.status === 'Uploaded' && onRemove && (
            <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={onRemove} aria-label={`Remove ${item.title}`}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════
// ── Edit Modals ──
// ════════════════════════════════════

const EditPersonalInfoModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const [name, setName] = useState('Ahmed Mahdy');
  const [email, setEmail] = useState('amahdy59@gmail.com');
  const [phone, setPhone] = useState('+20 150 *** 0111');
  const [homePhone, setHomePhone] = useState('Not provided');
  const [address, setAddress] = useState('Cairo, Egypt');
  const [gender, setGender] = useState('Male');
  const [idNumber, setIdNumber] = useState('0000******0000');
  const [nationality, setNationality] = useState('Egyptian');
  const [dob, setDob] = useState('1980-09-02');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Edit Personal Information</DialogTitle><DialogDescription className="sr-only">Edit your personal information</DialogDescription></DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Personal Information</p>
            <FormField label="Name" value={name} onChange={setName} />
            <FormField label="Email" value={email} onChange={setEmail} type="email" />
            <FormField label="Phone" value={phone} onChange={setPhone} />
            <FormField label="Home Phone" value={homePhone} onChange={setHomePhone} />
            <div className="space-y-1.5">
              <label className={labelClass}>Address</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className={cn(inputClass, 'h-auto py-2')} />
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">National Information</p>
            <div className="space-y-1.5">
              <label className={labelClass}>Gender</label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
              </Select>
            </div>
            <FormField label="Personal ID" value={idNumber} onChange={setIdNumber} />
            <FormField label="Nationality" value={nationality} onChange={setNationality} />
            <FormField label="Date of Birth" value={dob} onChange={setDob} type="date" />
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border">Discard Changes</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => { onOpenChange(false); toast.success('Personal information updated successfully'); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditNoteModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const [note, setNote] = useState('Experienced cybersecurity engineer with 15+ years in enterprise security infrastructure. Specialized in SCADA systems protection, vulnerability assessment, and compliance frameworks.');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Edit Note</DialogTitle><DialogDescription className="sr-only">Edit about section</DialogDescription></DialogHeader>
        <div className="space-y-1.5"><label className={labelClass}>About</label><textarea value={note} onChange={e => setNote(e.target.value)} rows={5} className={cn(inputClass, 'h-auto py-2')} /></div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border">Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => { onOpenChange(false); toast.success('About section updated'); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditExperienceModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const [company, setCompany] = useState('AM Technologies');
  const [role, setRole] = useState('Cybersecurity Engineer');
  const [desc, setDesc] = useState('Lead security assessments for SCADA systems across the MEA region.');
  const [startM, setStartM] = useState('January');
  const [startY, setStartY] = useState('2023');
  const [endM, setEndM] = useState('');
  const [endY, setEndY] = useState('');
  const [current, setCurrent] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Edit Experience</DialogTitle><DialogDescription className="sr-only">Edit experience</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <FormField label="Company" value={company} onChange={setCompany} />
          <FormField label="Job Title" value={role} onChange={setRole} />
          <div className="space-y-1.5"><label className={labelClass}>Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className={cn(inputClass, 'h-auto py-2')} /></div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={current} onChange={e => setCurrent(e.target.checked)} className="w-4 h-4 rounded border-border accent-[var(--chart-3)]" />
            <span className="text-[var(--text-sm)] text-foreground font-[var(--font-weight-normal)]">I am currently working in this role</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Start Month" value={startM} onChange={setStartM} options={MONTHS} />
            <SelectField label="Start Year" value={startY} onChange={setStartY} options={YEARS} />
          </div>
          {!current && <div className="grid grid-cols-2 gap-3">
            <SelectField label="End Month" value={endM} onChange={setEndM} options={MONTHS} />
            <SelectField label="End Year" value={endY} onChange={setEndY} options={YEARS} />
          </div>}
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border">Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => { onOpenChange(false); toast.success('Experience updated'); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditEducationModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const [school, setSchool] = useState('Information Technology Institute (ITI)');
  const [degree, setDegree] = useState('Diploma');
  const [field, setField] = useState('Instructional Technology');
  const [startM, setStartM] = useState('September');
  const [startY, setStartY] = useState('2016');
  const [endM, setEndM] = useState('June');
  const [endY, setEndY] = useState('2017');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Edit Education</DialogTitle><DialogDescription className="sr-only">Edit education</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <FormField label="School" value={school} onChange={setSchool} />
          <FormField label="Degree" value={degree} onChange={setDegree} />
          <FormField label="Field of Study" value={field} onChange={setField} />
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Start Month" value={startM} onChange={setStartM} options={MONTHS} />
            <SelectField label="Start Year" value={startY} onChange={setStartY} options={YEARS} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="End Month" value={endM} onChange={setEndM} options={MONTHS} />
            <SelectField label="End Year" value={endY} onChange={setEndY} options={YEARS} />
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border">Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => { onOpenChange(false); toast.success('Education updated'); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditCertificationModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const [certName, setCertName] = useState('CISSP');
  const [issuer, setIssuer] = useState('(ISC)²');
  const [credId, setCredId] = useState('');
  const [credUrl, setCredUrl] = useState('');
  const [issueM, setIssueM] = useState('July');
  const [issueY, setIssueY] = useState('2024');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Edit Certification</DialogTitle><DialogDescription className="sr-only">Edit certification</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <FormField label="Name" value={certName} onChange={setCertName} />
          <FormField label="Issuing Organization" value={issuer} onChange={setIssuer} />
          <FormField label="Credential ID" value={credId} onChange={setCredId} placeholder="Optional" />
          <FormField label="Credential URL" value={credUrl} onChange={setCredUrl} placeholder="https://" />
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Issue Month" value={issueM} onChange={setIssueM} options={MONTHS} />
            <SelectField label="Issue Year" value={issueY} onChange={setIssueY} options={YEARS} />
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border">Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => { onOpenChange(false); toast.success('Certification updated'); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditSkillsModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const [skill, setSkill] = useState('');
  const skills = ['Cybersecurity', 'SCADA', 'Penetration Testing', 'Network Security', 'SIEM', 'Incident Response', 'Python', 'Cloud Security'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Edit Skills</DialogTitle><DialogDescription className="sr-only">Edit skills</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s} className="px-3 py-1 rounded-full border border-[#2563EB] bg-[#EAF2FF] text-[#1E3A8A] text-[var(--text-xs)] font-[var(--font-weight-semibold)] flex items-center gap-1.5">
                {s} <button className="hover:text-destructive cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={skill} onChange={e => setSkill(e.target.value)} placeholder="Add a skill..." className={inputClass} />
            <Button variant="outline" className="shrink-0 rounded-[var(--radius-button)] border-border" onClick={() => { if (skill) { toast.success(`${skill} added`); setSkill(''); } }}>Add</Button>
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border">Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => { onOpenChange(false); toast.success('Skills updated'); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditProjectModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const [pName, setPName] = useState('HR Tool');
  const [pDesc, setPDesc] = useState('Full-stack HR management platform built with React and Node.js.');
  const [pUrl, setPUrl] = useState('');
  const [pMonth, setPMonth] = useState('July');
  const [pYear, setPYear] = useState('2024');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Edit Project</DialogTitle><DialogDescription className="sr-only">Edit project</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <FormField label="Project Name" value={pName} onChange={setPName} />
          <div className="space-y-1.5"><label className={labelClass}>Description</label><textarea value={pDesc} onChange={e => setPDesc(e.target.value)} rows={3} className={cn(inputClass, 'h-auto py-2')} /></div>
          <FormField label="Project URL" value={pUrl} onChange={setPUrl} placeholder="https://" />
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Month" value={pMonth} onChange={setPMonth} options={MONTHS} />
            <SelectField label="Year" value={pYear} onChange={setPYear} options={YEARS} />
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border">Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => { onOpenChange(false); toast.success('Project updated'); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ChangeImageModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; onUpdateImage: (newImage: string) => void; currentUser: ProfileProps['currentUser']; }> = ({ open, onOpenChange, onUpdateImage, currentUser }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      // Simulate an upload (replace with actual API call)
      setTimeout(() => {
        onUpdateImage(preview || '');
        toast.success('Profile picture updated');
        onOpenChange(false);
      }, 1000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Change Profile Picture</DialogTitle><DialogDescription className="sr-only">Upload a new profile picture</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-card shadow-[var(--elevation-sm)] mb-3 mx-auto">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div 
                  className="w-full h-full bg-primary/10 flex items-center justify-center"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '2rem',
                    fontWeight: 'var(--font-weight-bold)',
                  }}
                >
                  <span className="text-primary">
                    {currentUser ? getInitials(currentUser.name) : 'U'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="profile-image-upload" />
          <label htmlFor="profile-image-upload" className="w-full h-10 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow cursor-pointer flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" /> Upload Image
          </label>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border">Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={handleUpload}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditEmergencyContactsModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const [contactName, setContactName] = useState('Emergency Contact');
  const [relationship, setRelationship] = useState('Mother');
  const [phone, setPhone] = useState('+20 150 *** 0111');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Edit Emergency Contacts</DialogTitle><DialogDescription className="sr-only">Edit emergency contacts</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <FormField label="Contact Name" value={contactName} onChange={setContactName} />
          <FormField label="Relationship" value={relationship} onChange={setRelationship} />
          <FormField label="Phone" value={phone} onChange={setPhone} />
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border">Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => { onOpenChange(false); toast.success('Emergency contacts updated'); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Shared helpers ──
const FormField: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="space-y-1.5"><label className={labelClass}>{label}</label>{type === 'date' ? <DatePicker value={value} onChange={onChange} placeholder={placeholder} /> : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />}</div>
);

const SelectField: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    <label className={labelClass}>{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  </div>
);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000', '1999', '1998'];
