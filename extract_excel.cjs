const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('C:/Users/AhmedMahdy/Downloads/frontend_arabic_translations_only.xlsx');
const sheet = wb.Sheets['Front-end Text'];
const data = xlsx.utils.sheet_to_json(sheet);
fs.writeFileSync('translations.json', JSON.stringify(data, null, 2));
