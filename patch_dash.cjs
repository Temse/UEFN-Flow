const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const oldFunc = `function calculateProjectStats(project: any) {
  let progress = 0;
  let health = 100;
  
  if (project.tasks && project.tasks.length > 0 && project.columns && project.columns.length > 0) {
    const tasks = project.tasks;
    const columns = project.columns;
    
    const sortedCols = [...columns].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
    const lastColId = sortedCols.length > 0 ? sortedCols[sortedCols.length - 1].id : null;
    
    if (lastColId) {
      const completedTasks = tasks.filter((t: any) => t.column_id === lastColId || t.columnId === lastColId).length;
      progress = Math.round((completedTasks / tasks.length) * 100);
    }
    
    const pendingCritical = tasks.filter((t: any) => {
      const isCrit = t.is_critical || t.isCritical;
      const isCompleted = lastColId ? (t.column_id === lastColId || t.columnId === lastColId) : false;
      return isCrit && !isCompleted;
    }).length;`;

const newFunc = `function calculateProjectStats(project: any) {
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
    }).length;`;

if (content.includes(oldFunc)) {
  content = content.replace(oldFunc, newFunc);
  fs.writeFileSync('src/components/Dashboard.tsx', content);
  console.log("Patched successfully.");
} else {
  console.log("Could not find the function to patch.");
}
