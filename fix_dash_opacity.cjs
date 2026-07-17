const fs = require('fs');

let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(/bg-ue-panel\/95/g, 'bg-black/90 dark:bg-black/95');
code = code.replace(/bg-ue-panel\/50/g, 'bg-black/5 dark:bg-black/50');
code = code.replace(/bg-epic-cyan\/10/g, 'bg-cyan-500/10');
code = code.replace(/bg-epic-cyan\/20/g, 'bg-cyan-500/20');
code = code.replace(/text-white/g, 'text-ue-text');

fs.writeFileSync('src/components/Dashboard.tsx', code);
