const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

if (!code.includes("import { calculateProgress }")) {
  code = code.replace("import { Project } from '../types';", "import { Project } from '../types';\nimport { calculateProgress } from '../lib/progress';");
}

const oldFunc = `function calculateProjectStats(project: any) {
  let progress = 0;
  let health = 100;
  
  if (project.tasks && project.tasks.length > 0) {
    const tasks = project.tasks;
    
    const totalSubTasks = tasks.reduce((acc: number, task: any) => acc + (task.subTasks?.length || 0), 0);
    const completedSubTasks = tasks.reduce(
      (acc: number, task: any) => acc + (task.subTasks?.filter((st: any) => st.completed).length || 0), 
      0
    );
    
    if (totalSubTasks > 0) {
      progress = Math.round((completedSubTasks / totalSubTasks) * 100);
    } else {
      // Fallback if no subtasks at all, use column based? 
      // Actually, if there are no subtasks, it's 0% unless we have another metric.
      progress = 0;
    }
    
    const pendingCritical = tasks.filter((t: any) => {
      const isCrit = t.is_critical || t.isCritical;
      const allSubTasksCompleted = t.subTasks && t.subTasks.length > 0 
        ? t.subTasks.every((st: any) => st.completed) 
        : false;
      return isCrit && !allSubTasksCompleted;
    }).length;
    
    health = Math.max(0, 100 - (pendingCritical * 10));
  }
  
  return { progress, health };
}`;

const newFunc = `function calculateProjectStats(project: any) {
  let progress = calculateProgress(project.tasks || [], project.columns || []);
  let health = 100;
  
  if (project.tasks && project.tasks.length > 0) {
    const pendingCritical = project.tasks.filter((t: any) => {
      const isCrit = t.is_critical || t.isCritical;
      const allSubTasksCompleted = t.subTasks && t.subTasks.length > 0 
        ? t.subTasks.every((st: any) => st.completed) 
        : false;
      return isCrit && !allSubTasksCompleted;
    }).length;
    health = Math.max(0, 100 - (pendingCritical * 10));
  }
  return { progress, health };
}`;

if (code.includes(oldFunc)) {
  code = code.replace(oldFunc, newFunc);
  fs.writeFileSync('src/components/Dashboard.tsx', code);
  console.log('Dashboard patched.');
} else {
  console.log('Dashboard oldFunc not found.');
}
