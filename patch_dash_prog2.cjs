const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const regex = /function calculateProjectStats\(project: any\) \{[\s\S]*?return \{ progress, health \};\n\}/;
const newFunc = `function calculateProjectStats(project: any) {
  let progress = calculateProgress(project.tasks || [], project.columns || []);
  let health = 100;
  
  if (project.tasks && project.tasks.length > 0) {
    const pendingCritical = project.tasks.filter((t: any) => {
      const isCrit = t.is_critical || t.isCritical;
      const allSubTasksCompleted = t.subTasks && t.subTasks.length > 0 
        ? t.subTasks.every((st: any) => !!st.completed) 
        : false;
      return isCrit && !allSubTasksCompleted;
    }).length;
    health = Math.max(0, 100 - (pendingCritical * 10));
  }
  return { progress, health };
}`;

if (regex.test(code)) {
  if (!code.includes("import { calculateProgress }")) {
    code = code.replace("import { Project } from '../types';", "import { Project } from '../types';\nimport { calculateProgress } from '../lib/progress';");
  }
  code = code.replace(regex, newFunc);
  fs.writeFileSync('src/components/Dashboard.tsx', code);
  console.log("Dashboard patched.");
} else {
  console.log("Regex didn't match.");
}
