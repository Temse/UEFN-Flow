const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = "import { calculateProgress } from '../lib/progress';\n" + code;
fs.writeFileSync('src/components/Dashboard.tsx', code);
