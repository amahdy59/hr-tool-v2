const fs = require('fs');
const file = 'src/lib/useArabicDomTranslation.ts';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('"In-Office":')) {
    content = content.replace(/"In-Office": ".*?"/g, '"In-Office": "العمل من المكتب"');
  } else if (content.includes('"In-office":')) {
    content = content.replace(/"In-office": ".*?"/g, '"In-office": "العمل من المكتب"');
  } else {
    // Add it after "In Progress" or just before closing brace of common terms
    if (content.includes('"In Progress"')) {
      content = content.replace(/"In Progress": ".*?",/g, '"In Progress": "قيد التقدم",\n  "In-Office": "العمل من المكتب",\n  "In-office": "العمل من المكتب",');
    } else {
        content = content.replace(/};\n\nexport/g, '  "In-Office": "العمل من المكتب",\n  "In-office": "العمل من المكتب"\n};\n\nexport');
    }
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log('Done');
}
