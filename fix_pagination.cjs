const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app', 'components');

const filesToProcess = [
  'EmployeeManagement.tsx',
  'LeavesManagement.tsx',
  'MissionsManagement.tsx',
  'RolesManagement.tsx',
  'Attendance.tsx',
  'Dashboard.tsx'
];

filesToProcess.forEach(file => {
  const filePath = path.join(directoryPath, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Target the specific Items Per Page container div
    const targetString = '<div className="flex items-center gap-3 text-[var(--text-sm)] text-muted-foreground w-full sm:w-auto justify-center sm:justify-start">';
    const replacementString = '<div className="flex items-center gap-3 text-[var(--text-sm)] text-muted-foreground w-full sm:w-auto justify-center sm:justify-start whitespace-nowrap shrink-0">';
    
    // Also Dashboard has some differences maybe, let's just use regex for any div before Items Per Page
    content = content.replace(/<div className="([^"]*)">\s*<span(?: className="[^"]*")?>Items Per Page<\/span>/g, (match, classes) => {
      if (!classes.includes('whitespace-nowrap')) {
        return match.replace(classes, `${classes} whitespace-nowrap shrink-0`);
      }
      return match;
    });

    // Handle plain text Items Per Page
    content = content.replace(/<div className="([^"]*)">\s*Items Per Page/g, (match, classes) => {
      if (!classes.includes('whitespace-nowrap')) {
        return match.replace(classes, `${classes} whitespace-nowrap shrink-0`);
      }
      return match;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${file}`);
  }
});
