const fs = require('fs');
let dom = fs.readFileSync('src/lib/useArabicDomTranslation.ts', 'utf8');
let i18n = fs.readFileSync('src/i18n.ts', 'utf8');

// Global replace إجازة -> أجازة
dom = dom.replace(/إجازة/g, 'أجازة').replace(/الإجازة/g, 'الأجازة');
i18n = i18n.replace(/إجازة/g, 'أجازة').replace(/الإجازة/g, 'الأجازة');

// Add "Balance" if it doesn't exist, or replace
if (dom.includes('"Balance":')) {
  dom = dom.replace(/"Balance": ".*?"/, '"Balance": "رصيد الأجازة"');
} else {
  // Add it somewhere
  dom = dom.replace(/"Dashboard":/, '"Balance": "رصيد الأجازة",\n  "Dashboard":');
}

// Ensure "1 week" is there
if (dom.includes('"1 week":')) {
  dom = dom.replace(/"1 week": ".*?"/, '"1 week": "اسبوع واحد"');
} else {
  dom = dom.replace(/"Dashboard":/, '"1 week": "اسبوع واحد",\n  "Dashboard":');
}

const oldStr = "Please ensure all carried over vacation days are used before March 31st of the current year. Any remaining carried over days will be automatically deducted before the current year's vacation.";
const newStr = 'يرجى التأكد من استخدام جميع أيام الأجازة المٌرحلة من العام الماضي قبل 31 مارس من هذا العام. تُخصم أيام الأجازة المٌرحلة تلقائيًا قبل أجازة هذا العام.';

if (dom.includes(oldStr)) {
  dom = dom.replace(oldStr, newStr); // but it's translated by the hook, so we need to find its key. Wait, the hook translates DOM text. So the key IS the old string!
} else {
  dom = dom.replace(/"Dashboard":/, `"${oldStr}": "${newStr}",\n  "Dashboard":`);
}

fs.writeFileSync('src/lib/useArabicDomTranslation.ts', dom, 'utf8');
fs.writeFileSync('src/i18n.ts', i18n, 'utf8');
