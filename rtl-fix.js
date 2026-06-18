import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace text-left with text-start
    content = content.replace(/\btext-left\b/g, 'text-start');
    // Replace text-right with text-end
    content = content.replace(/\btext-right\b/g, 'text-end');
    
    // Replace pl- with ps-
    content = content.replace(/\bpl-(\d+|px|[\w-\[\]]+)\b/g, 'ps-$1');
    // Replace pr- with pe-
    content = content.replace(/\bpr-(\d+|px|[\w-\[\]]+)\b/g, 'pe-$1');
    
    // Replace ml- with ms-
    content = content.replace(/\bml-(\d+|px|[\w-\[\]]+)\b/g, 'ms-$1');
    // Replace mr- with me-
    content = content.replace(/\bmr-(\d+|px|[\w-\[\]]+)\b/g, 'me-$1');
    
    // Replace left- with start-
    content = content.replace(/\bleft-(\d+|px|1\/2|[\w-\[\]]+)\b/g, 'start-$1');
    // Replace right- with end-
    content = content.replace(/\bright-(\d+|px|1\/2|[\w-\[\]]+)\b/g, 'end-$1');
    
    // Replace border-l with border-s
    content = content.replace(/\bborder-l\b/g, 'border-s');
    content = content.replace(/\bborder-l-(\d+|px|[\w-]+)\b/g, 'border-s-$1');
    
    // Replace border-r with border-e
    content = content.replace(/\bborder-r\b/g, 'border-e');
    content = content.replace(/\bborder-r-(\d+|px|[\w-]+)\b/g, 'border-e-$1');
    
    // Replace rounded-l with rounded-s
    content = content.replace(/\brounded-l\b/g, 'rounded-s');
    content = content.replace(/\brounded-l-(\w+)\b/g, 'rounded-s-$1');
    
    // Replace rounded-r with rounded-e
    content = content.replace(/\brounded-r\b/g, 'rounded-e');
    content = content.replace(/\brounded-r-(\w+)\b/g, 'rounded-e-$1');

    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('RTL classes updated successfully.');
