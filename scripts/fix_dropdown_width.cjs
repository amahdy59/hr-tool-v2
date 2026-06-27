const fs = require('fs');
const files = [
  'src/app/components/Dashboard.tsx',
  'src/app/components/EmployeeManagement.tsx',
  'src/app/components/LeavesManagement.tsx',
  'src/app/components/MissionsManagement.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/className=\"w-\[var\(--radix-dropdown-menu-trigger-width\)\]\"/g, 'className=\"w-56\"');
    fs.writeFileSync(file, content, 'utf8');
  }
});
