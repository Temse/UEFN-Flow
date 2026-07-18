const fs = require('fs');
let file = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

const regexDragOver = /const handleDragOver = \(event: DragOverEvent\) => \{[\s\S]*?const handleDragEnd = \(event: DragEndEvent\) => \{/;
const newDragOver = `const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';
    const isOverAColumn = over.data.current?.type === 'Column';

    if (!isActiveATask) return;

    setProject(prev => {
      if (!prev || !prev.tasks) return prev;
      
      const activeIndex = prev.tasks.findIndex(t => t.id === activeId);
      if (activeIndex === -1) return prev;

      if (isActiveATask && isOverATask) {
        const overIndex = prev.tasks.findIndex(t => t.id === overId);
        if (overIndex === -1) return prev;

        const newColumnId = prev.tasks[overIndex].columnId;
        if (prev.tasks[activeIndex].columnId !== newColumnId) {
          const newTasks = [...prev.tasks];
          newTasks[activeIndex] = { ...newTasks[activeIndex], columnId: newColumnId };
          const updatedTasks = arrayMove(newTasks, activeIndex, overIndex);
          socket?.emit('task-moved', { projectId, taskId: activeId, newColumnId, newPosition: overIndex });
          return { ...prev, tasks: updatedTasks };
        }
      }

      if (isActiveATask && isOverAColumn) {
        if (prev.tasks[activeIndex].columnId !== overId) {
          const newTasks = [...prev.tasks];
          newTasks[activeIndex] = { ...newTasks[activeIndex], columnId: overId };
          
          if (overId === 'release') {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          }
          socket?.emit('task-moved', { projectId, taskId: activeId, newColumnId: overId, newPosition: 0 });
          return { ...prev, tasks: newTasks };
        }
      }

      return prev;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {`;

file = file.replace(regexDragOver, newDragOver);


const regexDragEnd = /const handleDragEnd = \(event: DragEndEvent\) => \{[\s\S]*?  const logAction = async/;
const newDragEnd = `const handleDragEnd = (event: DragEndEvent) => {
    setActiveTaskId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === 'Column';
    const isOverAColumn = over.data.current?.type === 'Column';
    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';

    setProject(prev => {
      if (!prev) return prev;

      if (isActiveAColumn && isOverAColumn && prev.columns) {
        const activeIndex = prev.columns.findIndex(c => c.id === activeId);
        const overIndex = prev.columns.findIndex(c => c.id === overId);
        if (activeIndex === -1 || overIndex === -1) return prev;
        const updatedColumns = arrayMove(prev.columns, activeIndex, overIndex);
        return { ...prev, columns: updatedColumns };
      }

      if (isActiveATask && isOverATask && prev.tasks) {
        const activeIndex = prev.tasks.findIndex(t => t.id === activeId);
        const overIndex = prev.tasks.findIndex(t => t.id === overId);
        if (activeIndex === -1 || overIndex === -1) return prev;
        
        if (prev.tasks[activeIndex].columnId === prev.tasks[overIndex].columnId) {
          const updatedTasks = arrayMove(prev.tasks, activeIndex, overIndex);
          socket?.emit('task-moved', { projectId, taskId: activeId, newColumnId: prev.tasks[activeIndex].columnId, newPosition: overIndex });
          return { ...prev, tasks: updatedTasks };
        }
      }
      return prev;
    });
  };

  const logAction = async`;

file = file.replace(regexDragEnd, newDragEnd);

fs.writeFileSync('src/components/ProjectView.tsx', file);
