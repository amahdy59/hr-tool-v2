import React from 'react';
import { Mail, Phone, Linkedin } from 'lucide-react';

interface ResumeProps {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
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
  ({ name, title, email, phone, linkedin, about, employment, education, certificates, dataProjects, uxProjects, skills }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: '794px',
          minHeight: '1123px',
          backgroundColor: '#FFFFFF',
          fontFamily: "'IBM Plex Sans', sans-serif",
          padding: 0,
          margin: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#1D8AC7',
            padding: '28px 40px',
            color: '#FFFFFF',
          }}
        >
          <h1
            style={{
              fontSize: '40px',
              fontWeight: 700,
              margin: 0,
              marginBottom: '6px',
              color: '#FFFFFF',
              letterSpacing: '0.5px',
            }}
          >
            {name}
          </h1>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 400,
              margin: 0,
              marginBottom: '0px',
              color: '#FFFFFF',
            }}
          >
            {title}
          </p>
        </div>

        {/* Contact Bar */}
        <div
          style={{
            backgroundColor: '#1D8AC7',
            padding: '0 40px 20px 40px',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              <span style={{ fontSize: '14px' }}>{email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Linkedin style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', textDecoration: 'underline' }}>{linkedin}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              <span style={{ fontSize: '14px' }}>{phone}</span>
            </div>
          </div>
        </div>

        {/* Content - Two Column Layout */}
        <div style={{ display: 'flex', padding: '36px 40px', gap: '40px' }}>
          {/* Left Column */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* About me */}
            <div style={{ marginBottom: '28px' }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#000000',
                  margin: 0,
                  marginBottom: '12px',
                }}
              >
                About me
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  lineHeight: '1.7',
                  color: '#4A4A4A',
                  margin: 0,
                }}
              >
                {about}
              </p>
            </div>

            {/* Employment */}
            <div style={{ marginBottom: '28px' }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#000000',
                  margin: 0,
                  marginBottom: '12px',
                }}
              >
                Employment
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {employment.map((job, idx) => (
                  <div key={idx}>
                    <div
                      style={{
                        borderLeft: '3px solid #E0E0E0',
                        paddingLeft: '16px',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#000000',
                          margin: 0,
                          marginBottom: '2px',
                        }}
                      >
                        {job.position} | {job.company}
                      </h3>
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#757575',
                          margin: 0,
                          marginBottom: '10px',
                        }}
                      >
                        {job.period}
                      </p>
                      <p
                        style={{
                          fontSize: '13px',
                          color: '#4A4A4A',
                          margin: 0,
                          marginBottom: '8px',
                        }}
                      >
                        Key Contributions as a {job.position.includes('UX') || job.position.includes('Designer') ? 'UX Designer' : 'Designer'}:
                      </p>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: '20px',
                          listStyleType: 'disc',
                        }}
                      >
                        {job.contributions.map((contribution, i) => (
                          <li
                            key={i}
                            style={{
                              fontSize: '13px',
                              lineHeight: '1.6',
                              color: '#4A4A4A',
                              marginBottom: '4px',
                            }}
                          >
                            {contribution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#000000',
                  margin: 0,
                  marginBottom: '12px',
                }}
              >
                Education
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderLeft: '3px solid #E0E0E0',
                      paddingLeft: '16px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#000000',
                        margin: 0,
                        marginBottom: '2px',
                      }}
                    >
                      {edu.school}
                    </h3>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#757575',
                        margin: 0,
                        marginBottom: '4px',
                      }}
                    >
                      {edu.period}
                    </p>
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#4A4A4A',
                        margin: 0,
                      }}
                    >
                      {edu.degree}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            {/* Certificates */}
            <div style={{ marginBottom: '28px' }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#000000',
                  margin: 0,
                  marginBottom: '12px',
                }}
              >
                Certificates
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {certificates.map((cert, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderLeft: '3px solid #1D8AC7',
                      paddingLeft: '12px',
                    }}
                  >
                    <a
                      href={cert.link || '#'}
                      style={{
                        fontSize: '13px',
                        color: '#1D8AC7',
                        textDecoration: 'underline',
                        margin: 0,
                      }}
                    >
                      {cert.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Analysis & Visualization Projects */}
            <div style={{ marginBottom: '28px' }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#000000',
                  margin: 0,
                  marginBottom: '12px',
                }}
              >
                Data Analysis & Visualization Projects
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {dataProjects.map((project, idx) => (
                  <div key={idx}>
                    <div
                      style={{
                        borderLeft: '3px solid #1D8AC7',
                        paddingLeft: '12px',
                      }}
                    >
                      <a
                        href={project.link || '#'}
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#1D8AC7',
                          textDecoration: 'underline',
                          margin: 0,
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        {project.name}
                      </a>
                      <p
                        style={{
                          fontSize: '13px',
                          lineHeight: '1.6',
                          color: '#4A4A4A',
                          margin: 0,
                        }}
                      >
                        {project.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UX Projects */}
            <div style={{ marginBottom: '28px' }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#000000',
                  margin: 0,
                  marginBottom: '12px',
                }}
              >
                UX Projects
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {uxProjects.map((project, idx) => (
                  <div key={idx}>
                    <div
                      style={{
                        borderLeft: '3px solid #1D8AC7',
                        paddingLeft: '12px',
                      }}
                    >
                      <a
                        href={project.link || '#'}
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#1D8AC7',
                          textDecoration: 'underline',
                          margin: 0,
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        {project.name}
                      </a>
                      <p
                        style={{
                          fontSize: '13px',
                          lineHeight: '1.6',
                          color: '#4A4A4A',
                          margin: 0,
                        }}
                      >
                        {project.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#000000',
                  margin: 0,
                  marginBottom: '12px',
                }}
              >
                Skills
              </h2>
              
              {/* Core UX & Design Skills */}
              <div style={{ marginBottom: '16px' }}>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#000000',
                    margin: 0,
                    marginBottom: '8px',
                  }}
                >
                  Core UX & Design Skills
                </h3>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '20px',
                    listStyleType: 'disc',
                  }}
                >
                  {skills.coreUX.map((skill, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: '13px',
                        lineHeight: '1.6',
                        color: '#4A4A4A',
                        marginBottom: '2px',
                      }}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data Analysis & Visualization */}
              <div>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#000000',
                    margin: 0,
                    marginBottom: '8px',
                  }}
                >
                  Data Analysis & Visualization
                </h3>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '20px',
                    listStyleType: 'disc',
                  }}
                >
                  {skills.dataAnalysis.map((skill, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: '13px',
                        lineHeight: '1.6',
                        color: '#4A4A4A',
                        marginBottom: '2px',
                      }}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Resume.displayName = 'Resume';
