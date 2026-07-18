cat << 'INNER_EOF' > calculate_stats.txt
function calculateProjectStats(project: any) {
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
    }).length;

    const overdueCount = tasks.filter((t: any) => {
      const dueDateStr = t.due_date || t.dueDate;
      if (!dueDateStr) return false;
      
      const isCompleted = lastColId ? (t.column_id === lastColId || t.columnId === lastColId) : false;
      if (isCompleted) return false;
      
      try {
        const dueDate = new Date(dueDateStr);
        return dueDate.getTime() < Date.now();
      } catch (e) {
        return false;
      }
    }).length;

    health = 100 - (pendingCritical * 15) - (overdueCount * 25);
    if (health < 10) health = 10;
  }

  return { progress, health };
}
INNER_EOF

sed -i -e '/function calculateProjectStats(project: any) {/,/^}/c\
'"$(cat calculate_stats.txt | sed 's/$/\\/')"'' src/components/Dashboard.tsx
sed -i -e 's/\\$//' src/components/Dashboard.tsx
