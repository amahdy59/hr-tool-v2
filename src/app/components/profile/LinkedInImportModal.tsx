import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ExperienceData, EducationData, ProjectData, CertificationData, SkillData, LanguageData } from './Types';

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

export const LinkedInImportModal: React.FC<LinkedInImportModalProps> = ({ open, onOpenChange, onImport }) => {
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
                title: 'Google Data Analytics Certificate',
                issuer: 'Google',
                issueDate: 'Mar 2023',
                expiryDate: '',
                credentialId: 'GDA-2023-001',
                credentialUrl: 'https://www.coursera.org/account/accomplishments/professional-cert/0OYUGNC1DRF5',
                orderIndex: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: 'li-cert-2',
                title: 'Tableau Business Intelligence Analyst',
                issuer: 'Tableau',
                issueDate: 'Jan 2023',
                expiryDate: '',
                credentialId: 'TBI-2023-002',
                credentialUrl: 'https://www.coursera.org/account/accomplishments/professional-cert/JQPVYZ6VYF52',
                orderIndex: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: 'li-cert-3',
                title: 'Excel Skills for Data Analytics and Visualization',
                issuer: 'Microsoft',
                issueDate: 'Nov 2022',
                expiryDate: '',
                credentialId: 'MSFT-2022-003',
                credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/5XR5AHBP79KW',
                orderIndex: 2,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: 'li-cert-4',
                title: 'Excel Skills for Business',
                issuer: 'Microsoft',
                issueDate: 'Sep 2022',
                expiryDate: '',
                credentialId: 'MSFT-2022-004',
                credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/DCL8H4YT5UWG',
                orderIndex: 3,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: 'li-cert-5',
                title: 'Google UX Design Certificate',
                issuer: 'Google',
                issueDate: 'Jul 2022',
                expiryDate: '',
                credentialId: 'GUXD-2022-005',
                credentialUrl: 'https://www.coursera.org/account/accomplishments/professional-cert/49PCMPYYGLJV',
                orderIndex: 4,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            ],
            skills: [
              { id: 'li-sk-1', name: 'Interaction Design', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-2', name: 'Information Architecture', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-3', name: 'User Research', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-4', name: 'Usability Testing', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-5', name: 'Wireframing', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-6', name: 'Prototyping', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-7', name: 'Figma', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-8', name: 'Design Systems', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-9', name: 'Accessibility', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-10', name: 'Enterprise & SaaS Design', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-11', name: 'Adobe Creative Suite', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-12', name: 'AI Design Tools', category: 'Core UX & Design', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-13', name: 'Microsoft Excel (Advanced)', category: 'Data Analysis & Visualization', level: 'Expert', createdAt: new Date().toISOString() },
              { id: 'li-sk-14', name: 'Power BI', category: 'Data Analysis & Visualization', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-15', name: 'Tableau', category: 'Data Analysis & Visualization', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-16', name: 'Python', category: 'Data Analysis & Visualization', level: 'Intermediate', createdAt: new Date().toISOString() },
              { id: 'li-sk-17', name: 'SQL', category: 'Data Analysis & Visualization', level: 'Intermediate', createdAt: new Date().toISOString() },
              { id: 'li-sk-18', name: 'Dashboard Design', category: 'Data Analysis & Visualization', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-19', name: 'Data Storytelling', category: 'Data Analysis & Visualization', level: 'Advanced', createdAt: new Date().toISOString() },
              { id: 'li-sk-20', name: 'KPI Analysis', category: 'Data Analysis & Visualization', level: 'Advanced', createdAt: new Date().toISOString() },
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
                className={cn("pb-2.5 px-4 font-[var(--font-weight-medium)] text-[var(--text-sm)] border-b-2 transition-colors cursor-pointer", activeTab === 'pdf' ? "border-chart-3 text-chart-3 font-[var(--font-weight-bold)]" : "border-transparent text-muted-foreground")}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                LinkedIn PDF Export / Resume
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('link')}
                className={cn("pb-2.5 px-4 font-[var(--font-weight-medium)] text-[var(--text-sm)] border-b-2 transition-colors cursor-pointer", activeTab === 'link' ? "border-chart-3 text-chart-3 font-[var(--font-weight-bold)]" : "border-transparent text-muted-foreground")}
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
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button className="bg-[#0077b5] hover:bg-[#006297] text-white flex items-center gap-1.5" onClick={simulateImport}>
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
              <Button variant="outline" onClick={() => setParsingStep(0)}>Back</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleFinish}>Merge & Sync Profile</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
