const fs = require('fs');
const file = 'src/lib/useArabicDomTranslation.ts';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/"Approve Leave": ".*?"/g, '"Approve Leave": "الموافقة على الإجازة"');
  content = content.replace(/"Approve Leaves": ".*?"/g, '"Approve Leaves": "الموافقة على الإجازات"');
  content = content.replace(/"Approve Mission": ".*?"/g, '"Approve Mission": "الموافقة على المأمورية"');
  content = content.replace(/"Approve Missions": ".*?"/g, '"Approve Missions": "الموافقة على المأموريات"');
  content = content.replace(/"Approve": ".*?"/g, '"Approve": "موافقة"');
  fs.writeFileSync(file, content, 'utf8');
}
