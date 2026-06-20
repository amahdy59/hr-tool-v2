import React, { useEffect, useState, useRef } from 'react';
import {
  Pencil, Mail, Phone, Globe, Plus, ExternalLink, Download, X, Trash2, ChevronUp, ChevronDown, Star, Calendar, MapPin, Briefcase, GripVertical, ChevronRight,
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ── Shared styles ──
const inputClass = 'w-full h-10 px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const labelClass = 'text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground';
const maskPhoneNumber = (phone: string): string => {
  if (!phone || phone.includes('*')) return phone;
  return phone.replace(/(\+?\d{2,3}\s?\d{2,3}|0\d{2,3})([\s-]?\d+)(\d{3})$/, '$1 *** $3');
};

// ── Data Types ──
interface ExperienceData {
  id: string;
  company: string;
  role: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  desc: string;
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

interface ContactData {
  email: string;
  phone: string;
  linkedin: string;
  dribbble: string;
}

export const ProfessionalProfile: React.FC<{ currentUser: any }> = ({ currentUser }) => {
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

  // Modal states
  const [editAboutOpen, setEditAboutOpen] = useState(false);
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [editExpOpen, setEditExpOpen] = useState(false);
  const [editEduOpen, setEditEduOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [editCertOpen, setEditCertOpen] = useState(false);
  const [editSkillOpen, setEditSkillOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Selected item for editing
  const [selectedExperience, setSelectedExperience] = useState<ExperienceData | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<EducationData | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [selectedCertification, setSelectedCertification] = useState<CertificationData | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
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
    setSelectedProject(proj);
    setEditProjectOpen(true);
  };

  const handleAddProject = () => {
    const now = new Date().toISOString();
    setSelectedProject({
      id: Date.now().toString(),
      title: '',
      category: 'Data Analysis',
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
    }

    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
    setLastUpdated(new Date().toISOString());
  };

  const handleExportResume = async () => {
    if (!resumeRef.current) return;

    toast.success('Generating your resume...');

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const totalPdfHeight = imgHeight * ratio;

      let heightLeft = totalPdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - totalPdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${currentUser?.name || 'Resume'}_Resume.pdf`);

      toast.success('Resume downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate resume');
    }
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
    email: contact.email,
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
        link: cert.credentialUrl || '#',
      })),
    dataProjects: projects
      .filter(p => p.category === 'Data Analysis')
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(p => ({
        name: p.title,
        description: p.desc,
        link: p.url || '#',
      })),
    uxProjects: projects
      .filter(p => p.category === 'UX Design')
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(p => ({
        name: p.title,
        description: p.desc,
        link: p.url || '#',
      })),
    skills: {
      coreUX: skills.filter(s => s.category === 'Core UX & Design').map(s => s.name),
      dataAnalysis: skills.filter(s => s.category === 'Data Analysis').map(s => s.name),
    },
  };

  const completionScore = calculateCompletion();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Professional Profile</h3>
        <p className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
          Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 items-start">
        {/* Top/First Column content */}
        <div className="space-y-6">
          {/* Profile Strength */}
          <div className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>Profile Strength</span>
              <span className="text-[var(--text-sm)] font-[var(--font-weight-bold)] text-chart-3" style={{ fontFamily: "'Inter', sans-serif" }}>{completionScore}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div className="bg-chart-3 h-full rounded-full transition-all duration-500" style={{ width: `${completionScore}%` }} />
            </div>
            <p className="text-[var(--text-xs)] text-muted-foreground mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              {completionScore === 100 ? 'Your profile is complete!' : 'Add more details to strengthen your profile'}
            </p>
          </div>

          {/* About */}
          <ProfileCard title="About Me" onEdit={() => setEditAboutOpen(true)}>
            <p className="text-[var(--text-sm)] text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{about}</p>
          </ProfileCard>

          {/* Contact Information */}
          <ProfileCard title="Contact Information" onEdit={() => setEditContactOpen(true)}>
            <div className="space-y-2.5 text-[var(--text-sm)]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="flex items-center gap-2.5 text-primary"><Mail className="w-4 h-4" /> <span>{contact.email}</span></div>
              <div className="flex items-center gap-2.5 text-foreground">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="inline-flex items-center rounded-[var(--radius-sm)] border border-border bg-muted/40 px-2 py-0.5 font-mono tracking-wide">
                  {maskPhoneNumber(contact.phone)}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-primary"><Globe className="w-4 h-4" /> <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{contact.linkedin}</a></div>
              <div className="flex items-center gap-2.5 text-primary"><Globe className="w-4 h-4" /> <a href={`https://${contact.dribbble}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{contact.dribbble}</a></div>
            </div>
          </ProfileCard>

          {/* Certifications */}
          <ProfileCard title="Certifications" showAdd onAdd={handleAddCertification}>
            <div className="space-y-4">
              {certifications.sort((a, b) => a.orderIndex - b.orderIndex).map((cert, index) => (
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
                <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Core UX & Design</p>
                <div className="flex flex-wrap gap-2">
                  {skills.filter(s => s.category.includes('UX')).map(s => (
                    <SkillBadge key={s.id} data={s} onEdit={() => handleEditSkill(s)} onDelete={() => handleDeleteSkill(s.id)} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground mb-2 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>Data Analysis & Visualization</p>
                <div className="flex flex-wrap gap-2">
                  {skills.filter(s => s.category.includes('Data')).map(s => (
                    <SkillBadge key={s.id} data={s} onEdit={() => handleEditSkill(s)} onDelete={() => handleDeleteSkill(s.id)} />
                  ))}
                </div>
              </div>
            </div>
          </ProfileCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Projects */}
          <ProfileCard title="Projects" showAdd onAdd={handleAddProject}>
            <div className="space-y-4">
              {projects.sort((a, b) => {
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
                />
              ))}
            </div>
          </ProfileCard>

          {/* Experience */}
          <ProfileCard title="Employment" showAdd onAdd={handleAddExperience}>
            <div className="space-y-2">
              {experiences.sort((a, b) => a.orderIndex - b.orderIndex).map((exp, index) => (
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
              {educations.sort((a, b) => a.orderIndex - b.orderIndex).map((edu, index) => (
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
          <div className="flex justify-end pt-4">
            <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white gap-2" onClick={handleExportResume} style={{ fontFamily: "'Inter', sans-serif" }}>
              <Download className="w-4 h-4" /> Download PDF Resume
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden Resume for PDF export */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <Resume ref={resumeRef} {...resumeData} />
      </div>

      {/* Edit Modals */}
      <EditAboutModal open={editAboutOpen} onOpenChange={setEditAboutOpen} data={about} onSave={setAbout} />
      <EditContactModal open={editContactOpen} onOpenChange={setEditContactOpen} data={contact} onSave={setContact} />
      {selectedExperience && <EditExperienceModal key={selectedExperience.id} open={editExpOpen} onOpenChange={setEditExpOpen} data={selectedExperience} onSave={handleSaveExperience} />}
      {selectedEducation && <EditEducationModal key={selectedEducation.id} open={editEduOpen} onOpenChange={setEditEduOpen} data={selectedEducation} onSave={handleSaveEducation} />}
      {selectedProject && <EditProjectModal open={editProjectOpen} onOpenChange={setEditProjectOpen} data={selectedProject} onSave={handleSaveProject} />}
      {selectedCertification && <EditCertificationModal open={editCertOpen} onOpenChange={setEditCertOpen} data={selectedCertification} onSave={handleSaveCertification} />}
      {selectedSkill && <EditSkillModal open={editSkillOpen} onOpenChange={setEditSkillOpen} data={selectedSkill} onSave={handleSaveSkill} />}

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
    </div>
  );
};

// ════════════════════════════════════
// ── Reusable Components ──
// ════════════════════════════════════

const ProfileCard: React.FC<{ title: string; children: React.ReactNode; onEdit?: () => void; showAdd?: boolean; onAdd?: () => void }> = ({ title, children, onEdit, showAdd, onAdd }) => (
  <div className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)] space-y-4">
    <div className="flex items-center justify-between border-b border-border pb-2.5">
      <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{title}</span>
      <div className="flex gap-1">
        {showAdd && <button onClick={onAdd} className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><Plus className="w-4 h-4" /></button>}
        {onEdit && <button onClick={onEdit} className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><Pencil className="w-4 h-4" /></button>}
      </div>
    </div>
    {children}
  </div>
);

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
      <div className="relative ps-5 ms-4 border-s border-border">
        {/* Timeline Dot */}
        <div className="absolute -start-[5px] top-[6px] w-2.5 h-2.5 bg-muted-foreground rounded-full" />

        <div className="space-y-2">
          <p className="text-sm font-bold text-foreground pt-0.5">{data.role}</p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground">
            <span>{data.currentlyWorking ? `${data.startDate} - Present` : `${data.startDate} - ${data.endDate}`}</span>
            {data.location && (
              <>
                <span className="w-1 h-1 bg-muted-foreground rounded-full mx-0.5" />
                <span>{data.location}</span>
              </>
            )}
            <span className="w-1 h-1 bg-muted-foreground rounded-full mx-0.5" />
            <span>{data.employmentType}</span>
          </div>

          {data.desc && (
            <ul className="space-y-2 pt-2 list-disc ps-4 text-sm text-foreground/90 marker:text-primary">
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
              className="text-xs text-primary hover:underline mt-2 font-medium"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>

      <div className="absolute top-0 right-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-card/80 backdrop-blur-sm p-1 rounded-md">
        {!isFirst && <button onClick={() => onMove('up')} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Move up"><ChevronUp className="w-4 h-4" /></button>}
        {!isLast && <button onClick={() => onMove('down')} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Move down"><ChevronDown className="w-4 h-4" /></button>}
        <button onClick={onEdit} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Edit"><Pencil className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-1.5 hover:bg-destructive/10 rounded-sm text-muted-foreground hover:text-destructive transition-colors cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
    <div className="relative ps-5 ms-4 border-s border-border">
      {/* Timeline Dot */}
      <div className="absolute -start-[5px] top-[6px] w-2.5 h-2.5 bg-muted-foreground rounded-full" />

      <div className="space-y-2">
        <p className="text-sm font-bold text-foreground pt-0.5">{data.degree}{data.fieldOfStudy && `, ${data.fieldOfStudy}`}</p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground">
          <span>{data.currentlyStudying ? `${data.startDate} - Present` : `${data.startDate} - ${data.endDate}`}</span>
          {data.grade && (
            <>
              <span className="w-1 h-1 bg-muted-foreground rounded-full mx-0.5" />
              <span>{data.grade}</span>
            </>
          )}
        </div>
      </div>
    </div>

    <div className="absolute top-0 right-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-card/80 backdrop-blur-sm p-1 rounded-md">
      {!isFirst && <button onClick={() => onMove('up')} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Move up"><ChevronUp className="w-4 h-4" /></button>}
      {!isLast && <button onClick={() => onMove('down')} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Move down"><ChevronDown className="w-4 h-4" /></button>}
      <button onClick={onEdit} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Edit"><Pencil className="w-4 h-4" /></button>
      <button onClick={onDelete} className="p-1.5 hover:bg-destructive/10 rounded-sm text-muted-foreground hover:text-destructive transition-colors cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
}> = ({ data, isFirst, isLast, onEdit, onDelete, onMove }) => (
  <div className="relative group space-y-2 pb-6 border-b border-border last:border-b-0 last:pb-0">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-1">
        <h3 className="text-base font-bold text-foreground">{data.title}</h3>
        {data.featured && <span title="Featured project"><Star className="w-4 h-4 text-[#0F766E] fill-[#0F766E] dark:text-[#2DD4BF] dark:fill-[#2DD4BF]" /></span>}
      </div>
      <span className="px-3 py-1 bg-muted/50 text-muted-foreground rounded-full text-xs font-medium shrink-0 w-fit">
        {data.category}
      </span>
    </div>
    <p className="text-sm text-muted-foreground">
      {data.role} • {data.issueDate}
    </p>
    <p className="text-sm text-foreground/90 leading-relaxed pt-1">
      {data.desc}
    </p>
    {data.toolsUsed.length > 0 && (
      <div className="flex flex-wrap gap-2 pt-2">
        {data.toolsUsed.map((tool, idx) => (
          <span key={idx} className="px-2.5 py-1 bg-[#EFF6FF] text-[#1D4ED8] dark:bg-[#1E3A8A]/30 dark:text-[#93C5FD] rounded text-xs font-medium">
            {tool}
          </span>
        ))}
      </div>
    )}
    {data.url && (
      <div className="pt-3">
        <Button variant="outline" size="sm" asChild className="gap-2 text-sm font-medium hover:bg-muted">
          <a href={data.url} target="_blank" rel="noopener noreferrer">
            View Project <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </Button>
      </div>
    )}
    <div className="absolute top-0 right-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-card/80 backdrop-blur-sm p-1 rounded-md">
      {!isFirst && <button onClick={() => onMove('up')} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Move up"><ChevronUp className="w-4 h-4" /></button>}
      {!isLast && <button onClick={() => onMove('down')} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Move down"><ChevronDown className="w-4 h-4" /></button>}
      <button onClick={onEdit} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Edit"><Pencil className="w-4 h-4" /></button>
      <button onClick={onDelete} className="p-1.5 hover:bg-destructive/10 rounded-sm text-muted-foreground hover:text-destructive transition-colors cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
    </div>
  </div>
);

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
        {isExpired && <span className="px-2 py-0.5 bg-[#FDECEC] text-[#7F1D1D] border border-[#B91C1C] rounded-full text-xs font-semibold">Expired</span>}
      </div>
      <p className="text-sm text-muted-foreground">{data.issuer}</p>
      <p className="text-sm text-muted-foreground pt-1">
        Issued {data.issueDate}{data.expiryDate && ` • Expires ${data.expiryDate}`}
        {data.credentialId && ` • ID: ${data.credentialId}`}
      </p>
      {data.credentialUrl && (
        <div className="pt-3">
          <Button variant="outline" size="sm" asChild className="gap-2 text-sm font-medium hover:bg-muted">
            <a href={data.credentialUrl} target="_blank" rel="noopener noreferrer">
              Show Credential <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>
      )}
      <div className="absolute top-0 right-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-card/80 backdrop-blur-sm p-1 rounded-md">
        {!isFirst && <button onClick={() => onMove('up')} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Move up"><ChevronUp className="w-4 h-4" /></button>}
        {!isLast && <button onClick={() => onMove('down')} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Move down"><ChevronDown className="w-4 h-4" /></button>}
        <button onClick={onEdit} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Edit"><Pencil className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-1.5 hover:bg-destructive/10 rounded-sm text-muted-foreground hover:text-destructive transition-colors cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

const SkillBadge: React.FC<{ data: SkillData; onEdit: () => void; onDelete: () => void }> = ({ data, onEdit, onDelete }) => {
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
      className={cn("group relative px-3 py-1.5 rounded-full border text-[var(--text-xs)] font-[var(--font-weight-semibold)] flex items-center gap-1.5 cursor-pointer transition-all hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary whitespace-nowrap", getLevelColor(data.level))}
      onClick={onEdit}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {data.name}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        aria-label={`Delete ${data.name} skill`}
        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-1 rounded-full"
      >
        <X className="w-3 h-3" />
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
          <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>About</label>
          <textarea value={text} onChange={e => setText(e.target.value.slice(0, maxChars))} rows={5} className={cn(inputClass, 'h-auto py-2')} style={{ fontFamily: "'Inter', sans-serif" }} />
          <p className="text-[var(--text-xs)] text-muted-foreground text-end" style={{ fontFamily: "'Inter', sans-serif" }}>
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
  const [startDate, setStartDate] = useState(data.startDate);
  const [endDate, setEndDate] = useState(data.endDate);
  const [currentlyWorking, setCurrentlyWorking] = useState(data.currentlyWorking);
  const [desc, setDesc] = useState(data.desc);

  useEffect(() => {
    if (!open) return;
    setCompany(data.company);
    setRole(data.role);
    setEmploymentType(data.employmentType);
    setLocation(data.location);
    setStartDate(data.startDate);
    setEndDate(data.endDate);
    setCurrentlyWorking(data.currentlyWorking);
    setDesc(data.desc);
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
      startDate,
      endDate: currentlyWorking ? '' : endDate,
      currentlyWorking,
      desc
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
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Employment Type</label>
            <Select value={employmentType} onValueChange={setEmploymentType}>
              <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormField label="Location" value={location} onChange={setLocation} placeholder="e.g., Cairo, Egypt" />
          <FormField label="Start Date *" value={startDate} onChange={setStartDate} placeholder="e.g., Jan 2023" />
          <FormField label="End Date" value={endDate} onChange={setEndDate} placeholder="e.g., Dec 2024" disabled={currentlyWorking} />
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={currentlyWorking} onChange={e => setCurrentlyWorking(e.target.checked)} className="w-4 h-4 rounded border-border text-chart-3 focus:ring-2 focus:ring-ring/50" />
              <span className="text-[var(--text-sm)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>I currently work here</span>
            </label>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} className={cn(inputClass, 'h-auto py-2')} style={{ fontFamily: "'Inter', sans-serif" }} />
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
              <input type="checkbox" checked={currentlyStudying} onChange={e => setCurrentlyStudying(e.target.checked)} className="w-4 h-4 rounded border-border text-chart-3 focus:ring-2 focus:ring-ring/50" />
              <span className="text-[var(--text-sm)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>I currently study here</span>
            </label>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Description (Optional)</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className={cn(inputClass, 'h-auto py-2')} style={{ fontFamily: "'Inter', sans-serif" }} />
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

const EditProjectModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; data: ProjectData; onSave: (v: ProjectData) => void }> = ({ open, onOpenChange, data, onSave }) => {
  const [title, setTitle] = useState(data.title);
  const [category, setCategory] = useState(data.category);
  const [role, setRole] = useState(data.role);
  const [issueDate, setIssueDate] = useState(data.issueDate);
  const [desc, setDesc] = useState(data.desc);
  const [toolsUsed, setToolsUsed] = useState(data.toolsUsed.join(', '));
  const [url, setUrl] = useState(data.url);
  const [featured, setFeatured] = useState(data.featured);

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
              <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                <SelectItem value="UX Design">UX Design</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormField label="Your Role" value={role} onChange={setRole} placeholder="e.g., UX Designer" />
          <FormField label="Issue Date" value={issueDate} onChange={setIssueDate} placeholder="e.g., 2024" />
          <FormField label="Project URL" value={url} onChange={setUrl} placeholder="https://" />
          <div className="md:col-span-2 space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Tools Used</label>
            <input type="text" value={toolsUsed} onChange={e => setToolsUsed(e.target.value)} className={inputClass} placeholder="Separate with commas" style={{ fontFamily: "'Inter', sans-serif" }} />
            <p className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>e.g., Figma, Adobe XD, User Research</p>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} className={cn(inputClass, 'h-auto py-2')} style={{ fontFamily: "'Inter', sans-serif" }} />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 rounded border-border text-chart-3 focus:ring-2 focus:ring-ring/50" />
              <span className="text-[var(--text-sm)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>Feature this project (pin to top)</span>
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
  const [name, setName] = useState(data.name);
  const [category, setCategory] = useState(data.category);
  const [level, setLevel] = useState(data.level);

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
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Category *</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="Core UX & Design">Core UX & Design</SelectItem>
                <SelectItem value="Data Analysis">Data Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Proficiency Level</label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
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

// Form field helper
const FormField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean }> = ({ label, value, onChange, type = 'text', placeholder, disabled }) => (
  <div className="space-y-1.5">
    <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className={inputClass} placeholder={placeholder} disabled={disabled} style={{ fontFamily: "'Inter', sans-serif" }} />
  </div>
);
