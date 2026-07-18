const fs = require('fs');

let file = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

// Replace handleDragOver and handleDragEnd
file = file.replace(/const handleDragOver = \(event: DragOverEvent\) => \{[\s\S]*?const handleDragEnd = \(\) => setActiveTaskId\(null\);/m, `const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !project) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';
    const isOverAColumn = over.data.current?.type === 'Column';

    if (!isActiveATask) return;

    // Cross-column movement
    if (isActiveATask && isOverATask) {
      const activeIndex = project.tasks!.findIndex(t => t.id === activeId);
      const overIndex = project.tasks!.findIndex(t => t.id === overId);
      const newColumnId = project.tasks![overIndex].columnId;

      if (project.tasks![activeIndex].columnId !== newColumnId) {
        const newTasks = [...project.tasks!];
        newTasks[activeIndex].columnId = newColumnId;
        const updatedTasks = arrayMove(newTasks, activeIndex, overIndex);
        setProject({ ...project, tasks: updatedTasks });
        socket?.emit('task-moved', { projectId, taskId: activeId, newColumnId, newPosition: overIndex });
      }
    }

    if (isActiveATask && isOverAColumn) {
      const activeIndex = project.tasks!.findIndex(t => t.id === activeId);
      if (project.tasks![activeIndex].columnId !== overId) {
        const newTasks = [...project.tasks!];
        newTasks[activeIndex].columnId = overId;
        setProject({ ...project, tasks: newTasks });
        
        if (overId === 'release') {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        socket?.emit('task-moved', { projectId, taskId: activeId, newColumnId: overId, newPosition: 0 });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTaskId(null);
    const { active, over } = event;
    if (!over || !project) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === 'Column';
    const isOverAColumn = over.data.current?.type === 'Column';
    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';

    // Reorder columns
    if (isActiveAColumn && isOverAColumn) {
      const activeIndex = project.columns!.findIndex(c => c.id === activeId);
      const overIndex = project.columns!.findIndex(c => c.id === overId);
      const updatedColumns = arrayMove(project.columns!, activeIndex, overIndex);
      setProject({ ...project, columns: updatedColumns });
      return;
    }

    // Reorder tasks in same column
    if (isActiveATask && isOverATask) {
      const activeIndex = project.tasks!.findIndex(t => t.id === activeId);
      const overIndex = project.tasks!.findIndex(t => t.id === overId);
      if (project.tasks![activeIndex].columnId === project.tasks![overIndex].columnId) {
        const updatedTasks = arrayMove(project.tasks!, activeIndex, overIndex);
        setProject({ ...project, tasks: updatedTasks });
        socket?.emit('task-moved', { projectId, taskId: activeId, newColumnId: project.tasks![activeIndex].columnId, newPosition: overIndex });
      }
    }
  };`);

fs.writeFileSync('src/components/ProjectView.tsx', file);
