const fs = require('fs');
let code = fs.readFileSync('src/components/ProjectHealthChart.tsx', 'utf-8');

if (!code.includes("import { calculateProgress }")) {
  code = code.replace("import { Project } from '../types';", "import { Project } from '../types';\nimport { calculateProgress } from '../lib/progress';");
}

const regex = /const calculateProgress = \(project: Project\): number => \{[\s\S]*?\};\n/;
if (regex.test(code)) {
  code = code.replace(regex, "");
  code = code.replace(/calculateProgress\(p\)/g, "calculateProgress(p.tasks || [], p.columns || [])");
  fs.writeFileSync('src/components/ProjectHealthChart.tsx', code);
  console.log("PHC patched.");
} else {
  console.log("Regex didn't match in PHC.");
}
