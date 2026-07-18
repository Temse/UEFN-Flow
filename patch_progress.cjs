const fs = require('fs');

const progressLogic = `
export function calculateProgress(tasks: any[], columns: any[]): number {
  if (!tasks || tasks.length === 0) return 0;
  
  const totalSubTasks = tasks.reduce((acc, task) => acc + (task.subTasks?.length || 0), 0);
  const completedSubTasks = tasks.reduce(
    (acc, task) => acc + (task.subTasks?.filter((st: any) => st.completed).length || 0), 
    0
  );
  
  if (totalSubTasks > 0) {
    return Math.round((completedSubTasks / totalSubTasks) * 100);
  }
  
  // Fallback to columns if no subtasks exist
  if (!columns || columns.length === 0) return 0;
  const sortedCols = [...columns].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
  const lastColId = sortedCols[sortedCols.length - 1].id;
  const completedTasks = tasks.filter((t: any) => t.column_id === lastColId || t.columnId === lastColId).length;
  return Math.round((completedTasks / tasks.length) * 100);
}
`;

fs.writeFileSync('src/lib/progress.ts', progressLogic);
