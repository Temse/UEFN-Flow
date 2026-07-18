const fs = require('fs');
const glob = require('glob');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
  });
  return results;
}
const files = walk('./src');
files.forEach(f => {
  const code = fs.readFileSync(f, 'utf8').split('\n');
  for (let i = 0; i < code.length; i++) {
    if (code[i].match(/set[A-Z][a-zA-Z0-9]*\(/)) {
      console.log(`[${f}:${i+1}] ${code[i].trim()}`);
    }
  }
});
