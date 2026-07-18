const fs = require('fs');
let file = fs.readFileSync('src/index.css', 'utf8');

file = file.replace(/--color-epic-cyan: #00E5FF;/, '--color-epic-cyan: var(--epic-cyan, #00E5FF);');
file = file.replace(/--color-unreal-orange: #FF5E00;/, '--color-unreal-orange: var(--unreal-orange, #FF5E00);');

fs.writeFileSync('src/index.css', file);
