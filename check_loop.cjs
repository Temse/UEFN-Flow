const fs = require('fs');
const glob = require('glob');

function checkFile(file) {
  const code = fs.readFileSync(file, 'utf-8');
  if (code.includes('setState') || code.includes('setProject') || code.includes('setProjects')) {
     // simple heuristic
  }
}
// Maybe the bug is in ProjectView's project effect?
