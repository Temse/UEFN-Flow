import { useLanguage } from '../lib/LanguageContext';
import React from 'react';
import { ArrowLeft, Settings, MessageSquare, Save, Loader2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Task } from '../types';
import { Language, translations } from '../lib/translations';
import { calculateProgress } from '../lib/progress';

interface HeaderProps {
  projectName: string;
  tasks: Task[];
  onSettings?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  isProjectView?: boolean;
  onToggleNotes?: () => void;
  showNotesActive?: boolean;
}

export default function Header({ 
  projectName, 
  tasks, 
  onSettings, 
  onSave, 
  isSaving, 
  isProjectView,
  onToggleNotes,
  showNotesActive
}: HeaderProps) {
  const progress = calculateProgress(tasks, []);
  
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <header className="h-16 border-b border-ue-border bg-ue-panel flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {isProjectView && (
          <Link 
            to="/" 
            className="p-2 text-ue-text-muted hover:text-ue-text hover:bg-ue-bg rounded-lg transition-colors"
            title={t.backToDashboard}
          >
            <ArrowLeft size={20} />
          </Link>
        )}
        <Link 
          to="/" 
          className="relative hover:scale-105 active:scale-95 transition-transform cursor-pointer block"
          title={t.backToDashboard}
        >
          <div className="w-8 h-8 bg-unreal-orange rounded flex items-center justify-center font-bold text-ue-text">
            U
          </div>
          {isProjectView && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-epic-cyan rounded-full border-2 border-ue-panel animate-pulse" />
          )}
        </Link>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold tracking-tight truncate max-w-[200px] leading-none text-ue-text">{projectName}</h1>
          {isProjectView && <span className="text-[9px] font-bold text-epic-cyan uppercase tracking-widest mt-1">Live Sync</span>}
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-ue-text-muted uppercase tracking-wider">{t.progressLabel}</span>
          <span className="text-xs font-bold text-epic-cyan">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-ue-bg rounded-full overflow-hidden border border-ue-border">
          <div 
            className="h-full bg-epic-cyan transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,229,255,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a 
          href="https://discord.com/invite/f6eH8THBBG" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-ue-text-muted hover:text-epic-cyan hover:bg-ue-bg rounded-lg transition-colors"
          title="Discord & Bug Reports"
        >
          <MessageSquare size={20} />
        </a>
        {isProjectView && onSave && (
          <button 
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-epic-cyan hover:bg-white disabled:opacity-50 text-ue-bg text-xs font-black uppercase tracking-wider rounded-md transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:scale-105 active:scale-95"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>{t.saving}</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>{t.saveBtn}</span>
              </>
            )}
          </button>
        )}
        {isProjectView && onToggleNotes && (
          <button 
            onClick={onToggleNotes}
            className={`flex items-center gap-2 px-4 py-2 bg-ue-bg border rounded-md transition-all cursor-pointer text-xs font-bold uppercase tracking-wider ${
              showNotesActive 
                ? 'border-unreal-orange text-unreal-orange shadow-[0_0_15px_rgba(241,90,36,0.25)] bg-unreal-orange/10' 
                : 'border-ue-border hover:border-unreal-orange hover:text-unreal-orange text-ue-text'
            }`}
            title={t.toggleNotes}
          >
            <FileText size={14} />
            <span>{t.notesBtn}</span>
          </button>
        )}
        {isProjectView && onSettings && (
          <button 
            onClick={onSettings}
            className="flex items-center gap-2 px-4 py-2 bg-ue-bg border border-ue-border hover:border-epic-cyan hover:text-epic-cyan text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer text-ue-text"
          >
            <Settings size={14} />
            {t.settingsTitle}
          </button>
        )}
      </div>
    </header>
  );
}
