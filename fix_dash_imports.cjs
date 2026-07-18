const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace("import { import { CSS } from '@dnd-kit/utilities';", "import { calculateProgress } from '../lib/progress';\nimport { CSS } from '@dnd-kit/utilities';");
code = code.replace("import { Project, ProjectTemplate, ProjectLog, deduplicateById } from '../types';\nimport { calculateProgress } from '../lib/progress';", "import { Project, ProjectTemplate, ProjectLog, deduplicateById } from '../types';");

fs.writeFileSync('src/components/Dashboard.tsx', code);
