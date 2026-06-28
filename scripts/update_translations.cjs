const fs = require('fs');
let dom = fs.readFileSync('src/lib/useArabicDomTranslation.ts', 'utf8');
let i18n = fs.readFileSync('src/i18n.ts', 'utf8');

// Keep the standard spelling consistent across generated Arabic copy.
dom = dom.replace(/أجاز/g, 'إجاز').replace(/اجاز/g, 'إجاز');
i18n = i18n.replace(/أجاز/g, 'إجاز').replace(/اجاز/g, 'إجاز');

// Add "Balance" if it doesn't exist, or replace
if (dom.includes('"Balance":')) {
  dom = dom.replace(/"Balance": ".*?"/, '"Balance": "رصيد الإجازة"');
} else {
  // Add it somewhere
  dom = dom.replace(/"Dashboard":/, '"Balance": "رصيد الإجازة",\n  "Dashboard":');
}

// Ensure "1 week" is there
if (dom.includes('"1 week":')) {
  dom = dom.replace(/"1 week": ".*?"/, '"1 week": "اسبوع واحد"');
} else {
  dom = dom.replace(/"Dashboard":/, '"1 week": "اسبوع واحد",\n  "Dashboard":');
}

const oldStr = "Please ensure all carried over vacation days are used before March 31st of the current year. Any remaining carried over days will be automatically deducted before the current year's vacation.";
const newStr = 'يرجى التأكد من استخدام جميع أيام الإجازة المُرحلة من العام الماضي قبل 31 مارس من هذا العام. تُخصم أيام الإجازة المُرحلة تلقائيًا قبل إجازة هذا العام.';

if (dom.includes(oldStr)) {
  dom = dom.replace(oldStr, newStr); // but it's translated by the hook, so we need to find its key. Wait, the hook translates DOM text. So the key IS the old string!
} else {
  dom = dom.replace(/"Dashboard":/, `"${oldStr}": "${newStr}",\n  "Dashboard":`);
}

fs.writeFileSync('src/lib/useArabicDomTranslation.ts', dom, 'utf8');
fs.writeFileSync('src/i18n.ts', i18n, 'utf8');
