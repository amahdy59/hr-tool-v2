const fs = require('fs');
const dashboard = fs.readFileSync('src/app/components/Dashboard.tsx', 'utf8');
const trans = fs.readFileSync('src/lib/useArabicDomTranslation.ts', 'utf8');

const dMatch = dashboard.match(/\{\"(Please ensure[^\"]+)\"\}/)[1];
const tMatch = trans.match(/\"(Please ensure[^\"]+)\":/)[1];

console.log(Buffer.from(dMatch.trim()).toString('hex'));
console.log(Buffer.from(tMatch).toString('hex'));
