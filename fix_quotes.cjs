const fs = require('fs');
let file = fs.readFileSync('src/lib/translations.ts', 'utf8');
file = file.replace(/",,tasksCompleted":/g, '"tasksCompleted":');
fs.writeFileSync('src/lib/translations.ts', file);
