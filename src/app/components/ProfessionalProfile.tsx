import React, { useEffect, useState, useRef } from 'react';
import {
  Pencil, Phone, Globe, Plus, ExternalLink, Download, X, Trash2, ChevronUp, ChevronDown, Star, Calendar, MapPin, Briefcase, GripVertical, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from './ui/dialog';
import React, { useEffect, useState, useRef } from 'react';
import {
  Pencil, Phone, Globe, Plus, ExternalLink, Download, X, Trash2, ChevronUp, ChevronDown, Star, Calendar, MapPin, Briefcase, GripVertical, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from './ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import { Resume } from './Resume';

// ── Shared styles ──
const inputClass = 'w-full h-[44px] px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-base)] text-start focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const labelClass = 'block text-start w-full text-[var(--text-base)] font-[var(--font-weight-medium)] text-foreground';
const iconButtonClass = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer';
const sectionIdFromTitle = (title: string) => `professional-profile-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
const maskPhoneNumber = (phone: string): string => {
  if (!phone || phone.includes('*')) return phone;
  return phone.replace(/(\+?\d{2,3}\s?\d{2,3}|0\d{2,3})([\s-]?\d+)(\d{3})$/, '$1 *** $3');
};
const normalizeExternalUrl = (url: string): string => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};
const openExternalLink = (url: string): void => {
  const normalizedUrl = normalizeExternalUrl(url);
  if (!normalizedUrl) return;
  window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
};
// ── Data Types ──
interface ExperienceData {
  id: string;
  company: string;
  role: string;
  employmentType: string;
  location: string;
  locationType: string; // On-site, Hybrid, Remote
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  desc: string;
  skillsUsed: string[];
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

interface EducationData {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  currentlyStudying: boolean;
  grade: string;
  activities: string; // Activities and Societies
  desc: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

interface ProjectData {
  id: string;
  title: string;
  category: string;
  role: string;
  issueDate: string;
  desc: string;
  toolsUsed: string[];
  url: string;
  associatedWith: string; // Linked to Experience company or Education school
  featured: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

interface CertificationData {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

interface SkillData {
  id: string;
  name: string;
  category: string;
  level: string;
  createdAt: string;
}

interface LanguageData {
  id: string;
  name: string;
  proficiency: string; // Elementary, Limited Working, Professional Working, Full Professional, Native or Bilingual
  createdAt: string;
}

interface ContactData {
  email: string;
  phone: string;
  linkedin: string;
  dribbble: string;
}

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
      return <div className="p-10 text-red-500 bg-red-100 rounded-lg whitespace-pre-wrap"><h1 className="text-xl font-bold mb-4">Something went wrong.</h1><p>{this.state.error?.toString()}</p><p className="mt-4 font-mono text-sm">{this.state.error?.stack}</p></div>;
    }
    return this.props.children;
  }
}

export const ProfessionalProfile: React.FC<{ currentUser: any }> = (props) => (
  <ErrorBoundary>
    <ProfessionalProfileContent {...props} />
  </ErrorBoundary>
);

const ProfessionalProfileContent: React.FC<{ currentUser: any }> = ({ currentUser }) => {
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
      startDate: 'Jan 2023',
      endDate: '',
      currentlyWorking: true,
      desc: 'Led UX/UI design for complex B2B and enterprise SaaS platforms, driving user-centric solutions. Established scalable design systems utilizing Figma, Adobe Creative Suite, and modern methodologies. Leveraged AI-powered design tools to accelerate rapid prototyping and UX research synthesis.',
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
      startDate: 'Jul 2018',
      endDate: 'Jan 2023',
      currentlyWorking: false,
      desc: 'Redesigned enterprise learning platforms and interfaces, increasing user engagement and training completion rates by 30%. Translated complex technical requirements into accessible, intuitive B2B e-learning experiences.',
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

  // Modal states
  const [editAboutOpen, setEditAboutOpen] = useState(false);
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [editExpOpen, setEditExpOpen] = useState(false);
  const [editEduOpen, setEditEduOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [editCertOpen, setEditCertOpen] = useState(false);
  const [editSkillOpen, setEditSkillOpen] = useState(false);
  const [editLangOpen, setEditLangOpen] = useState(false);
  const [linkedInImportOpen, setLinkedInImportOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Selected item for editing
  const [selectedExperience, setSelectedExperience] = useState<ExperienceData | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<EducationData | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [selectedCertification, setSelectedCertification] = useState<CertificationData | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);

  // Expanded states
  const [expandedExperiences, setExpandedExperiences] = useState<Set<string>>(new Set());

  // Handlers - Experience
  const handleEditExperience = (exp: ExperienceData) => {
    setSelectedExperience({ ...exp });
    setEditExpOpen(true);
  };

  const handleAddExperience = () => {
    const now = new Date().toISOString();
    setSelectedExperience({
      id: Date.now().toString(),
      company: '',
      role: '',
      employmentType: 'Full-time',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      desc: '',
      orderIndex: experiences.length,
      createdAt: now,
      updatedAt: now,
    });
    setEditExpOpen(true);
  };

  const handleSaveExperience = (data: ExperienceData) => {
    const updatedData = { ...data, updatedAt: new Date().toISOString() };
    if (experiences.find(e => e.id === data.id)) {
      setExperiences(experiences.map(e => e.id === data.id ? updatedData : e));
      toast.success('Experience updated successfully');
    } else {
      setExperiences([...experiences, updatedData]);
      toast.success('Experience added successfully');
    }
    setEditExpOpen(false);
    setLastUpdated(new Date().toISOString());
  };

  const handleDeleteExperience = (id: string) => {
    const exp = experiences.find(e => e.id === id);
    if (exp) {
      setDeleteTarget({ type: 'experience', id, name: `${exp.role} at ${exp.company}` });
      setDeleteConfirmOpen(true);
    }
  };

  const handleMoveExperience = (id: string, direction: 'up' | 'down') => {
    const index = experiences.findIndex(e => e.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === experiences.length - 1) return;

    const newExperiences = [...experiences];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newExperiences[index], newExperiences[targetIndex]] = [newExperiences[targetIndex], newExperiences[index]];
    newExperiences.forEach((exp, idx) => exp.orderIndex = idx);
    setExperiences(newExperiences);
    toast.success('Order updated');
  };

  // Handlers - Education
  const handleEditEducation = (edu: EducationData) => {
    setSelectedEducation({ ...edu });
    setEditEduOpen(true);
  };

  const handleAddEducation = () => {
    const now = new Date().toISOString();
    setSelectedEducation({
      id: Date.now().toString(),
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      currentlyStudying: false,
      grade: '',
      desc: '',
      orderIndex: educations.length,
      createdAt: now,
      updatedAt: now,
    });
    setEditEduOpen(true);
  };

  const handleSaveEducation = (data: EducationData) => {
    const updatedData = { ...data, updatedAt: new Date().toISOString() };
    if (educations.find(e => e.id === data.id)) {
      setEducations(educations.map(e => e.id === data.id ? updatedData : e));
      toast.success('Education updated successfully');
    } else {
      setEducations([...educations, updatedData]);
      toast.success('Education added successfully');
    }
    setEditEduOpen(false);
    setLastUpdated(new Date().toISOString());
  };

  const handleDeleteEducation = (id: string) => {
    const edu = educations.find(e => e.id === id);
    if (edu) {
      setDeleteTarget({ type: 'education', id, name: `${edu.degree} at ${edu.school}` });
      setDeleteConfirmOpen(true);
    }
  };

  const handleMoveEducation = (id: string, direction: 'up' | 'down') => {
    const index = educations.findIndex(e => e.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === educations.length - 1) return;

    const newEducations = [...educations];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newEducations[index], newEducations[targetIndex]] = [newEducations[targetIndex], newEducations[index]];
    newEducations.forEach((edu, idx) => edu.orderIndex = idx);
    setEducations(newEducations);
    toast.success('Order updated');
  };

  // Handlers - Project
  const handleEditProject = (proj: ProjectData) => {
    setSelectedProject({ ...proj });
    setEditProjectOpen(true);
  };

  const handleAddProject = () => {
    const now = new Date().toISOString();
    setSelectedProject({
      id: Date.now().toString(),
      title: '',
      category: 'UX Projects',
      role: '',
      issueDate: '',
      desc: '',
      toolsUsed: [],
      url: '',
      featured: false,
      orderIndex: projects.length,
      createdAt: now,
      updatedAt: now,
    });
    setEditProjectOpen(true);
  };

  const handleSaveProject = (data: ProjectData) => {
    const updatedData = { ...data, updatedAt: new Date().toISOString() };
    if (projects.find(p => p.id === data.id)) {
      setProjects(projects.map(p => p.id === data.id ? updatedData : p));
      toast.success('Project updated successfully');
    } else {
      setProjects([...projects, updatedData]);
      toast.success('Project added successfully');
    }
    setEditProjectOpen(false);
    setLastUpdated(new Date().toISOString());
  };

  const handleDeleteProject = (id: string) => {
    const proj = projects.find(p => p.id === id);
    if (proj) {
      setDeleteTarget({ type: 'project', id, name: proj.title });
      setDeleteConfirmOpen(true);
    }
  };

  const handleMoveProject = (id: string, direction: 'up' | 'down') => {
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];
    newProjects.forEach((proj, idx) => proj.orderIndex = idx);
    setProjects(newProjects);
    toast.success('Order updated');
  };

  // Handlers - Certification
  const handleEditCertification = (cert: CertificationData) => {
    setSelectedCertification(cert);
    setEditCertOpen(true);
  };

  const handleAddCertification = () => {
    const now = new Date().toISOString();
    setSelectedCertification({
      id: Date.now().toString(),
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      orderIndex: certifications.length,
      createdAt: now,
      updatedAt: now,
    });
    setEditCertOpen(true);
  };

  const handleSaveCertification = (data: CertificationData) => {
    const updatedData = { ...data, updatedAt: new Date().toISOString() };
    if (certifications.find(c => c.id === data.id)) {
      setCertifications(certifications.map(c => c.id === data.id ? updatedData : c));
      toast.success('Certification updated successfully');
    } else {
      setCertifications([...certifications, updatedData]);
      toast.success('Certification added successfully');
    }
    setEditCertOpen(false);
    setLastUpdated(new Date().toISOString());
  };

  const handleDeleteCertification = (id: string) => {
    const cert = certifications.find(c => c.id === id);
    if (cert) {
      setDeleteTarget({ type: 'certification', id, name: cert.title });
      setDeleteConfirmOpen(true);
    }
  };

  const handleMoveCertification = (id: string, direction: 'up' | 'down') => {
    const index = certifications.findIndex(c => c.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === certifications.length - 1) return;

    const newCertifications = [...certifications];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newCertifications[index], newCertifications[targetIndex]] = [newCertifications[targetIndex], newCertifications[index]];
    newCertifications.forEach((cert, idx) => cert.orderIndex = idx);
    setCertifications(newCertifications);
    toast.success('Order updated');
  };

  // Handlers - Skills
  const handleAddSkill = () => {
    const now = new Date().toISOString();
    setSelectedSkill({
      id: Date.now().toString(),
      name: '',
      category: 'Core UX & Design',
      level: 'Intermediate',
      createdAt: now,
    });
    setEditSkillOpen(true);
  };

  const handleEditSkill = (skill: SkillData) => {
    setSelectedSkill(skill);
    setEditSkillOpen(true);
  };

  const handleSaveSkill = (data: SkillData) => {
    if (skills.find(s => s.id === data.id)) {
      setSkills(skills.map(s => s.id === data.id ? data : s));
      toast.success('Skill updated successfully');
    } else {
      setSkills([...skills, data]);
      toast.success('Skill added successfully');
    }
    setEditSkillOpen(false);
    setLastUpdated(new Date().toISOString());
  };

  const handleDeleteSkill = (id: string) => {
    const skill = skills.find(s => s.id === id);
    if (skill) {
      setDeleteTarget({ type: 'skill', id, name: skill.name });
      setDeleteConfirmOpen(true);
    }
  };

  // Handlers - Languages
  const handleAddLanguage = () => {
    const now = new Date().toISOString();
    setSelectedLanguage({
      id: Date.now().toString(),
      name: '',
      proficiency: 'Professional Working',
      createdAt: now,
    });
    setEditLangOpen(true);
  };

  const handleEditLanguage = (lang: LanguageData) => {
    setSelectedLanguage(lang);
    setEditLangOpen(true);
  };

  const handleSaveLanguage = (data: LanguageData) => {
    if (languages.find(l => l.id === data.id)) {
      setLanguages(languages.map(l => l.id === data.id ? data : l));
      toast.success('Language updated successfully');
    } else {
      setLanguages([...languages, data]);
      toast.success('Language added successfully');
    }
    setEditLangOpen(false);
    setLastUpdated(new Date().toISOString());
  };

  const handleDeleteLanguage = (id: string) => {
    const lang = languages.find(l => l.id === id);
    if (lang) {
      setDeleteTarget({ type: 'language', id, name: lang.name });
      setDeleteConfirmOpen(true);
    }
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

  // Confirm Delete
  const confirmDelete = () => {
    if (!deleteTarget) return;

    switch (deleteTarget.type) {
      case 'experience':
        setExperiences(experiences.filter(e => e.id !== deleteTarget.id));
        toast.success('Experience deleted');
        break;
      case 'education':
        setEducations(educations.filter(e => e.id !== deleteTarget.id));
        toast.success('Education deleted');
        break;
      case 'project':
        setProjects(projects.filter(p => p.id !== deleteTarget.id));
        toast.success('Project deleted');
        break;
      case 'certification':
        setCertifications(certifications.filter(c => c.id !== deleteTarget.id));
        toast.success('Certification deleted');
        break;
      case 'skill':
        setSkills(skills.filter(s => s.id !== deleteTarget.id));
        toast.success('Skill deleted');
        break;
      case 'language':
        setLanguages(languages.filter(l => l.id !== deleteTarget.id));
        toast.success('Language deleted');
        break;
    }

    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
    setLastUpdated(new Date().toISOString());
  };

  const handleExportResume = async () => {
    if (!resumeRef.current) return;
    
    // Using native browser print to generate ATS-friendly, selectable PDF with working links
    window.print();
    toast.success('Print dialog opened. Save as PDF to download your resume.');
  };

  // Calculate profile completion
  const calculateCompletion = () => {
    let score = 0;
    if (about && about.length > 50) score += 15;
    if (contact.email && contact.phone) score += 10;
    if (experiences.length > 0) score += 25;
    if (educations.length > 0) score += 20;
    if (projects.length > 0) score += 15;
    if (certifications.length > 0) score += 10;
    if (skills.length >= 3) score += 5;
    return Math.min(score, 100);
  };

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

  const completionScore = calculateCompletion();

  const query = (searchQuery || '').toLowerCase().trim();

  const filteredExperiences = experiences.filter(exp => 
    !query || 
    exp.company.toLowerCase().includes(query) || 
    exp.role.toLowerCase().includes(query) || 
    exp.desc.toLowerCase().includes(query) || 
    (exp.skillsUsed || []).some(s => s.toLowerCase().includes(query))
  );

  const filteredEducations = educations.filter(edu => 
    !query || 
    edu.school.toLowerCase().includes(query) || 
    edu.degree.toLowerCase().includes(query) || 
    (edu.fieldOfStudy || '').toLowerCase().includes(query) || 
    (edu.activities || '').toLowerCase().includes(query) || 
    (edu.desc || '').toLowerCase().includes(query)
  );

  const filteredProjects = projects.filter(p => 
    !query || 
    p.title.toLowerCase().includes(query) || 
    p.role.toLowerCase().includes(query) || 
    p.desc.toLowerCase().includes(query) || 
    p.toolsUsed.some(t => t.toLowerCase().includes(query))
  );

  const filteredCertifications = certifications.filter(c => 
    !query || 
    c.title.toLowerCase().includes(query) || 
    c.issuer.toLowerCase().includes(query)
  );

  const filteredSkills = skills.filter(s => 
    !query || 
    s.name.toLowerCase().includes(query) || 
    s.category.toLowerCase().includes(query) || 
    s.level.toLowerCase().includes(query)
  );

  const filteredLanguages = languages.filter(l => 
    !query || 
    l.name.toLowerCase().includes(query) || 
    l.proficiency.toLowerCase().includes(query)
  );

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
        {/* Top/First Column content */}
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
              <div className="flex items-center gap-2.5 text-foreground"><Globe className="w-4 h-4 text-primary" /> <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="font-medium underline decoration-primary underline-offset-4 hover:text-primary">{contact.linkedin}<span className="sr-only"> opens in a new tab</span></a></div>
              <div className="flex items-center gap-2.5 text-foreground"><Globe className="w-4 h-4 text-primary" /> <a href={`https://${contact.dribbble}`} target="_blank" rel="noopener noreferrer" className="font-medium underline decoration-primary underline-offset-4 hover:text-primary">{contact.dribbble}<span className="sr-only"> opens in a new tab</span></a></div>
              <p className="text-[var(--text-sm)] text-muted-foreground">Email is hidden from the public profile and PDF export.</p>
            </div>
          </ProfileCard>

          {/* Certifications */}
          <ProfileCard title="Certifications" showAdd onAdd={handleAddCertification}>
            <div className="space-y-4">
              {filteredCertifications.sort((a, b) => a.orderIndex - b.orderIndex).map((cert, index) => (
                <CertificationItem
                  key={cert.id}
                  data={cert}
                  isFirst={index === 0}
                  isLast={index === certifications.length - 1}
                  onEdit={() => handleEditCertification(cert)}
                  onDelete={() => handleDeleteCertification(cert.id)}
                  onMove={(dir) => handleMoveCertification(cert.id, dir)}
                />
              ))}
            </div>
          </ProfileCard>

          {/* Skills */}
          <ProfileCard title="Skills" showAdd onAdd={handleAddSkill}>
            <div className="space-y-3">
              <div>
                <p className="text-[var(--text-base)] font-[var(--font-weight-semibold)] text-foreground mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Core UX & Design</p>
                <div className="flex flex-wrap gap-2">
                  {filteredSkills.filter(s => s.category.includes('UX')).map(s => (
                    <SkillBadge key={s.id} data={s} onEdit={() => handleEditSkill(s)} onDelete={() => handleDeleteSkill(s.id)} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[var(--text-base)] font-[var(--font-weight-semibold)] text-foreground mb-2 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>Data Analysis & Visualization</p>
                <div className="flex flex-wrap gap-2">
                  {filteredSkills.filter(s => s.category.includes('Data')).map(s => (
                    <SkillBadge key={s.id} data={s} onEdit={() => handleEditSkill(s)} onDelete={() => handleDeleteSkill(s.id)} />
                  ))}
                </div>
              </div>
            </div>
          </ProfileCard>

          {/* Languages */}
          <ProfileCard title="Languages" showAdd onAdd={handleAddLanguage}>
            <div className="space-y-4">
              {filteredLanguages.map((lang) => (
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
                    <button onClick={() => handleEditLanguage(lang)} className={iconButtonClass} aria-label={`Edit ${lang.name} language`} title="Edit"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteLanguage(lang.id)} className={cn(iconButtonClass, 'hover:bg-destructive/10 hover:text-destructive')} aria-label={`Delete ${lang.name} language`} title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </ProfileCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Projects */}
          <ProfileCard title="Projects" showAdd onAdd={handleAddProject}>
            <div className="space-y-4">
              {filteredProjects.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return a.orderIndex - b.orderIndex;
              }).map((proj, index) => (
                <ProjectItem
                  key={proj.id}
                  data={proj}
                  isFirst={index === 0}
                  isLast={index === projects.length - 1}
                  onEdit={() => handleEditProject(proj)}
                  onDelete={() => handleDeleteProject(proj.id)}
                  onMove={(dir) => handleMoveProject(proj.id, dir)}
                  experiences={experiences}
                  educations={educations}
                />
              ))}
            </div>
          </ProfileCard>

          {/* Experience */}
          <ProfileCard title="Employment" showAdd onAdd={handleAddExperience}>
            <div className="space-y-2">
              {filteredExperiences.sort((a, b) => a.orderIndex - b.orderIndex).map((exp, index) => (
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
                  onEdit={() => handleEditExperience(exp)}
                  onDelete={() => handleDeleteExperience(exp.id)}
                  onMove={(dir) => handleMoveExperience(exp.id, dir)}
                />
              ))}
            </div>
          </ProfileCard>

          {/* Education */}
          <ProfileCard title="Education" showAdd onAdd={handleAddEducation}>
            <div className="space-y-2">
              {filteredEducations.sort((a, b) => a.orderIndex - b.orderIndex).map((edu, index) => (
                <EducationItem
                  key={edu.id}
                  data={edu}
                  isFirst={index === 0}
                  isLast={index === educations.length - 1}
                  onEdit={() => handleEditEducation(edu)}
                  onDelete={() => handleDeleteEducation(edu.id)}
                  onMove={(dir) => handleMoveEducation(edu.id, dir)}
                />
              ))}
            </div>
          </ProfileCard>

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
          /* Hide the scrollbar in print mode */
          ::-webkit-scrollbar {
            display: none;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
        @media screen {
          .print-resume-wrapper {
            position: absolute;
            left: -9999px;
            top: 0;
          }
        }
      `}</style>

      {/* Edit Modals */}
      <EditAboutModal open={editAboutOpen} onOpenChange={setEditAboutOpen} data={about} onSave={setAbout} />
      <EditContactModal open={editContactOpen} onOpenChange={setEditContactOpen} data={contact} onSave={setContact} />
      {selectedExperience && <EditExperienceModal key={selectedExperience.id} open={editExpOpen} onOpenChange={setEditExpOpen} data={selectedExperience} onSave={handleSaveExperience} />}
      {selectedEducation && <EditEducationModal key={selectedEducation.id} open={editEduOpen} onOpenChange={setEditEduOpen} data={selectedEducation} onSave={handleSaveEducation} />}
      {selectedProject && <EditProjectModal key={selectedProject.id} open={editProjectOpen} onOpenChange={setEditProjectOpen} data={selectedProject} onSave={handleSaveProject} experiences={experiences} educations={educations} />}
      {selectedCertification && <EditCertificationModal key={selectedCertification.id} open={editCertOpen} onOpenChange={setEditCertOpen} data={selectedCertification} onSave={handleSaveCertification} />}
      {selectedSkill && <EditSkillModal key={selectedSkill.id} open={editSkillOpen} onOpenChange={setEditSkillOpen} data={selectedSkill} onSave={handleSaveSkill} />}
      {selectedLanguage && <EditLanguageModal key={selectedLanguage.id} open={editLangOpen} onOpenChange={setEditLangOpen} data={selectedLanguage} onSave={handleSaveLanguage} />}
      <LinkedInImportModal open={linkedInImportOpen} onOpenChange={setLinkedInImportOpen} onImport={handleImportLinkedInData} />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>Confirm Delete</DialogTitle>
            <DialogDescription className="text-[var(--text-sm)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              Are you sure you want to delete <span className="font-[var(--font-weight-semibold)] text-foreground">"{deleteTarget?.name}"</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
            <Button className="rounded-[var(--radius-button)] bg-destructive hover:bg-destructive/90 text-white" onClick={confirmDelete} style={{ fontFamily: "'Inter', sans-serif" }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

// ════════════════════════════════════
// ── Reusable Components ──
// ════════════════════════════════════

const ProfileCard: React.FC<{ title: string; children: React.ReactNode; onEdit?: () => void; showAdd?: boolean; onAdd?: () => void }> = ({ title, children, onEdit, showAdd, onAdd }) => {
  const headingId = sectionIdFromTitle(title);
  return (
  <section aria-labelledby={headingId} className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)] space-y-4">
    <div className="flex items-center justify-between border-b border-border pb-3">
      <span id={headingId} className="text-[var(--text-lg)] font-[var(--font-weight-bold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{title}</span>
      <div className="flex gap-1">
        {showAdd && <button onClick={onAdd} className={iconButtonClass} aria-label={`Add ${title}`}><Plus className="w-5 h-5" /></button>}
        {onEdit && <button onClick={onEdit} className={iconButtonClass} aria-label={`Edit ${title}`}><Pencil className="w-4 h-4" /></button>}
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
}> = ({ data, isFirst, isLast, expanded, onToggleExpand, onEdit, onDelete, onMove }) => {
  const descPreview = data.desc.length > 150 ? data.desc.substring(0, 150) + '...' : data.desc;

  // Split description by newlines or bullets if applicable
  const bullets = expanded
    ? data.desc.split('\n').filter(b => b.trim() !== '')
    : [descPreview];

  return (
    <div className="relative group space-y-3 pb-6">
      {/* Company Header with Logo */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-md border border-border bg-card shadow-sm flex flex-shrink-0 items-center justify-center font-bold text-muted-foreground text-lg uppercase">
          {data.company.charAt(0)}
        </div>
        <h3 className="text-base font-bold text-foreground">{data.company}</h3>
      </div>

      {/* Timeline and Job Details */}
      <div className="relative ps-5 ms-4 pb-1">
        {/* Timeline Line */}
        <div className="absolute start-0 top-[11px] bottom-0 w-px bg-border" />
        {/* Timeline Dot */}
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
              className="text-sm text-primary hover:underline mt-2 font-medium"
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
};

const EducationItem: React.FC<{
  data: EducationData;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (dir: 'up' | 'down') => void;
}> = ({ data, isFirst, isLast, onEdit, onDelete, onMove }) => (
  <div className="relative group space-y-3 pb-6">
    {/* School Header with Logo */}
    <div className="flex items-center gap-3 relative z-10">
      <div className="w-10 h-10 rounded-md border border-border bg-card shadow-sm flex flex-shrink-0 items-center justify-center font-bold text-muted-foreground text-lg uppercase">
        {data.school.charAt(0)}
      </div>
      <h3 className="text-base font-bold text-foreground">{data.school}</h3>
    </div>

    {/* Timeline and Details */}
    <div className="relative ps-5 ms-4 pb-1">
      {/* Timeline Line */}
      <div className="absolute start-0 top-[11px] bottom-0 w-px bg-border" />
      {/* Timeline Dot */}
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
);

const ProjectItem: React.FC<{
  data: ProjectData;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (dir: 'up' | 'down') => void;
  experiences: ExperienceData[];
  educations: EducationData[];
}> = ({ data, isFirst, isLast, onEdit, onDelete, onMove, experiences = [], educations = [] }) => {
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
};

const CertificationItem: React.FC<{
  data: CertificationData;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (dir: 'up' | 'down') => void;
}> = ({ data, isFirst, isLast, onEdit, onDelete, onMove }) => {
  const isExpired = data.expiryDate && new Date(data.expiryDate) < new Date();

  return (
    <div className="relative group space-y-1.5 pb-6 border-b border-border last:border-b-0 last:pb-0">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-bold text-foreground">{data.title}</h3>
        {isExpired && <span className="px-2 py-0.5 bg-[#FDECEC] text-[#7F1D1D] border border-[#B91C1C] rounded-full text-sm font-semibold">Expired</span>}
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
};const SkillBadge: React.FC<{ data: SkillData; onEdit: () => void; onDelete: () => void }> = ({ data, onEdit, onDelete }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-[#EEF2F7] text-[#334155] border-[#94A3B8]';
      case 'Intermediate': return 'bg-[#EAF2FF] text-[#1E3A8A] border-[#2563EB]';
      case 'Advanced': return 'bg-[#F3E8FF] text-[#581C87] border-[#7E22CE]';
      case 'Expert': return 'bg-[#E7F6EF] text-[#064E3B] border-[#047857]';
      default: return 'bg-[#EAF2FF] text-[#1E3A8A] border-[#2563EB]';
    }
  };

  return (
    <span
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEdit(); } }}
      className={cn("group relative min-h-9 w-fit rounded-full border px-4 py-1.5 text-[var(--text-sm)] font-[var(--font-weight-semibold)] inline-flex items-center justify-center gap-2.5 text-center leading-none cursor-pointer transition-all hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary whitespace-nowrap", getLevelColor(data.level))}
      onClick={onEdit}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="flex items-center gap-1.5 leading-none">
        <span className="font-[var(--font-weight-bold)]">{data.name}</span>
        <span className="text-[10px] sm:text-xs font-[var(--font-weight-medium)] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">{data.level}</span>
        <span className="text-[10px] sm:text-xs font-[var(--font-weight-normal)] opacity-75 border-s border-current/20 ps-1.5 leading-none">{data.category}</span>
      </div>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        aria-label={`Delete ${data.name} skill`}
        className="flex h-4 w-4 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100 hover:scale-110 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-1 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
};

// ════════════════════════════════════
// ── Edit Modals ──
// ════════════════════════════════════

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

const EditExperienceModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; data: ExperienceData; onSave: (v: ExperienceData) => void }> = ({ open, onOpenChange, data, onSave }) => {
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
      skillsUsed: skillsUsed.split(',').map(s => s.trim()).filter(s => s)
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>{data.company ? 'Edit' : 'Add'} Experience</DialogTitle><DialogDescription className="sr-only">Edit experience</DialogDescription></DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          <div className="md:col-span-2"><FormField label="Company *" value={company} onChange={setCompany} /></div>
          <div className="md:col-span-2"><FormField label="Job Title *" value={role} onChange={setRole} /></div>
          <div className="space-y-1.5">
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
          <div className="space-y-1.5">
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
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input id="currently-working-checkbox" type="checkbox" checked={currentlyWorking} onChange={e => setCurrentlyWorking(e.target.checked)} className="w-4.5 h-4.5 rounded border-border text-chart-3 focus:ring-2 focus:ring-ring/50" />
              <span className="text-[var(--text-base)] text-foreground font-[var(--font-weight-medium)]" style={{ fontFamily: "'Inter', sans-serif" }}>I currently work here</span>
            </label>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label htmlFor="experience-skills-used-input" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Skills Used (LinkedIn Sync)</label>
            <input id="experience-skills-used-input" type="text" value={skillsUsed} onChange={e => setSkillsUsed(e.target.value)} className={inputClass} placeholder="Separate with commas" style={{ fontFamily: "'Inter', sans-serif" }} />
            <p className="text-[var(--text-sm)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>e.g., Figma, Accessibility, UX Research</p>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Description</label>
            <textarea dir="auto" value={desc} onChange={e => setDesc(e.target.value)} rows={4} className={cn(inputClass, 'h-auto py-2')} style={{ fontFamily: "'Inter', sans-serif" }} />
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={handleSave} style={{ fontFamily: "'Inter', sans-serif" }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
const EditEducationModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; data: EducationData; onSave: (v: EducationData) => void }> = ({ open, onOpenChange, data, onSave }) => {
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
      desc
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>{data.school ? 'Edit' : 'Add'} Education</DialogTitle><DialogDescription className="sr-only">Edit education</DialogDescription></DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          <div className="md:col-span-2"><FormField label="School *" value={school} onChange={setSchool} /></div>
          <FormField label="Degree *" value={degree} onChange={setDegree} placeholder="e.g., Bachelor's" />
          <FormField label="Field of Study" value={fieldOfStudy} onChange={setFieldOfStudy} placeholder="e.g., Computer Science" />
          <FormField label="Start Date *" value={startDate} onChange={setStartDate} placeholder="e.g., Sep 2016" />
          <FormField label="End Date" value={endDate} onChange={setEndDate} placeholder="e.g., Jun 2020" disabled={currentlyStudying} />
          <FormField label="Grade" value={grade} onChange={setGrade} placeholder="e.g., Excellent, 3.8 GPA" />
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input id="currently-studying-checkbox" type="checkbox" checked={currentlyStudying} onChange={e => setCurrentlyStudying(e.target.checked)} className="w-4.5 h-4.5 rounded border-border text-chart-3 focus:ring-2 focus:ring-ring/50" />
              <span className="text-[var(--text-base)] text-foreground font-[var(--font-weight-medium)]" style={{ fontFamily: "'Inter', sans-serif" }}>I currently study here</span>
            </label>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label htmlFor="education-activities-input" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Activities and Societies (LinkedIn Sync)</label>
            <input id="education-activities-input" type="text" value={activities} onChange={e => setActivities(e.target.value)} className={inputClass} placeholder="e.g., Debate Club, Design Committee" style={{ fontFamily: "'Inter', sans-serif" }} />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Description (Optional)</label>
            <textarea dir="auto" value={desc} onChange={e => setDesc(e.target.value)} rows={3} className={cn(inputClass, 'h-auto py-2')} style={{ fontFamily: "'Inter', sans-serif" }} />
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={handleSave} style={{ fontFamily: "'Inter', sans-serif" }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
      featured
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>{data.title ? 'Edit' : 'Add'} Project</DialogTitle><DialogDescription className="sr-only">Edit project</DialogDescription></DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          <div className="md:col-span-2"><FormField label="Project Title *" value={title} onChange={setTitle} /></div>
          <div className="space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Category *</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border text-[var(--text-base)]" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="UX Projects">UX Projects</SelectItem>
                <SelectItem value="Data Analysis & Visualization Projects">Data Analysis & Visualization Projects</SelectItem>
                <SelectItem value="Research Projects">Research Projects</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label id="project-associated-label" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Associated With (LinkedIn Sync)</label>
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
          <div className="md:col-span-2 space-y-1.5">
            <label htmlFor="tools-used-input" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Tools Used</label>
            <input id="tools-used-input" type="text" value={toolsUsed} onChange={e => setToolsUsed(e.target.value)} className={inputClass} placeholder="Separate with commas" style={{ fontFamily: "'Inter', sans-serif" }} />
            <p className="text-[var(--text-sm)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>e.g., Figma, Adobe XD, User Research</p>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Description</label>
            <textarea dir="auto" value={desc} onChange={e => setDesc(e.target.value)} rows={4} className={cn(inputClass, 'h-auto py-2')} style={{ fontFamily: "'Inter', sans-serif" }} />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input id="featured-checkbox" type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4.5 h-4.5 rounded border-border text-chart-3 focus:ring-2 focus:ring-ring/50" />
              <span className="text-[var(--text-base)] text-foreground font-[var(--font-weight-medium)]" style={{ fontFamily: "'Inter', sans-serif" }}>Feature this project (pin to top)</span>
            </label>
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={handleSave} style={{ fontFamily: "'Inter', sans-serif" }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditCertificationModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; data: CertificationData; onSave: (v: CertificationData) => void }> = ({ open, onOpenChange, data, onSave }) => {
  const [title, setTitle] = useState(data.title);
  const [issuer, setIssuer] = useState(data.issuer);
  const [issueDate, setIssueDate] = useState(data.issueDate);
  const [expiryDate, setExpiryDate] = useState(data.expiryDate);
  const [credentialId, setCredentialId] = useState(data.credentialId);
  const [credentialUrl, setCredentialUrl] = useState(data.credentialUrl);

  const handleSave = () => {
    if (!title || !issuer || !issueDate) {
      toast.error('Title, issuer, and issue date are required');
      return;
    }
    onSave({ ...data, title, issuer, issueDate, expiryDate, credentialId, credentialUrl });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>{data.title ? 'Edit' : 'Add'} Certification</DialogTitle><DialogDescription className="sr-only">Edit certification</DialogDescription></DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          <div className="md:col-span-2"><FormField label="Certification Title *" value={title} onChange={setTitle} /></div>
          <FormField label="Issuer *" value={issuer} onChange={setIssuer} placeholder="e.g., Google" />
          <FormField label="Issue Date *" value={issueDate} onChange={setIssueDate} placeholder="e.g., Mar 2023" />
          <FormField label="Expiry Date" value={expiryDate} onChange={setExpiryDate} placeholder="e.g., Mar 2026 (Optional)" />
          <FormField label="Credential ID" value={credentialId} onChange={setCredentialId} placeholder="e.g., GDA-2023-001" />
          <div className="md:col-span-2"><FormField label="Credential URL" value={credentialUrl} onChange={setCredentialUrl} placeholder="https://" /></div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={handleSave} style={{ fontFamily: "'Inter', sans-serif" }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditSkillModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; data: SkillData; onSave: (v: SkillData) => void }> = ({ open, onOpenChange, data, onSave }) => {
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
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>{data.name ? 'Edit' : 'Add'} Skill</DialogTitle><DialogDescription className="sr-only">Edit skill</DialogDescription></DialogHeader>
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
                  <SelectItem value="custom" className="text-primary font-medium">Add new category...</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-1.5">
            <label id="proficiency-level-label" className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Proficiency Level</label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger aria-labelledby="proficiency-level-label" className="h-10 rounded-[var(--radius-input)] border-border text-[var(--text-base)]" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={handleSave} style={{ fontFamily: "'Inter', sans-serif" }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditLanguageModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; data: LanguageData; onSave: (v: LanguageData) => void }> = ({ open, onOpenChange, data, onSave }) => {
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
          <div className="space-y-1.5">
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
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={handleSave} style={{ fontFamily: "'Inter', sans-serif" }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface LinkedInImportModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onImport: (data: {
    about: string;
    experiences: ExperienceData[];
    educations: EducationData[];
    projects: ProjectData[];
    certifications: CertificationData[];
    skills: SkillData[];
    languages: LanguageData[];
  }) => void;
}

const LinkedInImportModal: React.FC<LinkedInImportModalProps> = ({ open, onOpenChange, onImport }) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'link'>('pdf');
  const [profileUrl, setProfileUrl] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsingStep, setParsingStep] = useState<number>(0);
  const [parsedData, setParsedData] = useState<any>(null);

  const simulateImport = () => {
    if (activeTab === 'link' && !profileUrl) {
      toast.error('Please enter a valid LinkedIn profile URL');
      return;
    }
    if (activeTab === 'pdf' && !fileName) {
      toast.error('Please choose a LinkedIn PDF resume export first');
      return;
    }

    setParsingStep(1);
    setTimeout(() => {
      setParsingStep(2);
      setTimeout(() => {
        setParsingStep(3);
        setTimeout(() => {
          const mockData = {
            about: "Experienced User Experience Designer & Instructional Tech Analyst with a demonstrated history of working in the information technology and energy management services. Skilled in Figma, Information Architecture, Usability Testing, Data Storytelling, and B2B SaaS system design.",
            experiences: [
              {
                id: 'li-exp-1',
                company: 'Advansys IS',
                role: 'Senior User Experience Designer',
                employmentType: 'Full-time',
                location: 'Cairo, Egypt',
                locationType: 'Hybrid',
                startDate: 'Jan 2023',
                endDate: '',
                currentlyWorking: true,
                desc: 'Created scalable enterprise design systems and structured UX blueprints. Synthesized complex B2B workflow requirements to optimize UI/UX efficiency. Integrated key analytics systems and metrics dashboards.',
                skillsUsed: ['Figma', 'Design Systems', 'Interaction Design', 'Accessibility'],
                orderIndex: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: 'li-exp-2',
                company: 'Schneider Electric',
                role: 'Instructional Designer',
                employmentType: 'Full-time',
                location: 'Cairo, Egypt',
                locationType: 'On-site',
                startDate: 'Jul 2018',
                endDate: 'Jan 2023',
                currentlyWorking: false,
                desc: 'Structured visual UX patterns for corporate LMS portals. Decreased bounce rates of training modules and increased user retention rates through interactive gamification.',
                skillsUsed: ['Instructional Design', 'User Research', 'Adobe Creative Suite'],
                orderIndex: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            ],
            educations: [
              {
                id: 'li-edu-1',
                school: 'Information Technology Institute (ITI)',
                degree: 'Postgraduate Diploma',
                fieldOfStudy: 'Instructional Technology',
                startDate: 'Sep 2016',
                endDate: 'Jun 2017',
                currentlyStudying: false,
                grade: 'Excellent',
                activities: 'UX Design Student Union',
                desc: 'Focused on UI design models and pedagogical application architectures.',
                orderIndex: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            ],
            projects: [
              {
                id: 'li-proj-1',
                title: 'Haj Arafa E-Commerce Platform',
                category: 'UX Projects',
                role: 'Lead UX Designer',
                issueDate: '2024',
                desc: 'Re-engineered product flows and search filters to double user checkout completion rate. Fully translated system features to support proper Arabic/English mirroring.',
                toolsUsed: ['Figma', 'Usability Testing', 'React'],
                url: 'https://hajaraja.com',
                associatedWith: 'exp-1',
                featured: true,
                orderIndex: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            ],
            certifications: [
              {
                id: 'li-cert-1',
                title: 'Google Professional UX Design Certificate',
                issuer: 'Google',
                issueDate: 'Jul 2022',
                expiryDate: '',
                credentialId: 'GUXD-2022-005',
                credentialUrl: 'https://coursera.org/verify/guxd-2022',
                orderIndex: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            ],
            skills: [
              { id: 'li-sk-1', name: 'Interaction Design', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-2', name: 'Information Architecture', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-3', name: 'Accessibility', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-4', name: 'Figma', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
            ],
            languages: [
              { id: 'li-lang-1', name: 'Arabic', proficiency: 'Native or Bilingual', createdAt: new Date().toISOString() },
              { id: 'li-lang-2', name: 'English', proficiency: 'Full Professional', createdAt: new Date().toISOString() }
            ]
          };
          setParsedData(mockData);
          setParsingStep(4);
        }, 1200);
      }, 1000);
    }, 800);
  };

  const handleFinish = () => {
    if (parsedData) {
      onImport(parsedData);
      toast.success('Successfully synchronized profile with LinkedIn data!');
      onOpenChange(false);
      setParsingStep(0);
      setParsedData(null);
      setFileName(null);
      setProfileUrl('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)] flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="bg-[#0077b5] text-white p-1 rounded font-bold text-sm tracking-tight">in</span>
            Import Profile from LinkedIn
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-[var(--text-sm)]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Sync your profile with LinkedIn to maintain ATS compatibility and avoid manual data entry.
          </DialogDescription>
        </DialogHeader>

        {parsingStep === 0 && (
          <div className="space-y-6 py-4">
            <div className="flex border-b border-border">
              <button
                type="button"
                onClick={() => setActiveTab('pdf')}
                className={cn("pb-2.5 px-4 font-[var(--font-weight-medium)] text-[var(--text-sm)] border-b-2 transition-colors", activeTab === 'pdf' ? "border-chart-3 text-chart-3 font-[var(--font-weight-bold)]" : "border-transparent text-muted-foreground")}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                LinkedIn PDF Export / Resume
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('link')}
                className={cn("pb-2.5 px-4 font-[var(--font-weight-medium)] text-[var(--text-sm)] border-b-2 transition-colors", activeTab === 'link' ? "border-chart-3 text-chart-3 font-[var(--font-weight-bold)]" : "border-transparent text-muted-foreground")}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Public Profile URL
              </button>
            </div>

            {activeTab === 'pdf' ? (
              <div className="space-y-4">
                <p className="text-[var(--text-sm)] text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  To export your profile: Go to your LinkedIn profile page, click <strong>"More"</strong>, and choose <strong>"Save to PDF"</strong>. Then upload the downloaded PDF here.
                </p>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/40 hover:bg-muted/65 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileName(e.target.files[0].name);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="bg-chart-3/10 text-chart-3 p-3 rounded-full">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </span>
                    <span className="font-[var(--font-weight-medium)] text-[var(--text-base)]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {fileName ? fileName : "Upload LinkedIn PDF"}
                    </span>
                    <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>PDF format up to 5MB</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <FormField
                  label="LinkedIn Profile URL"
                  value={profileUrl}
                  onChange={setProfileUrl}
                  placeholder="https://www.linkedin.com/in/username"
                />
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                  e.g., https://linkedin.com/in/creativemahdy
                </p>
              </div>
            )}

            <DialogFooter className="pt-4 gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
              <Button className="rounded-[var(--radius-button)] bg-[#0077b5] hover:bg-[#006297] text-white flex items-center gap-1.5" onClick={simulateImport} style={{ fontFamily: "'Inter', sans-serif" }}>
                <span>Import Profile</span>
              </Button>
            </DialogFooter>
          </div>
        )}

        {parsingStep > 0 && parsingStep < 4 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-chart-3/20 border-t-chart-3 rounded-full animate-spin"></div>
              <span className="absolute text-xs font-bold text-chart-3">in</span>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-[var(--font-weight-semibold)] text-[var(--text-lg)] animate-pulse" style={{ fontFamily: "'Inter', sans-serif" }}>
                {parsingStep === 1 && "Connecting to LinkedIn Gateway..."}
                {parsingStep === 2 && "Extracting experience and profile headers..."}
                {parsingStep === 3 && "Building ATS schema & mapping skills..."}
              </h3>
              <p className="text-[var(--text-sm)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>Please keep this modal open. This will take a few seconds.</p>
            </div>
          </div>
        )}

        {parsingStep === 4 && parsedData && (
          <div className="space-y-6 py-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-lg p-4 text-[var(--text-sm)] text-emerald-800 dark:text-emerald-300" style={{ fontFamily: "'Inter', sans-serif" }}>
              <strong>LinkedIn import ready!</strong> We parsed {parsedData.experiences.length} Experiences, {parsedData.educations.length} Education items, {parsedData.projects.length} Projects, and {parsedData.skills.length} Skills. Review them below before merging.
            </div>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 border border-border p-3 rounded-lg bg-muted/20">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Summary / About</span>
                <p className="text-[var(--text-sm)] line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>{parsedData.about}</p>
              </div>
              <hr className="border-border" />
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Experiences</span>
                {parsedData.experiences.map((exp: any) => (
                  <div key={exp.id} className="text-[var(--text-sm)]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <div className="font-semibold">{exp.role} at {exp.company}</div>
                    <div className="text-xs text-muted-foreground">{exp.startDate} - Present | {exp.locationType}</div>
                  </div>
                ))}
              </div>
              <hr className="border-border" />
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Educations</span>
                {parsedData.educations.map((edu: any) => (
                  <div key={edu.id} className="text-[var(--text-sm)]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <div className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</div>
                    <div className="text-xs text-muted-foreground">{edu.school} ({edu.grade})</div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button variant="outline" onClick={() => setParsingStep(0)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Back</Button>
              <Button className="rounded-[var(--radius-button)] bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleFinish} style={{ fontFamily: "'Inter', sans-serif" }}>Merge & Sync Profile</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Form field helper
const FormField: React.FC<{ id?: string; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean }> = ({ id, label, value, onChange, type = 'text', placeholder, disabled }) => {
  const inputId = id || `input-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>{label}</label>
      <input id={inputId} type={type} value={value} onChange={e => onChange(e.target.value)} className={inputClass} placeholder={placeholder} disabled={disabled} style={{ fontFamily: "'Inter', sans-serif" }} />
    </div>
  );
};
