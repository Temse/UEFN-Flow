const fs = require('fs');

let header = fs.readFileSync('src/components/Header.tsx', 'utf-8');
header = header.replace(/import \{ Language, translations \} from '\.\.\/lib\/translations';/, "import { Language, translations } from '../lib/translations';\nimport { calculateProgress } from '../lib/progress';");
fs.writeFileSync('src/components/Header.tsx', header);

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
dash = dash.replace(/import \{ Project \} from '\.\.\/types';/, "import { Project } from '../types';\nimport { calculateProgress } from '../lib/progress';");
fs.writeFileSync('src/components/Dashboard.tsx', dash);

