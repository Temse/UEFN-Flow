import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import io from 'socket.io-client';
import { nanoid } from 'nanoid';
import { AlertTriangle, ArrowLeft, Loader2, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { Project, Task, Column, deduplicateById } from '../types';
import Header from './Header';
import KanbanBoard from './KanbanBoard';
import TaskModal from './TaskModal';
import ProjectSettingsModal from './ProjectSettingsModal';
import { ConfirmModal, InputModal } from './Modal';
import { translations, Language } from '../lib/translations';
import { useLanguage } from '../lib/LanguageContext';
import ProjectNotesPanel from './ProjectNotesPanel';

function FortniteStats({ islandCode }: { islandCode: string }) {
  if (!islandCode || islandCode === 'undefined') return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex gap-4 bg-ue-panel/50 border border-ue-border rounded-xl p-4"
    >
      <div>
        <span className="text-[9px] font-bold text-ue-text-muted uppercase tracking-widest block mb-1">Island Code</span>
        <span className="text-xs font-black text-ue-text">{islandCode}</span>
      </div>
    </motion.div>
  );
}

export default function ProjectView() {
  const userEmail = 'thomasgerter@gmail.com';
  const username = 'Thomas';
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotes, setShowNotes] = useState(() => {
    try {
      return localStorage.getItem(`uefn-show-notes-${projectId}`) === 'true';
    } catch {
      return false;
    }
  });
  const [socket, setSocket] = useState<any>(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
  const [columnToRename, setColumnToRename] = useState<Column | null>(null);
  const [columnIdForNewTask, setColumnIdForNewTask] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleArchive = async () => {
    if (!project) return;
    const newArchivedState = !project.archived;
    setProject(prev => prev ? { ...prev, archived: newArchivedState } : prev);
    socket?.emit("project-updated", { ...project, archived: newArchivedState });
    try {
      const cachedListStr = localStorage.getItem("uefn-cached-projects");
      if (cachedListStr) {
        const list = JSON.parse(cachedListStr);
        const updatedList = list.map((p: any) => p.id === project.id ? { ...p, archived: newArchivedState } : p);
        localStorage.setItem("uefn-cached-projects", JSON.stringify(updatedList));
      }
    } catch (e) {}
    try {
      await fetch(`/api/projects/${project.id}/archive`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: newArchivedState })
      });
    } catch (e) {}
  };

  const [showManualSaveSuccess, setShowManualSaveSuccess] = useState(false);
  const [showAutoSaveToast, setShowAutoSaveToast] = useState(false);

  // Read language and theme setting
  const { lang } = useLanguage();
  const t = translations[lang];

  const toggleNotes = () => {
    setShowNotes(prev => {
      const next = !prev;
      try {
        localStorage.setItem(`uefn-show-notes-${projectId}`, String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAutoSaveToast(true);
      const timer = setTimeout(() => setShowAutoSaveToast(false), 4000);
      return () => clearTimeout(timer);
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!projectId || projectId === 'undefined') return;

    // Check localStorage cache first for instant load
    const cached = localStorage.getItem(`uefn-cached-project-${projectId}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed) {
          parsed.tasks = deduplicateById(parsed.tasks || []);
          parsed.columns = deduplicateById(parsed.columns || []);
        }
        setProject(parsed);
        setIsLoading(false);
      } catch (e) {
        console.error('Failed to parse cached project', e);
        setIsLoading(true);
      }
    } else {
      setIsLoading(true);
    }
    setError(null);

    // Fetch initial data
    fetch(`/api/projects/${projectId}`)
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          const data = contentType?.includes('application/json') ? await res.json() : null;
          throw new Error(data?.error || (lang === 'en' ? 'Project could not be loaded' : 'Projekt konnte nicht geladen werden'));
        }
        if (!contentType?.includes('application/json')) {
          throw new Error(lang === 'en' ? 'Server returned invalid JSON' : 'Server hat kein JSON zurückgegeben');
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          data.tasks = deduplicateById(data.tasks || []);
          data.columns = deduplicateById(data.columns || []);
        }
        setProject(data);
        localStorage.setItem(`uefn-cached-project-${projectId}`, JSON.stringify(data));
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching project from backend:', err);
        // Try fallback to local storage
        try {
          const cached = localStorage.getItem(`uefn-cached-project-${projectId}`);
          if (cached) {
            const data = JSON.parse(cached);
            setProject(data);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing cached project:', e);
        }
        setError(err.message);
        setIsLoading(false);
      });

    // Establish WebSocket Connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const newSocket = io(`${protocol}//${window.location.host}`, {
      transports: ['websocket'],
      upgrade: false
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-project', projectId);
    });

    newSocket.on('task-moved', ({ taskId, newColumnId, newPosition }: any) => {
      setProject(prev => {
        if (!prev) return prev;
        const tasks = prev.tasks || [];
        const taskIdx = tasks.findIndex(t => t.id === taskId);
        if (taskIdx === -1) return prev;

        const updatedTasks = [...tasks];
        updatedTasks[taskIdx] = { ...updatedTasks[taskIdx], columnId: newColumnId };

        const movedTasks = arrayMove(updatedTasks, taskIdx, newPosition);
        return { ...prev, tasks: movedTasks };
      });
    });

    newSocket.on('task-added', (task: Task) => {
      setProject(prev => {
        if (!prev) return prev;
        if (prev.tasks?.some(t => t.id === task.id)) return prev;
        return { ...prev, tasks: [...(prev.tasks || []), task] };
      });
    });

    newSocket.on('task-updated', (updatedTask: Task) => {
      setProject(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks: prev.tasks?.map(t => t.id === updatedTask.id ? updatedTask : t)
        };
      });
    });

    newSocket.on('task-deleted', (taskId: string) => {
      setProject(prev => {
        if (!prev) return prev;
        return { ...prev, tasks: prev.tasks?.filter(t => t.id !== taskId) };
      });
    });

    newSocket.on('column-added', (column: Column) => {
      setProject(prev => {
        if (!prev) return prev;
        if (prev.columns?.some(c => c.id === column.id)) return prev;
        return { ...prev, columns: [...(prev.columns || []), column] };
      });
    });

    newSocket.on('column-updated', (updatedColumn: Column) => {
      setProject(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns?.map(c => c.id === updatedColumn.id ? updatedColumn : c)
        };
      });
    });

    newSocket.on('column-deleted', (columnId: string) => {
      setProject(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns?.filter(c => c.id !== columnId),
          tasks: prev.tasks?.filter(t => t.columnId !== columnId)
        };
      });
    });

    newSocket.on('project-updated', ({ name, imageUrl, islandCode, status, notes }: any) => {
      setProject(prev => prev ? { ...prev, name, image_url: imageUrl, island_code: islandCode, status, notes } : prev);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [projectId, navigate]);

  // Local storage sync mechanism to automatically save task states and the entire project state whenever modified
  useEffect(() => {
    if (projectId && project) {
      // Save full project details cache
      localStorage.setItem(`uefn-cached-project-${projectId}`, JSON.stringify(project));
      
      // Save task sync specifically
      if (project.tasks) {
        localStorage.setItem(`uefn-tasks-sync-${projectId}`, JSON.stringify(project.tasks));
      }

      // Also update this project inside the main list of cached projects so it's consistent on the dashboard
      try {
        const cachedListStr = localStorage.getItem('uefn-cached-projects');
        if (cachedListStr) {
          const list = JSON.parse(cachedListStr) as Project[];
          const exists = list.some(p => p.id === projectId);
          let updatedList;
          if (exists) {
            updatedList = list.map(p => p.id === projectId ? { 
              ...p, 
              name: project.name, 
              image_url: project.image_url, 
              island_code: project.island_code, 
              status: project.status, 
              notes: project.notes,
              columns: project.columns,
              tasks: project.tasks
            } : p);
          } else {
            updatedList = [...list, {
              id: projectId,
              name: project.name,
              template: project.template || 'blank',
              image_url: project.image_url,
              island_code: project.island_code,
              status: project.status,
              notes: project.notes,
              columns: project.columns,
              tasks: project.tasks
            }];
          }
          localStorage.setItem('uefn-cached-projects', JSON.stringify(deduplicateById(updatedList)));
        }
      } catch (e) {
        console.error('Error updating cached projects list:', e);
      }
    }
  }, [projectId, project]);

  const activeTask = useMemo(() => 
    project?.tasks?.find(t => t.id === activeTaskId), 
    [activeTaskId, project?.tasks]
  );

  const selectedTask = useMemo(() => 
    project?.tasks?.find(t => t.id === selectedTaskId), 
    [selectedTaskId, project?.tasks]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !project) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';
    const isActiveAColumn = active.data.current?.type === 'Column';
    const isOverAColumn = over.data.current?.type === 'Column';

    if (isActiveAColumn && isOverAColumn) {
      const activeIndex = project.columns!.findIndex(c => c.id === activeId);
      const overIndex = project.columns!.findIndex(c => c.id === overId);
      const updatedColumns = arrayMove(project.columns!, activeIndex, overIndex);
      setProject({ ...project, columns: updatedColumns });
      
      // Persist column positions
      updatedColumns.forEach((col: Column, idx: number) => {
        fetch(`/api/columns/${col.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position: idx })
        }).catch(() => {});
      });
      return;
    }

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      const activeIndex = project.tasks!.findIndex(t => t.id === activeId);
      const overIndex = project.tasks!.findIndex(t => t.id === overId);
      const newColumnId = project.tasks![overIndex].columnId;

      if (project.tasks![activeIndex].columnId !== newColumnId) {
        const newTasks = [...project.tasks!];
        newTasks[activeIndex].columnId = newColumnId;
        const updatedTasks = arrayMove(newTasks, activeIndex, overIndex);
        setProject({ ...project, tasks: updatedTasks });
        
        socket?.emit('task-moved', { 
          projectId, 
          taskId: activeId, 
          newColumnId, 
          newPosition: overIndex 
        }).catch(() => {});
      } else {
        const updatedTasks = arrayMove(project.tasks!, activeIndex, overIndex);
        setProject({ ...project, tasks: updatedTasks });
        socket?.emit('task-moved', { 
          projectId, 
          taskId: activeId, 
          newColumnId, 
          newPosition: overIndex 
        }).catch(() => {});
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

        socket?.emit('task-moved', { 
          projectId, 
          taskId: activeId, 
          newColumnId: overId, 
          newPosition: 0 
        }).catch(() => {});
      }
    }
  };

  const handleDragEnd = () => setActiveTaskId(null);

  const logAction = async (action: string, details: string) => {
    try {
      await fetch(`/api/projects/${projectId}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: userEmail, action, details })
      });
    } catch (err) {
      console.error('Error logging action:', err);
    }
  };

  const updateTask = (updatedTask: Task) => {
    const oldTask = project?.tasks?.find(t => t.id === updatedTask.id);
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks?.map(t => t.id === updatedTask.id ? updatedTask : t)
      };
    });
    socket?.emit('task-updated', { projectId, task: updatedTask });
    
    if (oldTask && oldTask.title !== updatedTask.title) {
      logAction('task_updated', `Aufgabe "${oldTask.title}" umbenannt in "${updatedTask.title}".`);
    } else if (oldTask && oldTask.columnId !== updatedTask.columnId) {
      logAction('task_moved', `Aufgabe "${updatedTask.title}" verschoben.`);
    }
  };

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

    try {
      const res = await fetch(`/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newTaskId,
          projectId,
          columnId,
          title,
          description: '',
          notes: ''
        })
      });
      const savedTask = await res.json();
      socket?.emit('task-added', { projectId, task: savedTask });
      logAction('task_created', `Aufgabe "${title}" erstellt.`);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const deleteTask = async (taskId: string) => {
    const task = project?.tasks?.find(t => t.id === taskId);
    setProject(prev => {
      if (!prev) return prev;
      return { ...prev, tasks: prev.tasks?.filter(t => t.id !== taskId) };
    });

    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      socket?.emit('task-deleted', { projectId, taskId });
      if (task) logAction('task_deleted', `Aufgabe "${task.title}" gelöscht.`);
    } catch (err) {
      console.error('Error deleting task:', err);
    } finally {
      setSelectedTaskId(null);
    }
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

    try {
      await fetch(`/api/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: colId,
          projectId,
          title,
          position: project?.columns?.length || 0
        })
      });
      socket?.emit('column-added', { projectId, column: newCol });
      logAction('column_created', `Spalte "${title}" erstellt.`);
    } catch (err) {
      console.error('Error adding column:', err);
    } finally {
      setShowAddColumn(false);
    }
  };

  const updateColumn = async (columnId: string, title: string) => {
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns?.map(c => c.id === columnId ? { ...c, title } : c)
      };
    });

    try {
      await fetch(`/api/columns/${columnId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      socket?.emit('column-updated', { projectId, column: { id: columnId, title } });
      logAction('column_renamed', `Spalte umbenannt in "${title}".`);
    } catch (err) {
      console.error('Error updating column:', err);
    }
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

    try {
      await fetch(`/api/columns/${columnId}`, { method: 'DELETE' });
      socket?.emit('column-deleted', { projectId, columnId });
      logAction('column_deleted', `Spalte "${col.title}" gelöscht.`);
    } catch (err) {
      console.error('Error deleting column:', err);
    } finally {
      setColumnToDelete(null);
    }
  };

  const updateProject = (name: string, imageUrl: string, islandCode: string, status: string) => {
    const oldName = project?.name;
    const oldStatus = project?.status;
    setProject(prev => prev ? { ...prev, name, image_url: imageUrl, island_code: islandCode, status } : prev);
    socket?.emit('project-updated', { projectId, name, imageUrl, islandCode, status, notes: project?.notes || '' });
    if (oldName !== name) logAction('project_renamed', `Projekt umbenannt von "${oldName}" in "${name}".`);
    if (project?.island_code !== islandCode) logAction('island_code_updated', `Island Code aktualisiert auf "${islandCode}".`);
    if (oldStatus !== status) logAction('status_updated', `Status aktualisiert auf "${status}".`);
  };

  const handleManualSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowManualSaveSuccess(true);
      setTimeout(() => setShowManualSaveSuccess(false), 3000);
    }, 800);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-ue-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-ue-panel border border-ue-border rounded-2xl flex items-center justify-center mb-6">
          <AlertTriangle size={32} className="text-unreal-orange" />
        </div>
        <h2 className="text-2xl font-bold text-ue-text mb-2">
          {lang === 'en' ? 'Project Not Found' : 'Projekt nicht gefunden'}
        </h2>
        <p className="text-ue-text-muted mb-8 max-w-md">
          {error || (lang === 'en' ? 'The requested project does not exist.' : 'Das angeforderte Projekt existiert nicht.')}
        </p>
        <Link 
          to="/" 
          className="flex items-center gap-2 px-6 py-3 bg-ue-panel border border-ue-border hover:border-epic-cyan text-ue-text rounded-xl transition-all font-bold"
        >
          <ArrowLeft size={18} />
          {t.backToDashboard}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ue-bg text-ue-text">
      <Header 
        projectName={project.name} 
        tasks={project.tasks || []} 
        onSettings={() => setShowSettings(true)}
        onSave={handleManualSave}
        isSaving={isSaving}
        isProjectView
        onToggleNotes={toggleNotes}
        showNotesActive={showNotes}
      />

      <main className="flex-1 flex overflow-hidden bg-ue-bg relative">
        {/* Kanban Board Container */}
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full p-6 min-w-max w-full"
          >
            <div className="max-w-screen-2xl mx-auto h-full flex flex-col">
              {project.island_code && <FortniteStats islandCode={project.island_code} />}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <KanbanBoard 
                  columns={project.columns || []} 
                  tasks={project.tasks || []} 
                  onTaskClick={setSelectedTaskId}
                  onAddTask={(columnId) => {
                    setColumnIdForNewTask(columnId);
                  }}
                  onAddColumn={() => setShowAddColumn(true)}
                  onUpdateColumn={(id) => {
                    const col = project.columns?.find(c => c.id === id);
                    if (col) setColumnToRename(col);
                  }}
                  onDeleteColumn={deleteColumn}
                />

                <DragOverlay dropAnimation={{
                  sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
                }}>
                  {activeTask && (
                    <div className="bg-ue-panel border border-epic-cyan/50 p-4 rounded-lg shadow-2xl w-72 rotate-3 cursor-grabbing scale-105 transition-transform">
                      <h4 className="font-medium text-sm text-ue-text">{activeTask.title}</h4>
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            </div>
          </motion.div>
        </div>

        {/* Notes Panel Container */}
        <AnimatePresence>
          {showNotes && (
            <ProjectNotesPanel 
              project={project} 
              onUpdateNotes={(newNotes) => {
                setProject(prev => prev ? { ...prev, notes: newNotes } : prev);
                socket?.emit('project-updated', { 
                  projectId, 
                  name: project.name, 
                  imageUrl: project.image_url, 
                  islandCode: project.island_code, 
                  status: project.status,
                  notes: newNotes
                }).catch(() => {});
              }}
              onClose={() => {
                setShowNotes(false);
                try {
                  localStorage.setItem(`uefn-show-notes-${projectId}`, 'false');
                } catch (e) {}
              }}
              
            />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedTask && (
          <TaskModal key="view-taskmodal" 
            task={selectedTask} 
            onClose={() => setSelectedTaskId(null)} 
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        )}
        {showSettings && (
          <ProjectSettingsModal key="view-settings"
            onArchive={handleArchive} 
            project={project}
            onClose={() => setShowSettings(false)}
            onUpdate={updateProject}
          />
        )}
        <InputModal key="add-column" 
          isOpen={showAddColumn}
          title={lang === 'en' ? 'Add New Column' : 'Neue Spalte hinzufügen'}
          placeholder={lang === 'en' ? 'Enter column name...' : 'Spaltenname eingeben...'}
          onConfirm={addColumn}
          onCancel={() => setShowAddColumn(false)}
        />
        <InputModal key="add-task" 
          isOpen={!!columnIdForNewTask}
          title={lang === 'en' ? 'Add New Task' : 'Neue Aufgabe hinzufügen'}
          placeholder={lang === 'en' ? 'Enter task title...' : 'Aufgabentitel eingeben...'}
          onConfirm={(title) => {
            if (columnIdForNewTask && title.trim()) {
              addTask(columnIdForNewTask, title.trim());
            }
            setColumnIdForNewTask(null);
          }}
          onCancel={() => setColumnIdForNewTask(null)}
        />
        <InputModal key="rename-column" 
          isOpen={!!columnToRename}
          title={lang === 'en' ? 'Rename Column' : 'Spalte umbenennen'}
          placeholder={lang === 'en' ? 'New column name...' : 'Neuer Spaltenname...'}
          defaultValue={columnToRename?.title}
          onConfirm={(title) => {
            if (columnToRename) updateColumn(columnToRename.id, title);
            setColumnToRename(null);
          }}
          onCancel={() => setColumnToRename(null)}
        />
        <ConfirmModal key="delete-column" 
          isOpen={!!columnToDelete}
          title={lang === 'en' ? 'Delete Column' : 'Spalte löschen'}
          message={lang === 'en' ? 'Are you sure you want to delete this column and all its tasks?' : 'Bist du sicher, dass du diese Spalte und alle darin enthaltenen Aufgaben löschen möchtest?'}
          type="danger"
          confirmText={lang === 'en' ? 'Delete' : 'Löschen'}
          cancelText={lang === 'en' ? 'Cancel' : 'Abbrechen'}
          onConfirm={confirmDeleteColumn}
          onCancel={() => setColumnToDelete(null)}
        />
        {showAutoSaveToast && (
          <motion.div
            key="view-autosave"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[9999] bg-ue-panel/95 backdrop-blur-md border border-emerald-500/30 text-ue-text rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] p-3 px-4 flex items-center gap-3"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Autosave</span>
              <span className="text-[11px] font-bold text-ue-text-muted">
                {lang === 'en' ? 'Progress saved successfully' : 'Fortschritt erfolgreich gesichert'}
              </span>
            </div>
          </motion.div>
        )}
        {showManualSaveSuccess && (
          <motion.div
            key="view-manualsave"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[9999] bg-ue-panel/95 backdrop-blur-md border border-epic-cyan/30 text-ue-text rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.15)] p-3 px-4 flex items-center gap-3"
          >
            <div className="w-5 h-5 rounded-full bg-epic-cyan/10 border border-epic-cyan/30 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-epic-cyan animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-epic-cyan">Save</span>
              <span className="text-[11px] font-bold text-ue-text-muted">
                {lang === 'en' ? 'All changes saved' : 'Alle Änderungen gespeichert'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
