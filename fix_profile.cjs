const fs = require('fs');

const file = 'src/app/components/ProfessionalProfile.tsx';
let content = fs.readFileSync(file, 'utf8');

// Normalize line endings for reliable searching
content = content.replace(/\r\n/g, '\n');

const targetStart = '  return (\n    <div className="space-y-6">\n      <div className="flex items-center justify-between">';
const replaceWith = `  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Professional Profile</h3>
        <p className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
          Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Strength */}
          <div className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>Profile Strength</span>
              <span className="text-[var(--text-sm)] font-[var(--font-weight-bold)] text-chart-3" style={{ fontFamily: "'Inter', sans-serif" }}>{completionScore}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div className="bg-chart-3 h-full rounded-full transition-all duration-500" style={{ width: \`\${completionScore}%\` }} />
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
              <div className="flex items-center gap-2.5 text-primary"><Globe className="w-4 h-4" /> <a href={\`https://\${contact.linkedin}\`} target="_blank" rel="noopener noreferrer" className="hover:underline">{contact.linkedin}</a></div>
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
            <div className="space-y-6 relative ps-4 before:content-[''] before:absolute before:start-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
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
            <div className="space-y-6 relative ps-4 before:content-[''] before:absolute before:start-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
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

      {/* Hidden Resume for PDF export */}`;

const targetEnd = '{/* Hidden Resume for PDF export */}';

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + replaceWith + content.substring(endIndex + targetEnd.length);
  
  // Also fix target="_blank" in ProjectItem and CertificationItem
  content = content.replace(/<a href={data\.url} className="text-primary hover:underline flex items-center gap-1">/g, 
    '<a href={data.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">');
  
  content = content.replace(/<a href={data\.credentialUrl} className="text-primary hover:underline flex items-center gap-1 mt-1 inline-flex">/g,
    '<a href={data.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 mt-1 inline-flex">');

  fs.writeFileSync(file, content);
  console.log("Updated layout successfully!");
} else {
  console.log("Could not find start index.");
}
