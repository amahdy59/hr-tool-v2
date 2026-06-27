const fs = require('fs');

const data = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

// Build dictionary object from 'English Text' -> 'Arabic Translation'
const dict = {};

data.forEach(row => {
  const eng = row['English Text'];
  const ar = row['Arabic Translation'];
  if (eng && ar) {
    dict[eng.trim()] = ar.trim();
  }
});

let fileContent = fs.readFileSync('src/lib/useArabicDomTranslation.ts', 'utf8');

// The file has:
// const dictionary: Record<string, string> = {
//   ...
// };

const newDictStr = 'const dictionary: Record<string, string> = {\n' + 
  Object.keys(dict).map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(dict[k])}`).join(',\n') +
  '\n};';

fileContent = fileContent.replace(/const dictionary: Record<string, string> = \{[\s\S]*?\};/, newDictStr);

fs.writeFileSync('src/lib/useArabicDomTranslation.ts', fileContent);
console.log('Dictionary updated with ' + Object.keys(dict).length + ' entries.');
