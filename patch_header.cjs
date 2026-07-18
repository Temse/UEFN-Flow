const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf-8');

if (!code.includes('calculateProgress')) {
  code = code.replace("import { translations } from '../lib/translations';", "import { translations } from '../lib/translations';\nimport { calculateProgress } from '../lib/progress';");
  
  const oldCalc = `const totalSubTasks = tasks.reduce((acc, task) => acc + (task.subTasks?.length || 0), 0);
  const completedSubTasks = tasks.reduce(
    (acc, task) => acc + (task.subTasks?.filter(st => st.completed).length || 0), 
    0
  );
  
  const progress = totalSubTasks > 0 ? Math.round((completedSubTasks / totalSubTasks) * 100) : 0;`;
  
  code = code.replace(oldCalc, `const progress = calculateProgress(tasks, []);`); // Header doesn't have columns, but wait, does it?
}
fs.writeFileSync('src/components/Header.tsx', code);
