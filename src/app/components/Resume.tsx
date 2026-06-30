import React from 'react';
import { Globe, Linkedin, Phone } from 'lucide-react';
import { LtrInlineText } from './profile/ltrContent';

interface ResumeProps {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  linkedin: string;
  dribbble?: string;
  about: string;
  employment: Array<{
    position: string;
    company: string;
    period: string;
    contributions: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    period: string;
  }>;
  certificates: Array<{
    name: string;
    issuer?: string;
    date?: string;
    credentialId?: string;
    link?: string;
  }>;
  dataProjects: Array<{
    name: string;
    description: string;
    link?: string;
  }>;
  uxProjects: Array<{
    name: string;
    description: string;
    link?: string;
  }>;
  skills: {
    coreUX: string[];
    dataAnalysis: string[];
  };
}

const normalizeLink = (url?: string) => {
  if (!url || url === '#') return '#';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      margin: '0 0 9px',
      color: '#0F172A',
      fontSize: '12px',
      fontWeight: 800,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      borderBottom: '1px solid #CBD5E1',
      paddingBottom: '6px',
    }}
  >
    {children}
  </h2>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '999px',
      background: '#EFF6FF',
      color: '#1D4ED8',
      fontSize: '10px',
      fontWeight: 700,
      margin: '0 5px 6px 0',
      lineHeight: 1.2,
    }}
  >
    {children}
  </span>
);

