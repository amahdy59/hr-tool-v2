const fs = require('fs');
const dashboard = fs.readFileSync('src/app/components/Dashboard.tsx', 'utf8');
const trans = fs.readFileSync('src/lib/useArabicDomTranslation.ts', 'utf8');

const dMatch = dashboard.match(/\{\"Please ensure[^\"]+\"\}/);
const tMatch = trans.match(/\"Please ensure[^\"]+\":/);

console.log('Dashboard string:', dMatch ? dMatch[0] : 'not found');
console.log('Translation key:', tMatch ? tMatch[0] : 'not found');
