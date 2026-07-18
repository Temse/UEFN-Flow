import { calculateProgress } from '../lib/progress';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Folder, Clock, Trash2, ArrowRight, Layout, Sparkles, MessageSquare, Activity, Monitor, Globe, Sun, Moon, Download, Settings, Upload, Save, Loader2, Archive, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { Project, ProjectTemplate, ProjectLog, deduplicateById } from '../types';
import OnboardingModal from './OnboardingModal';
import { ConfirmModal } from './Modal';
import LanguageSelectorModal from './LanguageSelectorModal';
import ImportExportModal from './ImportExportModal';
import { getInitialColumns, getTemplateTasks } from '../constants';
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
}

function ProjectCard({ project, onDelete, onArchive, onExport, index, lang }: any) {
  const t = translations[lang];
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
              onClick={(e) => onExport(project, e)}
              className="p-2 bg-black/60 hover:bg-epic-cyan text-ue-text rounded-lg backdrop-blur-md transition-all hover:scale-110 border border-white/10 cursor-pointer"
              title={t.exportProject}
            >
              <Download size={14} />
            </button>
            <button 
              onClick={(e) => onArchive(project.id, e)}
              className="p-2 bg-black/60 hover:bg-emerald-500 text-ue-text rounded-lg backdrop-blur-md transition-all hover:scale-110 border border-white/10 cursor-pointer"
              title={project.archived ? t.unarchiveProject : t.archiveProject}
            >
              <Archive size={14} />
            </button>
            <button 
              onClick={(e) => onDelete(project.id, e)}
              className="p-2 bg-black/60 hover:bg-unreal-orange text-ue-text rounded-lg backdrop-blur-md transition-all hover:scale-110 border border-white/10 cursor-pointer"
              title={t.deleteProject}
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
                <span className="text-ue-text-muted font-bold">{t.completion}:</span>
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
              {t.openBtn} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
    } catch (e) {
      return [];
    }
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('uefn-cached-projects');
      return cached ? false : true;
    } catch (e) {
      return true;
    }
  });
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [showImportExport, setShowImportExport] = useState<{mode: 'import' | 'export', data?: string} | null>(null);
  
  const handleImport = (dataStr: string) => {
    try {
      const parsed = JSON.parse(dataStr);
      // Generate a new ID to avoid collisions if they re-import the same project
      const newId = 'proj_' + Math.random().toString(36).substr(2, 9);
      const newProj = { ...parsed, id: newId };
      const updatedList = [...projects, newProj];
      setProjects(deduplicateById(updatedList));
      localStorage.setItem('uefn-cached-projects', JSON.stringify(deduplicateById(updatedList)));
      localStorage.setItem(`uefn-cached-project-${newId}`, JSON.stringify(newProj));
      setShowImportExport(null);
    } catch (e) {
      console.error(e);
      alert(t.importFailed);
    }
  };

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
    }, 300000);
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
      const cached = localStorage.getItem('uefn-cached-projects');
      if (cached) {
        setProjects(deduplicateById(JSON.parse(cached)));
      } else {
        setProjects([]);
      }
    } catch (cacheErr) {
      console.error('Error loading cached projects:', cacheErr);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (name: string, template: ProjectTemplate, island_code?: string, customTemplateId?: string) => {
    let columns = getInitialColumns(lang);
    let tasks = getTemplateTasks(template, lang);
    
    try {
      if (customTemplateId) {
        let templates: any[] = [];
        try {
          const cached = localStorage.getItem("uefn-custom-templates");
          if (cached) templates = JSON.parse(cached);
        } catch(e) {
          console.error(e);
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
      alert(t.localSaveError);
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
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    const updatedProjects = projects.filter(p => p.id !== projectToDelete);
    setProjects(updatedProjects);
    localStorage.setItem("uefn-cached-projects", JSON.stringify(deduplicateById(updatedProjects)));
    localStorage.removeItem(`uefn-cached-project-${projectToDelete}`);
    setProjectToDelete(null);
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectToDelete(id);
  };

  const t = translations[lang];

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-ue-bg text-ue-text font-sans pb-24">
      <header className="border-b border-ue-border bg-ue-panel/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-unreal-orange rounded flex items-center justify-center font-black text-ue-panel">U</div>
            <span className="font-bold text-lg">{t.dashboardTitle}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLanguageSelector(true)}
              className="text-ue-text-muted hover:text-epic-cyan transition-colors p-2"
              title={t.languageLabel}
            >
              <Globe size={18} />
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-ue-text-muted hover:text-epic-cyan transition-colors p-2"
              title={t.themeLabel}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setShowImportExport({ mode: 'import' })}
              className="text-ue-text-muted hover:text-epic-cyan transition-colors flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded bg-ue-border/50 hover:bg-ue-border"
              title={t.importProject}
            >
              <Upload size={16} />
              {t.importBtn}
            </button>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="text-ue-text-muted hover:text-epic-cyan transition-colors flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded bg-ue-border/50 hover:bg-ue-border"
            >
              <Archive size={16} />
              {showArchived ? t.hideArchivedBtn : t.showArchivedBtn}
            </button>
            <button 
              onClick={() => setShowOnboarding(true)}
              className="bg-epic-cyan hover:bg-[#00c9e0] text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus size={16} />
              {t.newProjectBtn}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">
              {t.dashboardSubtitle}
            </h1>
            <p className="text-ue-text-muted">
              {t.activeProjectsStats}
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ue-text-muted" size={18} />
            <input
              type="text"
              placeholder={t.searchProjects || "Search projects..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ue-panel/50 border border-ue-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-epic-cyan text-ue-text placeholder-ue-text-muted/50"
            />
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-24 bg-ue-panel/30 border border-ue-border rounded-2xl border-dashed">
            <Folder size={48} className="mx-auto text-ue-border mb-4" />
            <h2 className="text-xl font-bold mb-2">{t.noProjectsTitle}</h2>
            <p className="text-ue-text-muted mb-6">{t.noProjectsSubtitle}</p>
            <button 
              onClick={() => setShowOnboarding(true)}
              className="bg-epic-cyan hover:bg-[#00c9e0] text-black font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Plus size={18} />
              {t.startBtn}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {projects
                .filter((p) => (showArchived ? p.archived : !p.archived))
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .sort((a, b) => {
                  const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                  const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                  return dateB - dateA;
                })
                .map((project, index) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onDelete={deleteProject} 
                    onArchive={archiveProject}
                    onExport={(p, e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const fullProject = localStorage.getItem(`uefn-cached-project-${p.id}`);
                      if (fullProject) {
                        setShowImportExport({ mode: 'export', data: fullProject });
                      } else {
                        setShowImportExport({ mode: 'export', data: JSON.stringify(p, null, 2) });
                      }
                    }}
                    index={index}
                    lang={lang}
                  />
                ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal 
            onCancel={() => setShowOnboarding(false)} 
            onComplete={handleCreateProject} 
          />
        )}
        
        {projectToDelete && (
          <ConfirmModal isOpen={true}
            title={t.deleteProjectTitle}
            message={t.deleteProjectConfirm}
            confirmText={t.deleteBtn}
            cancelText={t.cancelBtn}
            onConfirm={confirmDeleteProject}
            onCancel={() => setProjectToDelete(null)}
          />
        )}

        {showLanguageSelector && (
          <LanguageSelectorModal
            isOpen={true} defaultLang={lang}
            onSelect={(l) => {
              setLang(l);
              setShowLanguageSelector(false);
            }}
            onClose={() => setShowLanguageSelector(false)}
          />
        )}
      {showImportExport && (
          <ImportExportModal
            mode={showImportExport.mode}
            exportData={showImportExport.data}
            onImport={handleImport}
            onClose={() => setShowImportExport(null)}
            lang={lang}
          />
        )}
      </AnimatePresence>
      <footer className="max-w-7xl mx-auto px-6 pb-6 text-center text-ue-text-muted text-sm flex items-center justify-center gap-4">
        <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="hover:text-epic-cyan transition-colors">Discord</a>
        <span>&bull;</span>
        <span>made by hifn_w</span>
      </footer>
    </div>
  );
}
