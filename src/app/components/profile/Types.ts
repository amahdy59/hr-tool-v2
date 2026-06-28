export interface ExperienceData {
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

export interface EducationData {
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

export interface ProjectData {
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

export interface CertificationData {
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

export interface SkillData {
  id: string;
  name: string;
  category: string;
  level: string;
  createdAt: string;
}

export interface LanguageData {
  id: string;
  name: string;
  proficiency: string; // Elementary, Limited Working, Professional Working, Full Professional, Native or Bilingual
  createdAt: string;
}

export interface ContactData {
  email: string;
  phone: string;
  linkedin: string;
  dribbble: string;
}
