const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.match(/set[A-Z][a-zA-Z0-9]*\(/)) {
      if (!line.includes('useEffect') && !line.includes('=>') && !line.includes('function') && !line.includes('onClick') && !line.includes('onChange') && !line.includes('onKeyDown') && !line.includes('setTimeout') && !line.includes('setInterval') && !line.includes('Promise') && !line.includes('try {') && !line.includes('catch') && !line.includes('finally')) {
        console.log(`[${path.basename(file)}:${i+1}] ${line.trim()}`);
      }
    }
  });
});
