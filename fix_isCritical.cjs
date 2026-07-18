const fs = require('fs');

let file = fs.readFileSync('src/constants.ts', 'utf8');

// Remove all isCritical: true,
file = file.replace(/\s*isCritical:\s*true,/g, '');

// Now add it to task-rel-2 (Thumbnail task)
// Let's find: id: 'task-rel-2',
file = file.replace(/id: 'task-rel-2',\s*columnId: 'release',\s*title:/, "id: 'task-rel-2',\n      columnId: 'release',\n      isCritical: true,\n      title:");

// Remove task-rel-loc completely
file = file.replace(/\s*\{\s*id: 'task-rel-loc',[\s\S]*?(?=\s*\{\s*id: 'task-rel-2',)/m, '\n');

fs.writeFileSync('src/constants.ts', file);
