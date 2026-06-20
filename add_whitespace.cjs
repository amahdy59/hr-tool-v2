const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app', 'components');

const filesToProcess = [
  'EmployeeManagement.tsx',
  'LeavesManagement.tsx',
  'MissionsManagement.tsx',
  'RolesManagement.tsx',
  'Payroll.tsx'
];

filesToProcess.forEach(file => {
  const filePath = path.join(directoryPath, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace <th className="... "> with whitespace-nowrap if not already there
    content = content.replace(/<th\s+className="([^"]+)"/g, (match, classes) => {
      if (!classes.includes('whitespace-nowrap')) {
        return `<th className="whitespace-nowrap ${classes}"`;
      }
      return match;
    });

    // Replace <td className="... "> with whitespace-nowrap if not already there
    content = content.replace(/<td\s+className="([^"]+)"/g, (match, classes) => {
      if (!classes.includes('whitespace-nowrap')) {
        return `<td className="whitespace-nowrap ${classes}"`;
      }
      return match;
    });

    // Replace <th className={cn(thClass, 'w-10')}> where it doesn't use double quotes directly.
    // In our case we added whitespace-nowrap to thClass so that is covered.
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${file}`);
  }
});
