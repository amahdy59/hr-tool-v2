const fs = require('fs');
const file = 'src/lib/useArabicDomTranslation.ts';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/"Approve Leave": ".*?"/g, '"Approve Leave": "تأكيد الأجازة"');
  content = content.replace(/"Approve Leaves": ".*?"/g, '"Approve Leaves": "تأكيد الأجازات"');
  content = content.replace(/"Approve Mission": ".*?"/g, '"Approve Mission": "تأكيد المأمورية"');
  content = content.replace(/"Approve Missions": ".*?"/g, '"Approve Missions": "تأكيد المأموريات"');
  content = content.replace(/"Approve": ".*?"/g, '"Approve": "تأكيد"'); // General fallback
  fs.writeFileSync(file, content, 'utf8');
}
