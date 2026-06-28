import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Phone, Globe, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from './ui/dialog';
import { toast } from 'sonner';
import { Resume } from './Resume';
import { ConfirmDialog } from './ConfirmDialog';

// Shared types and FormField
import {
  ExperienceData, EducationData, ProjectData, CertificationData, SkillData, LanguageData, ContactData
} from './profile/Types';
import { FormField } from './profile/FormField';

// Modular Sections
import { ExperienceSection } from './profile/ExperienceSection';
import { EducationSection } from './profile/EducationSection';
import { ProjectsSection } from './profile/ProjectsSection';
import { CertificationsSection } from './profile/CertificationsSection';
import { SkillsSection } from './profile/SkillsSection';
import { LanguagesSection } from './profile/LanguagesSection';
import { LinkedInImportModal } from './profile/LinkedInImportModal';

// ── Shared styles ──
const inputClass = 'w-full h-[44px] px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-base)] text-start focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const labelClass = 'block text-start w-full text-[var(--text-base)] font-[var(--font-weight-medium)] text-foreground';
const iconButtonClass = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer';

const maskPhoneNumber = (phone: string): string => {
  if (!phone || phone.includes('*')) return phone;
  return phone.replace(/(\+?\d{2,3}\s?\d{2,3}|0\d{2,3})([\s-]?\d+)(\d{3})$/, '$1 *** $3');
};

