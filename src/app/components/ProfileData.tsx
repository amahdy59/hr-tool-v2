// Profile Data Management Hook
import { useState } from 'react';

export interface ExperienceData {
  id: string;
  company: string;
  role: string;
  period: string;
  desc: string;
}

export interface EducationData {
  id: string;
  school: string;
  degree: string;
  period: string;
}

export interface ProjectData {
  id: string;
  title: string;
  date: string;
  desc: string;
}

export interface CertificationData {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface ContactData {
  email: string;
  phone: string;
  linkedin: string;
}

export const useProfileData = () => {
  const [about, setAbout] = useState(
    'UX Designer & Data Analyst with 4+ years of experience turning user and business needs into clear dashboards and user-centered digital experiences. Skilled in exploring data, building insightful visualizations, and designing intuitive, accessible interfaces that support decision-making. Proficient in Excel, Power BI, and Tableau, and currently growing technical depth with Python.'
  );

  const [contact, setContact] = useState<ContactData>({
    email: 'ahmed.mahdy@advansys-is.com',
    phone: '01500590111',
    linkedin: 'linkedin.com/in/creativemahdy',
  });

  const [experiences, setExperiences] = useState<ExperienceData[]>([
    {
      id: '1',
      company: 'Advansys IS',
      role: 'User Experience Designer',
      period: 'Jan 2023 - Present',
      desc: 'Analyze user needs and goals. Create wireframes and prototypes. Focus on clarity, usability, and aesthetics. Collaborate closely with teams.',
    },
    {
      id: '2',
      company: 'Schneider Electric',
      role: 'Instructional Designer',
      period: 'July 2018 - Jan 2023',
      desc: 'Design engaging e-learning activities. Collaborate with subject matter experts. Adapt content for online delivery. Develop multimedia assets for interactive learning. Enhance learner engagement through visual and instructional design.',
    },
  ]);

  const [educations, setEducations] = useState<EducationData[]>([
    {
      id: '1',
      school: 'Information Technology Institute (ITI)',
      degree: 'Diploma of Education/Instructional Technology',
      period: 'Sep 2016 - Jun 2017',
    },
    {
      id: '2',
      school: 'Minufiya University',
      degree: "Bachelor's degree, Radio and Television",
      period: 'Sep 2009 - Jun 2013',
    },
  ]);

  const [projects, setProjects] = useState<ProjectData[]>([
    {
      id: '1',
      title: 'A Data-Driven LEGO Explorer',
      date: 'Data Analysis Project',
      desc: 'This visualization allows users to explore LEGO sets based on various criteria, such as theme, age, price, and number of pieces in a modern easy to use look.',
    },
    {
      id: '2',
      title: 'Sales Performance Dashboard',
      date: 'Data Analysis Project',
      desc: 'An interactive CRM Sales Dashboard in Google Sheets for sales managers to track quarterly team performance, including data preparation, pivot-table exploration, and chart-based visualization.',
    },
    {
      id: '3',
      title: 'People Tool',
      date: 'UX Project',
      desc: 'I contributed to revamping an outdated internal HR tool, transforming it into a modern, user-friendly platform.',
    },
  ]);

  const [certifications, setCertifications] = useState<CertificationData[]>([
    { id: '1', title: 'Google Data Analytics', issuer: 'Google', date: 'Certificate' },
    { id: '2', title: 'Tableau Business Intelligence Analyst', issuer: 'Tableau', date: 'Certificate' },
    { id: '3', title: 'Excel for Data Analytics and Visualization', issuer: 'Microsoft', date: 'Certificate' },
    { id: '4', title: 'Excel Skills for Business', issuer: 'Microsoft', date: 'Certificate' },
    { id: '5', title: 'Google UX Design', issuer: 'Google', date: 'Certificate' },
    { id: '6', title: 'Robotic Process Automation (RPA)', issuer: 'Certification Provider', date: 'Certificate' },
  ]);

  const [skills, setSkills] = useState<string[]>([
    'Interaction & Visual Design',
    'Information Architecture',
    'Microsoft Excel (Advanced)',
    'Microsoft Power BI',
    'Tableau',
  ]);

  // Update functions
  const updateAbout = (newAbout: string) => setAbout(newAbout);
  
  const updateContact = (newContact: ContactData) => setContact(newContact);

  const updateExperience = (id: string, updated: Partial<ExperienceData>) => {
    setExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, ...updated } : exp));
  };

  const updateEducation = (id: string, updated: Partial<EducationData>) => {
    setEducations(prev => prev.map(edu => edu.id === id ? { ...edu, ...updated } : edu));
  };

  const updateProject = (id: string, updated: Partial<ProjectData>) => {
    setProjects(prev => prev.map(proj => proj.id === id ? { ...proj, ...updated } : proj));
  };

  const updateCertification = (id: string, updated: Partial<CertificationData>) => {
    setCertifications(prev => prev.map(cert => cert.id === id ? { ...cert, ...updated } : cert));
  };

  const updateSkills = (newSkills: string[]) => setSkills(newSkills);

  return {
    about,
    contact,
    experiences,
    educations,
    projects,
    certifications,
    skills,
    updateAbout,
    updateContact,
    updateExperience,
    updateEducation,
    updateProject,
    updateCertification,
    updateSkills,
  };
};
