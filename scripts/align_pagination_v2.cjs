const fs = require('fs');
const files = [
  'src/app/components/Attendance.tsx',
  'src/app/components/EmployeeManagement.tsx',
  'src/app/components/LeavesManagement.tsx',
  'src/app/components/MissionsManagement.tsx',
  'src/app/components/Pagination.tsx',
  'src/app/components/RolesManagement.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // For w-12 h-11
    content = content.replace(/className=\"w-12 h-11 p-0 m-0 leading-\[44px\] text-center[^\"]*\"/g, 
      'className=\"w-12 px-0 py-[14px] text-center border border-border rounded-[var(--radius-input)] bg-input-background text-foreground focus:ring-2 focus:ring-ring/50 outline-none text-[var(--text-sm)] leading-none shadow-sm\"');
      
    // For Pagination.tsx
    content = content.replace(/className=\"w-10 h-11 sm:h-8 p-0 m-0 leading-\[44px\] sm:leading-\[32px\] text-center[^\"]*\"/g, 
      'className=\"w-10 px-0 py-[14px] sm:py-[8px] text-center border border-border rounded-[var(--radius-input)] bg-input-background text-foreground focus:ring-2 focus:ring-ring/50 outline-none text-[var(--text-sm)] leading-none shadow-sm\"');
      
    // For w-10 h-8
    content = content.replace(/className=\"w-10 h-8 p-0 m-0 leading-\[32px\] text-center[^\"]*\"/g, 
      'className=\"w-10 px-0 py-[8px] text-center border border-border rounded-[var(--radius-input)] bg-input-background text-foreground focus:ring-2 focus:ring-ring/50 outline-none text-[var(--text-sm)] leading-none shadow-sm\"');
      
    fs.writeFileSync(file, content, 'utf8');
  }
});
