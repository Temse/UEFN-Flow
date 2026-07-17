import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Folder, Clock, Trash2, ArrowRight, Layout, Sparkles, MessageSquare, Activity, Monitor, Globe, Sun, Moon, Download, Settings, Upload, Save, Loader2, Archive } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { Project, ProjectTemplate, ProjectLog, deduplicateById } from '../types';
import OnboardingModal from './OnboardingModal';
import { ConfirmModal } from './Modal';
import LanguageSelectorModal from './LanguageSelectorModal';
import { INITIAL_COLUMNS, getTemplateTasks } from '../constants';
import { translations, Language } from '../lib/translations';
import { useLanguage } from '../lib/LanguageContext';

import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

function getStatusBadgeClass(status: string) {
  const s = (status || '').toLowerCase().trim();
  if (s === 'online' || s === 'live' || s === 'bereit') {
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  } else if (s === 'offline' || s === 'inaktiv') {
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  } else if (s === 'private' || s === 'privat') {
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  } else if (s === 'public' || s === 'öffentlich') {
    return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
  } else if (s === 'draft' || s === 'entwurf' || s === 'wip') {
    return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
  } else {
    return 'text-epic-cyan bg-cyan-500/10 border-epic-cyan/20';
  }
}

function calculateProjectStats(project: any) {
  const tasks = project.tasks || [];
  const columns = project.columns || [];

  // 1. Progress (Abschluss)
  let progress = 0;
  if (tasks.length > 0) {
    const totalSubTasks = tasks.reduce((acc: number, task: any) => acc + (task.subTasks?.length || 0), 0);
    const completedSubTasks = tasks.reduce(
      (acc: number, task: any) => acc + (task.subTasks?.filter((st: any) => st.completed || st.completed === 1).length || 0), 
      0
    );

    if (totalSubTasks > 0) {
      progress = Math.round((completedSubTasks / totalSubTasks) * 100);
    } else if (columns.length > 0) {
      // Fallback: use column positions
      const sortedCols = [...columns].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
      const lastColId = sortedCols[sortedCols.length - 1]?.id;
      if (lastColId) {
        const completedTasks = tasks.filter((t: any) => t.column_id === lastColId || t.columnId === lastColId).length;
        progress = Math.round((completedTasks / tasks.length) * 100);
      }
    }
  }

  // 2. Health (Gesundheit)
  let health = 100;
  if (tasks.length > 0) {
    const pendingCritical = tasks.filter((t: any) => {
      const isCrit = t.is_critical === 1 || t.is_critical === true || t.isCritical === true;
      const sortedCols = [...columns].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
      const lastColId = sortedCols.length > 0 ? sortedCols[sortedCols.length - 1].id : null;
      const isCompleted = lastColId ? (t.column_id === lastColId || t.columnId === lastColId) : false;
      return isCrit && !isCompleted;
    }).length;

    const overdueCount = tasks.filter((t: any) => {
      const dueDateStr = t.due_date || t.dueDate;
      if (!dueDateStr) return false;
      
      const sortedCols = [...columns].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
      const lastColId = sortedCols.length > 0 ? sortedCols[sortedCols.length - 1].id : null;
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

function ProjectCard({ project, onDelete, onArchive, index, lang }: any) {
  const displayStatus = project.status || (project.template && typeof project.template === 'string' ? project.template.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : 'Blank');
  const projStats = calculateProjectStats(project);

  return (
    <div
      className="outline-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 110,
          damping: 15,
          delay: index * 0.04 
        }}
        whileHover={{ 
          y: -10,
          scale: 1.015,
        }}
        className="h-full"
      >
        <Link 
          to={`/project/${project.id}`}
          className="group block bg-ue-panel border border-ue-border rounded-2xl overflow-hidden hover:border-epic-cyan/50 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative h-full"
        >
        <div className="h-40 bg-ue-bg relative overflow-hidden">
          {project.image_url ? (
            <img src={project.image_url} alt={project.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-1000 ease-out" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ue-panel to-ue-bg">
              <Layout size={48} className="text-ue-border group-hover:text-epic-cyan/30 transition-colors duration-500" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ue-panel via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-auto">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`/api/backup/export/${project.id}`, '_blank');
              }}
              className="p-2 bg-black/60 hover:bg-epic-cyan text-ue-text rounded-lg backdrop-blur-md transition-all hover:scale-110 border border-white/10 cursor-pointer"
              title={lang === 'en' ? 'Export Project' : 'Projekt exportieren'}
            >
              <Download size={14} />
            </button>
            <button 
              onClick={(e) => onArchive(project.id, e)}
              className="p-2 bg-black/60 hover:bg-emerald-500 text-ue-text rounded-lg backdrop-blur-md transition-all hover:scale-110 border border-white/10 cursor-pointer"
              title={lang === 'en' ? (project.archived ? 'Unarchive Project' : 'Archive Project') : (project.archived ? 'Projekt wiederherstellen' : 'Projekt archivieren')}
            >
              <Archive size={14} />
            </button>
            <button 
              onClick={(e) => onDelete(project.id, e)}
              className="p-2 bg-black/60 hover:bg-unreal-orange text-ue-text rounded-lg backdrop-blur-md transition-all hover:scale-110 border border-white/10 cursor-pointer"
              title={lang === 'en' ? 'Delete Project' : 'Projekt löschen'}
            >
              <Trash2 size={14} />
            </button>
          </div>

          {project.island_code && (
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-black/60 backdrop-blur-md rounded-lg px-2.5 py-1 border border-ue-border/50 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              >
                <div className="text-[7px] font-bold uppercase tracking-widest text-ue-text-muted mb-0.5">Island Code</div>
                <div className="text-[11px] font-black text-ue-text leading-none">{project.island_code}</div>
              </motion.div>
            </div>
          )}
        </div>
        <div className="p-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border shadow-sm transition-colors",
              getStatusBadgeClass(displayStatus)
            )}>
              {displayStatus}
            </span>
          </div>
          <h3 className="text-xl font-bold text-ue-text mb-4 group-hover:text-epic-cyan transition-colors line-clamp-1">{project.name}</h3>
          
          {/* Health & Progress Visual Display */}
          <div className="space-y-3 mb-5 bg-black/15 p-3.5 rounded-xl border border-ue-border/20">
            {/* Completion (Abschluss) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ue-text-muted font-bold">{lang === 'en' ? 'Completion' : 'Abschluss'}:</span>
                <span className="text-epic-cyan font-black">{projStats.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-ue-bg rounded-full overflow-hidden border border-ue-border/40">
                <div 
                  className="h-full bg-gradient-to-r from-epic-cyan to-cyan-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${projStats.progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-ue-text-muted text-xs">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              {new Date(project.created_at!).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1 group-hover:text-epic-cyan transition-colors font-bold uppercase tracking-widest text-[10px]">
              {lang === 'en' ? translations.en.openBtn : translations.de.openBtn} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const cached = localStorage.getItem('uefn-cached-projects');
      return cached ? deduplicateById(JSON.parse(cached)) : [];
    } catch {
      return [];
    }
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('uefn-cached-projects');
      return cached ? false : true;
    } catch {
      return true;
    }
  });
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showManualSaveSuccess, setShowManualSaveSuccess] = useState(false);
  const [showAutoSaveToast, setShowAutoSaveToast] = useState(false);

  // Load language and theme from localStorage
  const { lang, setLang, showLanguageSelector, setShowLanguageSelector } = useLanguage();
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('uefn-theme') as 'dark' | 'light') || 'dark';
  });

  const userEmail = 'thomasgerter@gmail.com';

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAutoSaveToast(true);
      const timer = setTimeout(() => setShowAutoSaveToast(false), 4000);
      return () => clearTimeout(timer);
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    localStorage.setItem('uefn-lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('uefn-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('uefn-light');
    } else {
      document.documentElement.classList.remove('uefn-light');
    }
  }, [theme]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const contentType = res.headers.get('content-type');
      if (!res.ok) throw new Error('Failed to fetch projects');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }
      const data = await res.json();
      const deduplicatedData = deduplicateById(data);
      setProjects(deduplicatedData);
      localStorage.setItem('uefn-cached-projects', JSON.stringify(deduplicatedData));
    } catch (err) {
      console.error('Error fetching projects:', err);
      try {
        const cached = localStorage.getItem('uefn-cached-projects');
        if (cached) {
          setProjects(deduplicateById(JSON.parse(cached)));
        }
      } catch (cacheErr) {
        console.error('Error loading cached projects:', cacheErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (name: string, template: ProjectTemplate, island_code?: string, customTemplateId?: string) => {
    let columns = INITIAL_COLUMNS;
    let tasks = getTemplateTasks(template);

    try {
      if (customTemplateId) {
        let templates = [];
        try {
          const tRes = await fetch("/api/templates");
          if (tRes.ok) templates = await tRes.json();
          else throw new Error("Fetch templates failed");
        } catch(e) {
          const cached = localStorage.getItem("uefn-cached-templates");
          if (cached) templates = JSON.parse(cached);
        }
        const custom = templates.find((t: any) => t.id === customTemplateId);
        if (custom) {
          columns = custom.columns;
          tasks = custom.tasks;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch custom template columns/tasks, using defaults:', e);
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          template,
          island_code,
          columns,
          tasks,
          userEmail: userEmail
        })
      });
      const data = await res.json();
      if (data.id) {
        // Optimistically cache locally
        const newProj: Project = {
          id: data.id,
          name,
          template,
          island_code: island_code || '',
          columns,
          tasks,
          status: 'Blank',
          notes: '',
          created_at: new Date().toISOString()
        };
        localStorage.setItem(`uefn-cached-project-${data.id}`, JSON.stringify(newProj));
        const updatedList = [...projects, newProj];
        localStorage.setItem('uefn-cached-projects', JSON.stringify(deduplicateById(updatedList)));
        
        navigate(`/project/${data.id}`);
      } else {
        throw new Error(data.error || 'Failed to create project on backend');
      }
    } catch (err) {
      console.warn('Error creating project on backend, using local storage fallback:', err);
      // Local Storage Fallback
      const localId = 'proj_' + Math.random().toString(36).substring(2, 11);
      const newProj: Project = {
        id: localId,
        name,
        template,
        island_code: island_code || '',
        columns,
        tasks,
        status: 'Blank',
        notes: '',
        created_at: new Date().toISOString()
      };

      try {
        localStorage.setItem(`uefn-cached-project-${localId}`, JSON.stringify(newProj));
        const updatedList = [...projects, newProj];
        setProjects(deduplicateById(updatedList));
        localStorage.setItem('uefn-cached-projects', JSON.stringify(deduplicateById(updatedList)));
        navigate(`/project/${localId}`);
      } catch (storageErr) {
        console.error('Local Storage also failed:', storageErr);
        alert(lang === 'en' ? 'Error saving project locally' : 'Fehler beim lokalen Sichern des Projekts');
      }
    }
  };

  const archiveProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const newArchivedState = !project.archived;
    const updatedProjects = projects.map(p => p.id === id ? { ...p, archived: newArchivedState } : p);
    setProjects(updatedProjects);
    localStorage.setItem("uefn-cached-projects", JSON.stringify(deduplicateById(updatedProjects)));
    try {
      await fetch(`/api/projects/${id}/archive`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: newArchivedState })
      });
    } catch (err) {
      console.error("Error archiving project:", err);
    }
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectToDelete(id);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    const id = projectToDelete;
    
    // Always update client-side immediately
    setProjects(prev => prev.filter(p => p.id !== id));
    try {
      localStorage.removeItem(`uefn-cached-project-${id}`);
      localStorage.removeItem(`uefn-tasks-sync-${id}`);
      localStorage.removeItem(`uefn-show-notes-${id}`);
      const cachedListStr = localStorage.getItem('uefn-cached-projects');
      if (cachedListStr) {
        const list = JSON.parse(cachedListStr) as Project[];
        const updatedList = list.filter(p => p.id !== id);
        localStorage.setItem('uefn-cached-projects', JSON.stringify(updatedList));
      }
    } catch (e) {
      console.error('Error cleaning up local storage on delete:', e);
    }

    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Error deleting project from backend, already removed from local storage fallback:', err);
    } finally {
      setProjectToDelete(null);
    }
  };

  const handleExportBackup = () => {
    try {
      const backupData = JSON.stringify(projects, null, 2);
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uefn-flow-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error exporting backup:', e);
      window.open('/api/backup/export', '_blank'); // fallback
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      let importedProjects = [];
      if (Array.isArray(jsonData)) importedProjects = jsonData;
      else if (jsonData.projects) importedProjects = jsonData.projects;
      else throw new Error("Invalid JSON format");
      try {
        const res = await fetch("/api/backup/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData)
        });
        if (!res.ok) throw new Error("Failed backend import");
      } catch (backendErr) {
        console.warn("Backend import failed, using local storage fallback:", backendErr);
        const currentListStr = localStorage.getItem("uefn-cached-projects");
        let currentList = currentListStr ? JSON.parse(currentListStr) : [];
        const combined = deduplicateById([...currentList, ...importedProjects]);
        localStorage.setItem("uefn-cached-projects", JSON.stringify(combined));
        importedProjects.forEach((p: any) => {
          localStorage.setItem(`uefn-cached-project-${p.id}`, JSON.stringify(p));
          if (p.tasks) localStorage.setItem(`uefn-tasks-sync-${p.id}`, JSON.stringify(p.tasks));
        });
      }
      alert(lang === "en" ? "Projects successfully imported!" : "Projekte erfolgreich importiert!");
      fetchProjects();
      setLastSaveTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Import error:", err);
      alert((lang === "en" ? "Error importing file: " : "Fehler beim Importieren der Datei: ") + (err as Error).message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Automated save timestamp tracking
  const [lastSaveTime, setLastSaveTime] = useState<string>(() => {
    return new Date().toLocaleTimeString();
  });

  const [showPreferences, setShowPreferences] = useState(false);
  const preferencesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (preferencesRef.current && !preferencesRef.current.contains(event.target as Node)) {
        setShowPreferences(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const t = translations[lang];
  const filteredProjects = deduplicateById<Project>(projects).filter(p => showArchived ? p.archived : !p.archived);

  return (
    <div className="min-h-screen bg-ue-bg relative flex flex-col">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#00e5ff0a,transparent)] pointer-events-none" />

      {/* Hidden file input for project import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".json" 
        onChange={handleImportFile} 
      />

      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto p-8">
          <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 border-b border-ue-border pb-8">
            <div>
              <h1 className="text-4xl font-black text-ue-text mb-2 tracking-tight">
                <Link to="/" className="flex items-center gap-3 hover:opacity-90 select-none cursor-pointer">
                  <div className="w-10 h-10 bg-unreal-orange rounded-xl flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,103,33,0.3)] text-ue-text">U</div>
                  <span>{t.dashboardTitle}</span>
                </Link>
              </h1>
              <p className="text-ue-text-muted text-sm">{t.dashboardSubtitle}</p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap relative">
              {/* Save Button */}
              <button 
                onClick={() => {
                  setIsSaving(true);
                  setTimeout(() => {
                    setIsSaving(false);
                    setShowManualSaveSuccess(true);
                    setTimeout(() => setShowManualSaveSuccess(false), 3000);
                  }, 700);
                }}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2.5 bg-epic-cyan hover:bg-white text-ue-bg disabled:opacity-50 text-xs font-black uppercase tracking-wider rounded-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                title={lang === 'en' ? 'Save Changes' : 'Änderungen speichern'}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{lang === 'en' ? 'Saving...' : 'Speichert...'}</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>{lang === 'en' ? 'Save' : 'Speichern'}</span>
                  </>
                )}
              </button>

              {/* Import Project Button */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-ue-panel border border-ue-border hover:border-epic-cyan hover:text-epic-cyan text-ue-text text-xs font-bold uppercase tracking-wider rounded-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                title={lang === 'en' ? 'Import Project JSON' : 'Projekt-JSON importieren'}
              >
                <Upload size={14} />
                <span>{lang === 'en' ? 'Import' : 'Importieren'}</span>
              </button>

              {/* Backup Now / Export Button */}
              <button 
                onClick={handleExportBackup}
                className="flex items-center gap-2 px-4 py-2.5 bg-ue-panel border border-ue-border hover:border-epic-cyan hover:text-epic-cyan text-ue-text text-xs font-bold uppercase tracking-wider rounded-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                title={lang === 'en' ? 'Backup All Projects' : 'Alle Projekte sichern'}
              >
                <Download size={14} />
                <span>{lang === 'en' ? 'Backup Now' : 'Jetzt sichern'}</span>
              </button>

              {/* User Preferences Small Icon Gear Dropdown */}
              <div className="relative" ref={preferencesRef}>
                <button 
                  onClick={() => setShowPreferences(!showPreferences)}
                  className={`flex items-center justify-center p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    showPreferences 
                      ? 'bg-epic-cyan/15 border-epic-cyan text-epic-cyan shadow-[0_0_15px_rgba(0,229,255,0.25)]' 
                      : 'bg-ue-panel border-ue-border text-ue-text hover:border-epic-cyan hover:text-epic-cyan'
                  }`}
                  title={lang === 'en' ? 'User Preferences' : 'Benutzereinstellungen'}
                >
                  <Settings size={18} className={showPreferences ? 'rotate-45 transition-transform duration-300' : 'transition-transform duration-300'} />
                </button>

                {/* Dropdown Content */}
                <AnimatePresence>
            <LanguageSelectorModal
              isOpen={showLanguageSelector}
              defaultLang={lang}
              onSelect={(l) => {
                setLang(l);
                setShowLanguageSelector(false);
              }}
              onClose={() => setShowLanguageSelector(false)}
            />

                  {showPreferences && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-72 bg-ue-panel border border-ue-border rounded-2xl shadow-2xl p-5 z-50 space-y-4"
                    >
                      <h4 className="font-bold text-xs uppercase tracking-wider text-ue-text border-b border-ue-border/50 pb-2">
                        {lang === 'en' ? 'User Preferences' : 'Benutzereinstellungen'}
                      </h4>

                      {/* Language Picker */}
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-ue-text-muted mb-2">
                          {t.languageLabel}
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => {
                              setLang('en');
                              setLastSaveTime(new Date().toLocaleTimeString());
                            }}
                            className={`py-1.5 px-2.5 rounded-lg border font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              lang === 'en'
                                ? 'bg-cyan-500/10 border-epic-cyan text-epic-cyan font-extrabold'
                                : 'bg-ue-bg border-ue-border text-ue-text-muted hover:border-ue-text-muted/60'
                            }`}
                          >
                            🇺🇸 EN
                          </button>
                          <button
                            onClick={() => {
                              setLang('de');
                              setLastSaveTime(new Date().toLocaleTimeString());
                            }}
                            className={`py-1.5 px-2.5 rounded-lg border font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              lang === 'de'
                                ? 'bg-cyan-500/10 border-epic-cyan text-epic-cyan font-extrabold'
                                : 'bg-ue-bg border-ue-border text-ue-text-muted hover:border-ue-text-muted/60'
                            }`}
                          >
                            🇩🇪 DE
                          </button>
                        </div>
                      </div>

                      {/* Theme Selector */}
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-ue-text-muted mb-2">
                          {t.themeLabel}
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => {
                              setTheme('dark');
                              setLastSaveTime(new Date().toLocaleTimeString());
                            }}
                            className={`py-1.5 px-1.5 rounded-lg border font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              theme === 'dark'
                                ? 'bg-unreal-orange/10 border-unreal-orange text-unreal-orange font-extrabold'
                                : 'bg-ue-bg border-ue-border text-ue-text-muted hover:border-ue-text-muted/60'
                            }`}
                          >
                            <Moon size={11} />
                            {lang === 'en' ? 'Epic Dark' : 'Dunkel'}
                          </button>
                          <button
                            onClick={() => {
                              setTheme('light');
                              setLastSaveTime(new Date().toLocaleTimeString());
                            }}
                            className={`py-1.5 px-1.5 rounded-lg border font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              theme === 'light'
                                ? 'bg-unreal-orange/10 border-unreal-orange text-unreal-orange font-extrabold'
                                : 'bg-ue-bg border-ue-border text-ue-text-muted hover:border-ue-text-muted/60'
                            }`}
                          >
                            <Sun size={11} />
                            {lang === 'en' ? 'Light' : 'Hell'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  showArchived
                    ? "bg-cyan-500/20 border-epic-cyan text-epic-cyan"
                    : "bg-ue-panel border-ue-border text-ue-text-muted hover:border-ue-text-muted hover:text-ue-text"
                }`}
              >
                <Archive size={16} />
                <span>{showArchived ? t.hideArchivedBtn : t.showArchivedBtn}</span>
              </button>

              {/* Create New Project Button */}
              <button 
                onClick={() => setShowOnboarding(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-epic-cyan text-ue-bg font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:scale-[1.02] active:scale-95 group cursor-pointer"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>{t.newProjectBtn}</span>
              </button>
            </div>
          </header>

          {loading ? (
            <LoadingScreen />
          ) : projects.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-black/5 dark:bg-black/50 backdrop-blur-md border border-ue-border rounded-3xl p-12 text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-epic-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-20 h-20 bg-ue-bg rounded-2xl flex items-center justify-center mx-auto mb-6 border border-ue-border relative z-10">
                <Folder size={40} className="text-ue-text-muted group-hover:text-epic-cyan transition-colors" />
              </div>
              <h2 className="text-2xl font-bold mb-2 relative z-10">{t.noProjectsTitle}</h2>
              <p className="text-ue-text-muted mb-8 relative z-10">{t.noProjectsSubtitle}</p>
              
              {/* Language selection also visible when no projects exist */}
              <div className="flex justify-center gap-4 mb-6 relative z-10">
                <button onClick={() => setLang('de')} className={`text-xs px-2.5 py-1 rounded border ${lang === 'de' ? 'border-epic-cyan text-epic-cyan bg-epic-cyan/5' : 'border-ue-border text-ue-text-muted'} font-bold`}>DE</button>
                <div className="w-px h-5 bg-ue-border" />
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-xs px-2.5 py-1 rounded border border-ue-border text-ue-text-muted font-bold flex items-center gap-1">
                  {theme === 'dark' ? <Moon size={10} /> : <Sun size={10} />}
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </button>
              </div>

              <button 
                onClick={() => setShowOnboarding(true)}
                className="px-8 py-3 bg-ue-bg border border-ue-border hover:border-epic-cyan hover:text-epic-cyan rounded-xl transition-all relative z-10 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] font-bold uppercase tracking-wider text-xs cursor-pointer"
              >
                {t.startBtn}
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onDelete={deleteProject}
                  onArchive={archiveProject} 
                  index={index} 
                  lang={lang}
                />
              ))}
            </div>
          )}

          <AnimatePresence>
            {showOnboarding && (
              <OnboardingModal key="dashboard-onboarding" 
                onComplete={(name, template, islandCode, customTemplateId) => {
                  handleCreateProject(name, template, islandCode, customTemplateId);
                  setShowOnboarding(false);
                }} 
                onCancel={() => setShowOnboarding(false)}
              />
            )}
            {showAutoSaveToast && (
              <motion.div
                key="dashboard-autosave"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-[9999] bg-black/90 dark:bg-black/95 backdrop-blur-md border border-emerald-500/30 text-ue-text rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] p-3 px-4 flex items-center gap-3"
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
                key="dashboard-manualsave"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-[9999] bg-black/90 dark:bg-black/95 backdrop-blur-md border border-epic-cyan/30 text-ue-text rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.15)] p-3 px-4 flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-epic-cyan/30 flex items-center justify-center">
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
            <ConfirmModal key="dashboard-confirm" 
              isOpen={!!projectToDelete}
              title={t.deleteProjectTitle}
              message={t.deleteProjectConfirm}
              type="danger"
              confirmText={t.deleteBtn}
              cancelText={t.cancelBtn}
              onConfirm={confirmDeleteProject}
              onCancel={() => setProjectToDelete(null)}
            />
          </AnimatePresence>
        </div>

        <footer className="mt-20 py-8 border-t border-ue-border flex flex-col md:flex-row items-center justify-between gap-4 text-ue-text-muted max-w-7xl mx-auto px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <div className="w-6 h-6 bg-ue-panel border border-ue-border rounded flex items-center justify-center text-ue-text text-[10px]">U</div>
            UEFN Flow &copy; 2026
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://discord.com/invite/f6eH8THBBG" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-epic-cyan transition-colors"
            >
              <MessageSquare size={14} />
              Bug Reports & Discord
            </a>
            <div className="w-1 h-1 rounded-full bg-ue-border" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 font-mono">v1.1.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
