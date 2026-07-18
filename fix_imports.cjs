const fs = require('fs');
let file = fs.readFileSync('src/constants.ts', 'utf8');
if (!file.includes("import { translations")) {
  file = file.replace(/import \{ Column, Task, ProjectTemplate \} from '\.\/types';/, "import { Column, Task, ProjectTemplate } from './types';\nimport { translations, Language } from './lib/translations';");
}
fs.writeFileSync('src/constants.ts', file);