const ProfileCard: React.FC<{
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}> = ({ title, onEdit, children }) => {
  const headingId = `professional-profile-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <section aria-labelledby={headingId} className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)] space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span id={headingId} className="text-[var(--text-lg)] font-[var(--font-weight-bold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{title}</span>
        <div className="flex gap-1">
          {onEdit && <button onClick={onEdit} className={iconButtonClass} aria-label={`Edit ${title}`} title={`Edit ${title}`}><PencilIcon className="w-4 h-4" /></button>}
        </div>
      </div>
      {children}
    </section>
  );
};

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
);

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-500 bg-red-100 dark:bg-red-950/20 dark:border-red-900 border rounded-lg whitespace-pre-wrap">
          <h1 className="text-xl font-bold mb-4">Something went wrong.</h1>
          <p>{this.state.error?.toString()}</p>
          <p className="mt-4 font-mono text-sm">{this.state.error?.stack}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ProfessionalProfile: React.FC<{ currentUser: any; searchQuery?: string }> = (props) => (
  <ErrorBoundary>
    <ProfessionalProfileContent {...props} />
  </ErrorBoundary>
);

const ProfessionalProfileContent: React.FC<{ currentUser: any; searchQuery?: string }> = ({ currentUser, searchQuery = '' }) => {
  const resumeRef = useRef<HTMLDivElement>(null);

  // State management
  const [about, setAbout] = useState(
    'UX Designer & Data Visualizer with 8+ years of experience turning user and business needs into decision-ready dashboards and user-centered digital experiences. Skilled in user research, information architecture, data storytelling, visualization, and accessible interface design with Excel, Power BI, Tableau, SQL, and Python.'
  );
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());

  const [contact, setContact] = useState<ContactData>({
    email: 'amahdy59@gmail.com',
    phone: '+20 150 *** 0111',
    linkedin: 'linkedin.com/in/creativemahdy',
    dribbble: 'dribbble.com/creativemahdy',
  });

  const [experiences, setExperiences] = useState<ExperienceData[]>([
    {
      id: '1',
      company: 'Advansys IS',
      role: 'User Experience Designer',
      employmentType: 'Full-time',
      location: 'Cairo, Egypt',
      locationType: 'Hybrid',
      startDate: 'Jan 2023',
      endDate: '',
      currentlyWorking: true,
      desc: 'Led UX/UI design for complex B2B and enterprise SaaS platforms, driving user-centric solutions. Established scalable design systems utilizing Figma, Adobe Creative Suite, and modern methodologies. Leveraged AI-powered design tools to accelerate rapid prototyping and UX research synthesis.',
      skillsUsed: ['Figma', 'Design Systems', 'User Research', 'Accessibility'],
      orderIndex: 0,
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      company: 'Schneider Electric',
      role: 'Instructional Designer',
      employmentType: 'Full-time',
      location: 'Cairo Governorate, Egypt',
      locationType: 'On-site',
      startDate: 'Jul 2018',
      endDate: 'Jan 2023',
      currentlyWorking: false,
      desc: 'Redesigned enterprise learning platforms and interfaces, increasing user engagement and training completion rates by 30%. Translated complex technical requirements into accessible, intuitive B2B e-learning experiences.',
      skillsUsed: ['Instructional Design', 'User Research', 'Adobe Creative Suite'],
      orderIndex: 1,
      createdAt: '2018-07-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [educations, setEducations] = useState<EducationData[]>([
    {
      id: '1',
      school: 'Information Technology Institute (ITI)',
      degree: 'Diploma of Education',
      fieldOfStudy: 'Instructional Technology',
      startDate: 'Sep 2016',
      endDate: 'Jun 2017',
      currentlyStudying: false,
      grade: 'Excellent',
      activities: '',
      desc: '',
      orderIndex: 0,
      createdAt: '2016-09-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      school: 'Minufiya University',
      degree: "Bachelor's degree",
      fieldOfStudy: 'Radio and Television',
      startDate: 'Sep 2009',
      endDate: 'Jun 2013',
      currentlyStudying: false,
      grade: 'Good',
      activities: '',
      desc: '',
      orderIndex: 1,
      createdAt: '2009-09-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [projects, setProjects] = useState<ProjectData[]>([
    {
      id: '1',
      title: 'Haj Arafa App',
      category: 'UX Projects',
      role: 'UX Designer',
      issueDate: '2024',
      desc: 'An intuitive, accessible e-commerce experience designed with responsive layouts and seamless navigation to maximize user conversion and engagement.',
      toolsUsed: ['Figma', 'UI/UX Design'],
      url: 'https://amahdy59.github.io/Hajarafaapp/',
      associatedWith: '',
      featured: true,
      orderIndex: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Cairo International Airport - Command Hub',
      category: 'UX Projects',
      role: 'UX Designer',
      issueDate: '2023',
      desc: 'A high-fidelity operational command dashboard focusing on real-time data visualization, clear information hierarchy, and responsive performance.',
      toolsUsed: ['Figma', 'Dashboard Design'],
      url: 'https://amahdy59.github.io/Cairo-International-Airpot-CIA-Dashboard/',
      associatedWith: '',
      featured: true,
      orderIndex: 1,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Human Resources Tool',
      category: 'UX Projects',
      role: 'UX Designer',
      issueDate: '2023',
      desc: 'A responsive, privacy-centric HR SaaS application optimizing leave requests and role management through modern, user-friendly interfaces.',
      toolsUsed: ['Figma', 'React', 'Tailwind'],
      url: 'https://amahdy59.github.io/hr-tool-v2/',
      associatedWith: '',
      featured: false,
      orderIndex: 2,
      createdAt: '2023-03-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'A Data-Driven LEGO Explorer',
      category: 'Data Analysis & Visualization Projects',
      role: 'Data Analyst',
      issueDate: '2024',
      desc: 'An interactive Tableau visualization experience that helps users explore LEGO sets by theme, age, price, and set count.',
      toolsUsed: ['Tableau', 'Data Analysis'],
      url: 'https://mavenshowcase.com/project/24967',
      associatedWith: '',
      featured: true,
      orderIndex: 3,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Sales Performance Dashboard',
      category: 'Data Analysis & Visualization Projects',
      role: 'Data Analyst',
      issueDate: '2023',
      desc: 'CRM sales dashboard built in Google Sheets for tracking quarterly team performance through chart-based visualization.',
      toolsUsed: ['Google Sheets', 'Data Visualization'],
      url: 'https://mavenshowcase.com/project/26891',
      associatedWith: '',
      featured: false,
      orderIndex: 4,
      createdAt: '2023-06-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [certifications, setCertifications] = useState<CertificationData[]>([
    { id: '1', title: 'Google Data Analytics', issuer: 'Google', issueDate: 'Mar 2023', expiryDate: '', credentialId: 'GDA-2023-001', credentialUrl: 'https://www.coursera.org/account/accomplishments/professional-cert/0OYUGNC1DRF5', orderIndex: 0, createdAt: '2023-03-01T00:00:00Z', updatedAt: new Date().toISOString() },
    { id: '2', title: 'Tableau Business Intelligence Analyst', issuer: 'Tableau', issueDate: 'Jan 2023', expiryDate: '', credentialId: 'TBI-2023-002', credentialUrl: 'https://www.coursera.org/account/accomplishments/professional-cert/JQPVYZ6VYF52', orderIndex: 1, createdAt: '2023-01-01T00:00:00Z', updatedAt: new Date().toISOString() },
    { id: '3', title: 'Excel Skills for Data Analytics and Visualization', issuer: 'Microsoft', issueDate: 'Nov 2022', expiryDate: '', credentialId: 'MSFT-2022-003', credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/5XR5AHBP79KW', orderIndex: 2, createdAt: '2022-11-01T00:00:00Z', updatedAt: new Date().toISOString() },
    { id: '4', title: 'Excel Skills for Business', issuer: 'Microsoft', issueDate: 'Sep 2022', expiryDate: '', credentialId: 'MSFT-2022-004', credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/DCL8H4YT5UWG', orderIndex: 3, createdAt: '2022-09-01T00:00:00Z', updatedAt: new Date().toISOString() },
    { id: '5', title: 'Google UX Design', issuer: 'Google', issueDate: 'Jul 2022', expiryDate: '', credentialId: 'GUXD-2022-005', credentialUrl: 'https://www.coursera.org/account/accomplishments/professional-cert/49PCMPYYGLJV', orderIndex: 4, createdAt: '2022-07-01T00:00:00Z', updatedAt: new Date().toISOString() },
  ]);

  const [skills, setSkills] = useState<SkillData[]>([
    { id: '1', name: 'Interaction Design', category: 'Core UX & Design', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '2', name: 'Information Architecture', category: 'Core UX & Design', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '3', name: 'User Research', category: 'Core UX & Design', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '4', name: 'Usability Testing', category: 'Core UX & Design', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '5', name: 'Wireframing', category: 'Core UX & Design', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '6', name: 'Prototyping', category: 'Core UX & Design', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '7', name: 'Figma', category: 'Core UX & Design', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '8', name: 'Design Systems', category: 'Core UX & Design', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '9', name: 'Accessibility', category: 'Core UX & Design', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '10', name: 'Enterprise & SaaS Design', category: 'Core UX & Design', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '11', name: 'Adobe Creative Suite', category: 'Core UX & Design', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '12', name: 'AI Design Tools', category: 'Core UX & Design', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '13', name: 'Microsoft Excel (Advanced)', category: 'Data Analysis & Visualization', level: 'Expert', createdAt: '2023-01-01T00:00:00Z' },
    { id: '14', name: 'Power BI', category: 'Data Analysis & Visualization', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '15', name: 'Tableau', category: 'Data Analysis & Visualization', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '16', name: 'Python', category: 'Data Analysis & Visualization', level: 'Intermediate', createdAt: '2023-01-01T00:00:00Z' },
    { id: '17', name: 'SQL', category: 'Data Analysis & Visualization', level: 'Intermediate', createdAt: '2023-01-01T00:00:00Z' },
    { id: '18', name: 'Dashboard Design', category: 'Data Analysis & Visualization', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '19', name: 'Data Storytelling', category: 'Data Analysis & Visualization', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
    { id: '20', name: 'KPI Analysis', category: 'Data Analysis & Visualization', level: 'Advanced', createdAt: '2023-01-01T00:00:00Z' },
  ]);

  const [languages, setLanguages] = useState<LanguageData[]>([
    { id: '1', name: 'Arabic', proficiency: 'Native or Bilingual', createdAt: new Date().toISOString() },
    { id: '2', name: 'English', proficiency: 'Full Professional', createdAt: new Date().toISOString() },
  ]);

  // Dialog configurations
  const [editAboutOpen, setEditAboutOpen] = useState(false);
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [linkedInImportOpen, setLinkedInImportOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);

  // Resume export data definition
  const resumeData = {
    name: currentUser?.name || 'Ahmed Mahdy',
    title: currentUser?.position || 'UX Designer & Data Analyst',
    email: '',
    phone: maskPhoneNumber(contact.phone),
    linkedin: contact.linkedin,
    dribbble: contact.dribbble,
    about,
    employment: experiences
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(exp => ({
        position: exp.role,
        company: exp.company,
        period: exp.currentlyWorking ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`,
        contributions: exp.desc.split('.').filter(s => s.trim()).map(s => s.trim()),
      })),
    education: educations
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(edu => ({
        school: edu.school,
        degree: `${edu.degree}${edu.fieldOfStudy ? ', ' + edu.fieldOfStudy : ''}`,
        period: edu.currentlyStudying ? `${edu.startDate} - Present` : `${edu.startDate} - ${edu.endDate}`,
      })),
    certificates: certifications
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(cert => ({
        name: cert.title,
        issuer: cert.issuer,
        date: cert.issueDate + (cert.expiryDate ? ` - ${cert.expiryDate}` : ''),
        credentialId: cert.credentialId,
        link: cert.credentialUrl || '#',
      })),
    dataProjects: projects
      .filter(p => p.category.toLowerCase().includes('data'))
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(p => ({
        name: p.title,
        description: p.desc,
        link: p.url || '#',
      })),
    uxProjects: projects
      .filter(p => p.category.toLowerCase().includes('ux'))
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(p => ({
        name: p.title,
        description: p.desc,
        link: p.url || '#',
      })),
    skills: {
      coreUX: skills.filter(s => s.category === 'Core UX & Design').map(s => s.name),
      dataAnalysis: skills.filter(s => s.category.toLowerCase().includes('data')).map(s => s.name),
    },
  };

  const calculateCompletion = () => {
    let score = 10; // Default base score
    if (about.length > 50) score += 15;
    if (experiences.length > 0) score += 25;
    if (educations.length > 0) score += 20;
    if (projects.length > 0) score += 15;
    if (skills.length > 0) score += 10;
    if (languages.length > 0) score += 5;
    return Math.min(score, 100);
  };

  const handleExportResume = async () => {
    const element = resumeRef.current;
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
      const imgWidth = 8.5;
      const pageHeight = 11.0;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`Resume-${currentUser?.name || 'Employee'}.pdf`);
      toast.success('Successfully exported resume as PDF!');
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  // State Handler callbacks wrapped in useCallback to preserve ref equality
  const handleSaveExperience = useCallback((updated: ExperienceData) => {
    setExperiences(prev => {
      const exists = prev.some(e => e.id === updated.id);
      const next = exists ? prev.map(e => e.id === updated.id ? updated : e) : [...prev, updated];
      return next;
    });
    setLastUpdated(new Date().toISOString());
    toast.success('Work experience saved successfully');
  }, []);

  const handleMoveExperience = useCallback((id: string, dir: 'up' | 'down') => {
    setExperiences(prev => {
      const idx = prev.findIndex(e => e.id === id);
      if (idx === -1) return prev;
      if (dir === 'up' && idx === 0) return prev;
      if (dir === 'down' && idx === prev.length - 1) return prev;
      const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
      const next = [...prev];
      const tempOrder = next[idx].orderIndex;
      next[idx].orderIndex = next[targetIdx].orderIndex;
      next[targetIdx].orderIndex = tempOrder;
      return next;
    });
  }, []);

  const handleSaveEducation = useCallback((updated: EducationData) => {
    setEducations(prev => {
      const exists = prev.some(e => e.id === updated.id);
      return exists ? prev.map(e => e.id === updated.id ? updated : e) : [...prev, updated];
    });
    setLastUpdated(new Date().toISOString());
    toast.success('Education record saved successfully');
  }, []);

  const handleMoveEducation = useCallback((id: string, dir: 'up' | 'down') => {
    setEducations(prev => {
      const idx = prev.findIndex(e => e.id === id);
      if (idx === -1) return prev;
      if (dir === 'up' && idx === 0) return prev;
      if (dir === 'down' && idx === prev.length - 1) return prev;
      const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
      const next = [...prev];
      const tempOrder = next[idx].orderIndex;
      next[idx].orderIndex = next[targetIdx].orderIndex;
      next[targetIdx].orderIndex = tempOrder;
      return next;
    });
  }, []);

  const handleSaveProject = useCallback((updated: ProjectData) => {
    setProjects(prev => {
      const exists = prev.some(p => p.id === updated.id);
      return exists ? prev.map(p => p.id === updated.id ? updated : p) : [...prev, updated];
    });
    setLastUpdated(new Date().toISOString());
    toast.success('Project saved successfully');
  }, []);

  const handleMoveProject = useCallback((id: string, dir: 'up' | 'down') => {
    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === id);
      if (idx === -1) return prev;
      if (dir === 'up' && idx === 0) return prev;
      if (dir === 'down' && idx === prev.length - 1) return prev;
      const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
      const next = [...prev];
      const tempOrder = next[idx].orderIndex;
      next[idx].orderIndex = next[targetIdx].orderIndex;
      next[targetIdx].orderIndex = tempOrder;
      return next;
    });
  }, []);

  const handleSaveCertification = useCallback((updated: CertificationData) => {
    setCertifications(prev => {
      const exists = prev.some(c => c.id === updated.id);
      return exists ? prev.map(c => c.id === updated.id ? updated : c) : [...prev, updated];
    });
    setLastUpdated(new Date().toISOString());
    toast.success('Certification saved successfully');
  }, []);

  const handleMoveCertification = useCallback((id: string, dir: 'up' | 'down') => {
    setCertifications(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      if (dir === 'up' && idx === 0) return prev;
      if (dir === 'down' && idx === prev.length - 1) return prev;
      const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
      const next = [...prev];
      const tempOrder = next[idx].orderIndex;
      next[idx].orderIndex = next[targetIdx].orderIndex;
      next[targetIdx].orderIndex = tempOrder;
      return next;
    });
  }, []);

  const handleSaveSkill = useCallback((updated: SkillData) => {
    setSkills(prev => {
      const exists = prev.some(s => s.id === updated.id);
      return exists ? prev.map(s => s.id === updated.id ? updated : s) : [...prev, updated];
    });
    setLastUpdated(new Date().toISOString());
    toast.success('Skill saved successfully');
  }, []);

  const handleSaveLanguage = useCallback((updated: LanguageData) => {
    setLanguages(prev => {
      const exists = prev.some(l => l.id === updated.id);
      return exists ? prev.map(l => l.id === updated.id ? updated : l) : [...prev, updated];
    });
    setLastUpdated(new Date().toISOString());
    toast.success('Language saved successfully');
  }, []);

  // Deletion orchestrators
  const triggerDelete = useCallback((type: string, id: string, name: string) => {
    setDeleteTarget({ type, id, name });
  }, []);

  const confirmDeletion = () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    if (type === 'experience') setExperiences(prev => prev.filter(e => e.id !== id));
    if (type === 'education') setEducations(prev => prev.filter(e => e.id !== id));
    if (type === 'project') setProjects(prev => prev.filter(p => p.id !== id));
    if (type === 'certification') setCertifications(prev => prev.filter(c => c.id !== id));
    if (type === 'skill') setSkills(prev => prev.filter(s => s.id !== id));
    if (type === 'language') setLanguages(prev => prev.filter(l => l.id !== id));

    setDeleteTarget(null);
    setLastUpdated(new Date().toISOString());
    toast.success('Deleted item successfully');
  };

  const handleImportLinkedInData = (data: any) => {
    if (data.about) setAbout(data.about);
    if (data.experiences) setExperiences(data.experiences);
    if (data.educations) setEducations(data.educations);
    if (data.projects) setProjects(data.projects);
    if (data.certifications) setCertifications(data.certifications);
    if (data.skills) setSkills(data.skills);
    if (data.languages) setLanguages(data.languages);
    setLastUpdated(new Date().toISOString());
  };

  const completionScore = calculateCompletion();

  return (
    <section aria-labelledby="professional-profile-heading" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 id="professional-profile-heading" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground font-bold">Professional Profile</h3>
          <Button
            type="button"
            onClick={() => setLinkedInImportOpen(true)}
            className="rounded-[var(--radius-button)] bg-[#0077b5] hover:bg-[#006297] text-white flex items-center gap-1.5 min-h-9 px-3 text-sm font-semibold cursor-pointer"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span className="font-bold text-xs tracking-tight bg-white text-[#0077b5] w-4.5 h-4.5 rounded flex items-center justify-center">in</span>
            <span>Import from LinkedIn</span>
          </Button>
        </div>
        <p className="text-[var(--text-sm)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
          Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,380px)_1fr] xl:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Strength */}
          <div className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-base)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>Profile Strength</span>
              <span className="text-[var(--text-base)] font-[var(--font-weight-bold)] text-chart-3" style={{ fontFamily: "'Inter', sans-serif" }}>{completionScore}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div className="bg-chart-3 h-full rounded-full transition-all duration-500" style={{ width: `${completionScore}%` }} />
            </div>
            <p className="text-[var(--text-sm)] text-foreground mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              {completionScore === 100 ? 'Your profile is complete!' : 'Add more details to strengthen your profile'}
            </p>
          </div>

          {/* About */}
          <ProfileCard title="About Me" onEdit={() => setEditAboutOpen(true)}>
            <p className="text-[var(--text-base)] text-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{about}</p>
          </ProfileCard>

          {/* Contact Information */}
          <ProfileCard title="Contact Information" onEdit={() => setEditContactOpen(true)}>
            <div className="space-y-2.5 text-[var(--text-base)]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="flex items-center gap-2.5 text-foreground">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="inline-flex items-center rounded-[var(--radius-sm)] border border-border bg-muted/40 px-2.5 py-1 font-mono tracking-wide text-[var(--text-base)]">
                  {maskPhoneNumber(contact.phone)}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="break-all font-[var(--font-weight-semibold)]">{contact.email}</span>
              </div>
              {contact.linkedin && (
                <div className="flex items-center gap-2.5 text-foreground">
                  <span className="w-4 h-4 flex items-center justify-center font-bold text-xs tracking-tight bg-primary/20 text-foreground rounded">in</span>
                  <span className="break-all text-sm">{contact.linkedin}</span>
                </div>
              )}
              {contact.dribbble && (
                <div className="flex items-center gap-2.5 text-foreground">
                  <span className="w-4 h-4 flex items-center justify-center font-bold text-xs tracking-tight bg-primary/20 text-foreground rounded">Dr</span>
                  <span className="break-all text-sm">{contact.dribbble}</span>
                </div>
              )}
            </div>
          </ProfileCard>

          {/* Skills Section */}
          <SkillsSection
            skills={skills}
            searchQuery={searchQuery}
            onSave={handleSaveSkill}
            onDelete={(id, name) => triggerDelete('skill', id, name)}
          />

          {/* Languages Section */}
          <LanguagesSection
            languages={languages}
            searchQuery={searchQuery}
            onSave={handleSaveLanguage}
            onDelete={(id, name) => triggerDelete('language', id, name)}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Projects Section */}
          <ProjectsSection
            projects={projects}
            experiences={experiences}
            educations={educations}
            searchQuery={searchQuery}
            onSave={handleSaveProject}
            onDelete={(id, name) => triggerDelete('project', id, name)}
            onMove={handleMoveProject}
          />

          {/* Experience / Employment Section */}
          <ExperienceSection
            experiences={experiences}
            searchQuery={searchQuery}
            onSave={handleSaveExperience}
            onDelete={(id, name) => triggerDelete('experience', id, name)}
            onMove={handleMoveExperience}
          />

          {/* Education Section */}
          <EducationSection
            educations={educations}
            searchQuery={searchQuery}
            onSave={handleSaveEducation}
            onDelete={(id, name) => triggerDelete('education', id, name)}
            onMove={handleMoveEducation}
          />

          {/* Certifications Section */}
          <CertificationsSection
            certifications={certifications}
            searchQuery={searchQuery}
            onSave={handleSaveCertification}
            onDelete={(id, name) => triggerDelete('certification', id, name)}
            onMove={handleMoveCertification}
          />

          {/* Export Resume Button */}
          <div className="flex justify-end pt-1">
            <Button className="w-full sm:w-auto rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white gap-2 whitespace-nowrap min-h-11 px-6 text-base font-semibold" onClick={handleExportResume} style={{ fontFamily: "'Inter', sans-serif" }}>
              <Download className="w-5 h-5" /> Download PDF Resume
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden Resume for PDF export */}
      <div className="print-resume-wrapper">
        <Resume ref={resumeRef} {...resumeData} />
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-resume-wrapper, .print-resume-wrapper * {
            visibility: visible;
          }
          .print-resume-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>

      {/* Edit About Modal */}
      <EditAboutModal open={editAboutOpen} onOpenChange={setEditAboutOpen} data={about} onSave={setAbout} />

      {/* Edit Contact Modal */}
      <EditContactModal open={editContactOpen} onOpenChange={setEditContactOpen} data={contact} onSave={setContact} />

      {/* LinkedIn Import Modal */}
      <LinkedInImportModal open={linkedInImportOpen} onOpenChange={setLinkedInImportOpen} onImport={handleImportLinkedInData} />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Confirm Deletion"
        description={
          <>
            Are you sure you want to delete <span className="font-[var(--font-weight-semibold)] text-foreground">"{deleteTarget?.name}"</span>? This action cannot be undone.
          </>
        }
        onConfirm={confirmDeletion}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
};

const EditAboutModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; data: string; onSave: (v: string) => void }> = ({ open, onOpenChange, data, onSave }) => {
  const [text, setText] = useState(data);
  const maxChars = 1000;

  const handleSave = () => {
    onSave(text);
    onOpenChange(false);
    toast.success('About section updated successfully');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>Edit About</DialogTitle><DialogDescription className="sr-only">Edit about section</DialogDescription></DialogHeader>
        <div className="space-y-1.5">
          <label htmlFor="edit-about-textarea" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>About</label>
          <textarea id="edit-about-textarea" dir="auto" value={text} onChange={e => setText(e.target.value.slice(0, maxChars))} rows={5} className={cn(inputClass, 'h-auto py-3 text-[var(--text-base)]')} style={{ fontFamily: "'Inter', sans-serif" }} />
          <p className="text-[var(--text-sm)] text-muted-foreground text-end" style={{ fontFamily: "'Inter', sans-serif" }}>
            {text.length}/{maxChars} characters
          </p>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={handleSave} style={{ fontFamily: "'Inter', sans-serif" }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditContactModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; data: ContactData; onSave: (v: ContactData) => void }> = ({ open, onOpenChange, data, onSave }) => {
  const [email, setEmail] = useState(data.email);
  const [phone, setPhone] = useState(data.phone);
  const [linkedin, setLinkedin] = useState(data.linkedin);
  const [dribbble, setDribbble] = useState(data.dribbble || '');

  useEffect(() => {
    if (open) {
      setEmail(data.email);
      setPhone(data.phone);
      setLinkedin(data.linkedin);
      setDribbble(data.dribbble || '');
    }
  }, [open, data]);

  const handleSave = () => {
    if (!email || !phone) {
      toast.error('Email and phone are required');
      return;
    }
    onSave({ email, phone, linkedin, dribbble });
    onOpenChange(false);
    toast.success('Contact information updated successfully');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>Edit Contact Information</DialogTitle><DialogDescription className="sr-only">Edit contact</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <FormField label="Email *" value={email} onChange={setEmail} type="email" />
          <FormField label="Phone *" value={phone} onChange={setPhone} />
          <FormField label="LinkedIn Profile" value={linkedin} onChange={setLinkedin} />
          <FormField label="Dribbble Profile" value={dribbble} onChange={setDribbble} />
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={handleSave} style={{ fontFamily: "'Inter', sans-serif" }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
