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
    content = content.replace(/className="w-12 h-11 text-center/g, 'className="w-12 h-11 p-0 m-0 leading-[44px] text-center');
    content = content.replace(/className="w-10 h-11 sm:h-8 p-0 m-0 text-center/g, 'className="w-10 h-11 sm:h-8 p-0 m-0 leading-[44px] sm:leading-[32px] text-center');
    content = content.replace(/className="w-10 h-8 text-center/g, 'className="w-10 h-8 p-0 m-0 leading-[32px] text-center');
    fs.writeFileSync(file, content, 'utf8');
  }
});
