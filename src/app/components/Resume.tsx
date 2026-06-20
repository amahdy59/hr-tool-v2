import React from 'react';
import { Mail, Linkedin, Globe } from 'lucide-react';

interface ResumeProps {
  name: string;
  title: string;
  email: string;
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

export const Resume = React.forwardRef<HTMLDivElement, ResumeProps>(
  ({ name, title, email, phone, linkedin, dribbble, about, employment, education, certificates, dataProjects, uxProjects, skills }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: '794px',
          minHeight: '1123px', // A4 min height
          backgroundColor: '#FFFFFF',
          fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          padding: '60px 40px',
          margin: 0,
          color: '#1a1a1a',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 700, margin: '0 0 8px 0', color: '#1a1a1a', letterSpacing: '-0.5px' }}>
              {name}
            </h1>
            <p style={{ fontSize: '18px', fontWeight: 400, margin: '0 0 16px 0', color: '#4a4a4a' }}>
              {title}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ padding: '4px 12px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '13px', color: '#4a4a4a' }}>
                UX Design
              </span>
              <span style={{ padding: '4px 12px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '13px', color: '#4a4a4a' }}>
                Data Visualization
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#1a1a1a', marginTop: '8px' }}>
            {email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail style={{ width: '16px', height: '16px', color: '#4a4a4a' }} />
                <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{email}</a>
              </div>
            )}
            {linkedin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Linkedin style={{ width: '16px', height: '16px', color: '#4a4a4a' }} />
                <a href={`https://${linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{linkedin}</a>
              </div>
            )}
            {dribbble && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe style={{ width: '16px', height: '16px', color: '#4a4a4a' }} />
                <a href={`https://${dribbble}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{dribbble}</a>
              </div>
            )}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0 0 32px 0' }} />

        {/* Content wrapper */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* ABOUT ME */}
          {about && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                About Me
              </h2>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#4a4a4a', margin: 0 }}>
                {about}
              </p>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {certificates && certificates.length > 0 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Certifications
              </h2>
              <ul style={{ margin: 0, paddingLeft: '24px', color: '#4a4a4a' }}>
                {certificates.map((cert, idx) => (
                  <li key={idx} style={{ marginBottom: '12px' }}>
                    <a href={cert.link || '#'} target="_blank" rel="noopener noreferrer" style={{ fontSize: '15px', color: '#1a1a1a', textDecoration: 'underline', fontWeight: 500 }}>
                      {cert.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PROJECTS */}
          {(uxProjects?.length > 0 || dataProjects?.length > 0) && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Projects
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {uxProjects?.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px 0', color: '#1a1a1a' }}>
                      UX Projects
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {uxProjects.map((project, idx) => (
                        <div key={idx}>
                          <a href={project.link || '#'} target="_blank" rel="noopener noreferrer" style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline', display: 'inline-block', marginBottom: '4px' }}>
                            {project.name}
                          </a>
                          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4a4a4a', margin: 0 }}>
                            {project.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {dataProjects?.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px 0', color: '#1a1a1a' }}>
                      Data Analysis & Visualization Projects
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {dataProjects.map((project, idx) => (
                        <div key={idx}>
                          <a href={project.link || '#'} target="_blank" rel="noopener noreferrer" style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline', display: 'inline-block', marginBottom: '4px' }}>
                            {project.name}
                          </a>
                          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4a4a4a', margin: 0 }}>
                            {project.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SKILLS */}
          {skills && (skills.coreUX?.length > 0 || skills.dataAnalysis?.length > 0) && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Skills
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {skills.coreUX?.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', color: '#1a1a1a' }}>
                      Core UX & Design
                    </h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#1a1a1a', margin: 0 }}>
                      {skills.coreUX.join(', ')}
                    </p>
                  </div>
                )}
                {skills.dataAnalysis?.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', color: '#1a1a1a' }}>
                      Data Analysis & Visualization
                    </h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#1a1a1a', margin: 0 }}>
                      {skills.dataAnalysis.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EMPLOYMENT */}
          {employment && employment.length > 0 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Employment
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {employment.map((job, idx) => (
                  <div key={idx}>
                    <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#1a1a1a', margin: '0 0 4px 0' }}>
                      <span style={{ color: '#1a1a1a' }}>{job.company}</span>
                    </h3>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px 0' }}>
                      {job.position}
                    </h4>
                    <p style={{ fontSize: '13px', color: '#4a4a4a', margin: '0 0 12px 0' }}>
                      {job.period}
                    </p>
                    {job.contributions && job.contributions.length > 0 && (
                      <ul style={{ margin: 0, paddingLeft: '20px', color: '#4a4a4a' }}>
                        {job.contributions.map((contribution, i) => (
                          <li key={i} style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
                            {contribution}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {education && education.length > 0 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Education
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#1a1a1a', margin: '0 0 4px 0' }}>
                      {edu.school}
                    </h3>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px 0' }}>
                      {edu.degree}
                    </h4>
                    <p style={{ fontSize: '13px', color: '#4a4a4a', margin: 0 }}>
                      {edu.period}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    );
  }
);

Resume.displayName = 'Resume';
