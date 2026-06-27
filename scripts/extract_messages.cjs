const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/AhmedMahdy/.gemini/antigravity/brain/a0dbcff6-526a-4d2b-9471-80a4d04bfab1/.system_generated/logs/transcript.jsonl')
});
const messages = [];
rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT' && obj.content) {
      messages.push(obj.content);
    }
  } catch (e) {}
});
rl.on('close', () => {
  messages.forEach((msg, idx) => {
    console.log(`\n--- MESSAGE ${idx + 1} ---`);
    console.log(msg.replace(/<ADDITIONAL_METADATA>[\s\S]*?<\/ADDITIONAL_METADATA>/g, '').trim());
  });
});
