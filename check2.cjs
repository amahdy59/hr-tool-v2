const fs = require('fs');
const dashboard = fs.readFileSync('src/app/components/Dashboard.tsx', 'utf8');
const trans = fs.readFileSync('src/lib/useArabicDomTranslation.ts', 'utf8');

const dMatch = dashboard.match(/\{\"(Please ensure[^\"]+)\"\}/)[1];
const tMatch = trans.match(/\"(Please ensure[^\"]+)\":/)[1];

console.log('dMatch:', JSON.stringify(dMatch));
console.log('tMatch:', JSON.stringify(tMatch));
console.log('dMatch.trim() === tMatch:', dMatch.trim() === tMatch);
