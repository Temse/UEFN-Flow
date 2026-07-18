cat << 'INNER_EOF' > methods.txt
  const addTask = async (columnId: string, title: string) => {
    const newTaskId = nanoid();
    const newTask: Task = {
      id: newTaskId,
      title,
      description: '',
      columnId,
      subTasks: [],
      tips: [],
      notes: ''
    };
    setProject(prev => {
      if (!prev) return prev;
      return { ...prev, tasks: [...(prev.tasks || []), newTask] };
    });
    logAction('task_created', `Aufgabe "${title}" erstellt.`);
  };

  const deleteTask = async (taskId: string) => {
    const task = project?.tasks?.find(t => t.id === taskId);
    setProject(prev => {
      if (!prev) return prev;
      return { ...prev, tasks: prev.tasks?.filter(t => t.id !== taskId) };
    });
    if (task) logAction('task_deleted', `Aufgabe "${task.title}" gelöscht.`);
    setSelectedTaskId(null);
  };

  const addColumn = async (title: string) => {
    const colId = nanoid();
    const newCol: Column = {
      id: colId,
      title,
      position: project?.columns?.length || 0
    };
    setProject(prev => {
      if (!prev) return prev;
      return { ...prev, columns: [...(prev.columns || []), newCol] };
    });
    logAction('column_created', `Spalte "${title}" erstellt.`);
    setShowAddColumn(false);
  };

  const updateColumn = async (columnId: string, title: string) => {
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns?.map(c => c.id === columnId ? { ...c, title } : c)
      };
    });
    logAction('column_renamed', `Spalte umbenannt in "${title}".`);
  };

  const deleteColumn = (columnId: string) => {
    setColumnToDelete(columnId);
  };

  const confirmDeleteColumn = async () => {
    if (!columnToDelete) return;
    const columnId = columnToDelete;
    const col = project?.columns?.find(c => c.id === columnId);
    if (!col) return;
    
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns?.filter(c => c.id !== columnId),
        tasks: prev.tasks?.filter(t => t.columnId !== columnId)
      };
    });
    setColumnToDelete(null);
  };
INNER_EOF

sed -i -e '/const addTask = async (/,/const updateProject = (/!b; /const updateProject = (/!d' src/components/ProjectView.tsx
sed -i -e '/const updateProject = (/i \
'"$(cat methods.txt | sed 's/$/\\/')"'' src/components/ProjectView.tsx
sed -i -e 's/\\$//' src/components/ProjectView.tsx