export const Resume = React.forwardRef<HTMLDivElement, ResumeProps>(
  ({ name, title, phone, linkedin, dribbble, about, employment, education, certificates, dataProjects, uxProjects, skills }, ref) => {
    const allProjects = [
      ...uxProjects.map(project => ({ ...project, category: 'UX' })),
      ...dataProjects.map(project => ({ ...project, category: 'Data' })),
    ];

    return (
      <div
        ref={ref}
        style={{
          width: '100%',
          maxWidth: '210mm',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          padding: '38px 40px',
          color: '#1E293B',
          boxSizing: 'border-box',
        }}
      >
        <header style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '28px', alignItems: 'start', marginBottom: '22px' }}>
          <div>
            <h1 style={{ fontSize: '34px', lineHeight: 1, fontWeight: 850, margin: '0 0 8px', color: '#0F172A', letterSpacing: '-0.03em' }}>
              {name}
            </h1>
            <p style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px', color: '#1D4ED8' }}>
              {title}
            </p>
            <div>
              <Pill>UX Design</Pill>
              <Pill>Data Visualization</Pill>
              <Pill>Dashboard Design</Pill>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '11px', lineHeight: 1.35, color: '#334155' }}>
            {phone && (
              <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                <Phone style={{ width: '13px', height: '13px', color: '#64748B', flexShrink: 0 }} />
                <LtrInlineText style={{ fontSize: '11px', lineHeight: 1.35, color: '#334155' }}>{phone}</LtrInlineText>
              </div>
            )}
            {linkedin && (
              <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                <Linkedin style={{ width: '13px', height: '13px', color: '#64748B', flexShrink: 0 }} />
                <LtrInlineText as="a" href={normalizeLink(linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: '#1D4ED8', textDecoration: 'none', fontSize: '11px', lineHeight: 1.35 }}>
                  {linkedin}
                </LtrInlineText>
              </div>
            )}
            {dribbble && (
              <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                <Globe style={{ width: '13px', height: '13px', color: '#64748B', flexShrink: 0 }} />
                <LtrInlineText as="a" href={normalizeLink(dribbble)} target="_blank" rel="noopener noreferrer" style={{ color: '#1D4ED8', textDecoration: 'none', fontSize: '11px', lineHeight: 1.35 }}>
                  {dribbble}
                </LtrInlineText>
              </div>
            )}
          </div>
        </header>

        {about && (
          <section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '13px 15px', marginBottom: '18px' }}>
            <p style={{ fontSize: '12px', lineHeight: 1.55, color: '#334155', margin: 0 }}>
              {about}
            </p>
          </section>
        )}

        <main style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', columnGap: '26px', alignItems: 'start' }}>
          <div>
            {employment.length > 0 && (
              <section style={{ marginBottom: '18px' }}>
                <SectionTitle>Employment</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                  {employment.map((job, idx) => (
                    <div key={idx} style={{ breakInside: 'avoid' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '3px' }}>
                        <h3 style={{ fontSize: '13px', lineHeight: 1.25, fontWeight: 800, color: '#0F172A', margin: 0 }}>{job.position}</h3>
                        <span style={{ fontSize: '10px', color: '#64748B', whiteSpace: 'nowrap', marginTop: '2px' }}>{job.period}</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#1D4ED8', fontWeight: 700, margin: '0 0 5px' }}>{job.company}</p>
                      <ul style={{ margin: 0, paddingLeft: '15px', color: '#475569' }}>
                        {job.contributions.slice(0, 2).map((contribution, i) => (
                          <li key={i} style={{ fontSize: '11px', lineHeight: 1.45, marginBottom: '3px' }}>
                            {contribution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {allProjects.length > 0 && (
              <section style={{ marginBottom: '18px' }}>
                <SectionTitle>Selected Projects</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 14px' }}>
                  {allProjects.map((project, idx) => (
                    <div key={idx} style={{ breakInside: 'avoid' }}>
                      <a href={normalizeLink(project.link)} target="_blank" rel="noopener noreferrer" style={{ color: '#0F172A', fontSize: '12px', fontWeight: 800, lineHeight: 1.25, textDecoration: 'none' }}>
                        {project.name}
                      </a>
                      <p style={{ color: '#1D4ED8', fontSize: '9px', fontWeight: 800, letterSpacing: '0.08em', margin: '3px 0 4px', textTransform: 'uppercase' }}>
                        {project.category}
                      </p>
                      <p style={{ fontSize: '10.5px', lineHeight: 1.4, color: '#475569', margin: 0 }}>
                        {project.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside>
            {(skills.coreUX.length > 0 || skills.dataAnalysis.length > 0) && (
              <section style={{ marginBottom: '18px' }}>
                <SectionTitle>Skills</SectionTitle>
                {skills.coreUX.length > 0 && (
                  <div style={{ marginBottom: '10px' }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 800, color: '#0F172A' }}>Core UX & Design</h3>
                    <p style={{ margin: 0, color: '#475569', fontSize: '10.5px', lineHeight: 1.5 }}>{skills.coreUX.join(', ')}</p>
                  </div>
                )}
                {skills.dataAnalysis.length > 0 && (
                  <div>
                    <h3 style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 800, color: '#0F172A' }}>Data Analysis & Visualization</h3>
                    <p style={{ margin: 0, color: '#475569', fontSize: '10.5px', lineHeight: 1.5 }}>{skills.dataAnalysis.join(', ')}</p>
                  </div>
                )}
              </section>
            )}

            {certificates.length > 0 && (
              <section style={{ marginBottom: '18px' }}>
                <SectionTitle>Certifications</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  {certificates.map((cert, idx) => (
                    <div key={idx} style={{ breakInside: 'avoid' }}>
                      <a href={normalizeLink(cert.link)} target="_blank" rel="noopener noreferrer" style={{ color: '#0F172A', textDecoration: 'none', fontSize: '10.5px', lineHeight: 1.35, fontWeight: 700 }}>
                        {cert.name}
                      </a>
                      {(cert.issuer || cert.date) && (
                        <p style={{ margin: '2px 0 0', fontSize: '9px', color: '#64748B' }}>
                          {cert.issuer}{cert.issuer && cert.date ? ' • ' : ''}{cert.date}
                        </p>
                      )}
                      {cert.credentialId && (
                        <p style={{ margin: '1px 0 0', fontSize: '8px', color: '#94A3B8' }}>
                          ID: {cert.credentialId}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section>
                <SectionTitle>Education</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {education.map((edu, idx) => (
                    <div key={idx}>
                      <h3 style={{ fontSize: '11px', lineHeight: 1.3, fontWeight: 800, color: '#0F172A', margin: '0 0 3px' }}>{edu.degree}</h3>
                      <p style={{ fontSize: '10.5px', lineHeight: 1.35, color: '#475569', margin: '0 0 2px' }}>{edu.school}</p>
                      <p style={{ fontSize: '9.5px', color: '#64748B', margin: 0 }}>{edu.period}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </main>
      </div>
    );
  }
);

Resume.displayName = 'Resume';
