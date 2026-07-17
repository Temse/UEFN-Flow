import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Image as ImageIcon, Upload, Trash2, Save, Layout, Zap, DollarSign, Shield, Sword, Ghost, Car, Target, Users, Flag, Gamepad2, EyeOff, Mountain, ArrowUp, Palette, FileText } from 'lucide-react';
import { Project } from '../types';
import { cn } from '../lib/utils';
import { nanoid } from 'nanoid';
import { translations, Language } from '../lib/translations';
import { useLanguage } from '../lib/LanguageContext';

interface ProjectSettingsModalProps { key?: string | number;
  onArchive?: () => void;
  project: Project;
  onClose: () => void;
  onUpdate: (name: string, imageUrl: string, islandCode: string, status: string) => void;
}

export default function ProjectSettingsModal({ project, onClose, onUpdate, onArchive }: ProjectSettingsModalProps) {
  const [name, setName] = useState(project.name);
  const [imageUrl, setImageUrl] = useState(project.image_url || '');
  const [islandCode, setIslandCode] = useState(project.island_code || '');
  const [status, setStatus] = useState(project.status || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('Layout');

  const { lang } = useLanguage();
  const t = translations[lang];

  const isPreset = ['online', 'offline', 'private', 'privat'].includes((project.status || '').toLowerCase().trim());
  const [isCustomMode, setIsCustomMode] = useState(!isPreset && (project.status || '') !== '');

  const icons = [
    { name: 'Layout', icon: Layout },
    { name: 'Zap', icon: Zap },
    { name: 'DollarSign', icon: DollarSign },
    { name: 'Shield', icon: Shield },
    { name: 'Sword', icon: Sword },
    { name: 'Ghost', icon: Ghost },
    { name: 'Car', icon: Car },
    { name: 'Target', icon: Target },
    { name: 'Users', icon: Users },
    { name: 'Flag', icon: Flag },
    { name: 'Gamepad2', icon: Gamepad2 },
    { name: 'EyeOff', icon: EyeOff },
    { name: 'Mountain', icon: Mountain },
    { name: 'ArrowUp', icon: ArrowUp },
    { name: 'Palette', icon: Palette },
    { name: 'FileText', icon: FileText },
  ];

  const handleSave = () => {
    onUpdate(name, imageUrl, islandCode, status);
    onClose();
  };

  const handleSaveTemplate = async () => {
    setIsSavingTemplate(true);
    try {
      const newTemplate = {
        id: nanoid(),
        name: `${project.name} (${lang === "en" ? "Template" : "Vorlage"})`,
        columns: project.columns,
        tasks: project.tasks,
        icon: selectedIcon
      };
      try {
        const response = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTemplate)
        });
        if (!response.ok) throw new Error("Backend error");
      } catch (backendErr) {
        console.warn("Template backend save failed, using local fallback", backendErr);
        const currentTemplatesStr = localStorage.getItem("uefn-cached-templates");
        const currentTemplates = currentTemplatesStr ? JSON.parse(currentTemplatesStr) : [];
        currentTemplates.push(newTemplate);
        localStorage.setItem("uefn-cached-templates", JSON.stringify(currentTemplates));
      }
      alert(lang === "en" ? "Template successfully saved!" : "Vorlage erfolgreich gespeichert!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(lang === 'en' ? 'Please upload images only.' : 'Bitte lade nur Bilder hoch.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImageUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-ue-panel border border-ue-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-ue-border flex items-center justify-between bg-ue-bg/50 shrink-0">
          <h2 className="text-xl font-bold text-ue-text">{t.settingsTitle}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-ue-text-muted hover:text-ue-text cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Project Name */}
          <section>
            <label className="block text-xs font-bold uppercase tracking-widest text-ue-text-muted mb-2">
              {lang === 'en' ? 'Project Name' : 'Projektname'}
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-ue-bg border border-ue-border rounded-lg px-4 py-2 text-ue-text focus:border-epic-cyan outline-none transition-colors"
            />
          </section>

          {/* Island Code */}
          <section>
            <label className="block text-xs font-bold uppercase tracking-widest text-ue-text-muted mb-2">
              Island Code
            </label>
            <input 
              type="text" 
              value={islandCode}
              onChange={(e) => setIslandCode(e.target.value)}
              placeholder="0000-0000-0000"
              className="w-full bg-ue-bg border border-ue-border rounded-lg px-4 py-2 text-ue-text focus:border-epic-cyan outline-none transition-colors"
            />
          </section>

          {/* Customizable Status */}
          <section>
            <label className="block text-xs font-bold uppercase tracking-widest text-ue-text-muted mb-2">
              {lang === 'en' ? 'Project Status' : 'Projektstatus'}
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setStatus(lang === 'en' ? 'Online' : 'Online');
                  setIsCustomMode(false);
                }}
                className={cn(
                  "py-2 px-1 text-xs font-bold rounded-lg border transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer",
                  (!isCustomMode && status.toLowerCase() === 'online')
                    ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                    : "bg-ue-bg border-ue-border text-ue-text-muted hover:border-emerald-500/40 hover:text-emerald-400"
                )}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                Online
              
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatus(lang === 'en' ? 'Offline' : 'Offline');
                  setIsCustomMode(false);
                }}
                className={cn(
                  "py-2 px-1 text-xs font-bold rounded-lg border transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer",
                  (!isCustomMode && status.toLowerCase() === 'offline')
                    ? "bg-rose-500/15 border-rose-500 text-rose-400 font-extrabold shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                    : "bg-ue-bg border-ue-border text-ue-text-muted hover:border-rose-500/40 hover:text-rose-400"
                )}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444]" />
                Offline
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatus(lang === 'en' ? 'Private' : 'Privat');
                  setIsCustomMode(false);
                }}
                className={cn(
                  "py-2 px-1 text-xs font-bold rounded-lg border transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer",
                  (!isCustomMode && (status.toLowerCase() === 'private' || status.toLowerCase() === 'privat'))
                    ? "bg-amber-500/15 border-amber-500 text-amber-400 font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                    : "bg-ue-bg border-ue-border text-ue-text-muted hover:border-amber-500/40 hover:text-amber-400"
                )}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                {lang === 'en' ? 'Private' : 'Privat'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(true);
                  if (['online', 'offline', 'private', 'privat'].includes(status.toLowerCase())) {
                    setStatus('');
                  }
                }}
                className={cn(
                  "py-2 px-1 text-xs font-bold rounded-lg border transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer",
                  isCustomMode
                    ? "bg-epic-cyan/15 border-epic-cyan text-epic-cyan font-extrabold shadow-[0_0_12px_rgba(0,229,255,0.15)]"
                    : "bg-ue-bg border-ue-border text-ue-text-muted hover:border-epic-cyan/40 hover:text-epic-cyan"
                )}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-epic-cyan shadow-[0_0_8px_#00e5ff]" />
                {lang === 'en' ? 'Custom' : 'Eigener'}
              </button>
            </div>
            {isCustomMode && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <input 
                  type="text" 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder={lang === 'en' ? 'Enter custom status...' : 'Eigenen Status eingeben...'}
                  className="w-full bg-ue-bg border border-ue-border rounded-lg px-4 py-2 text-ue-text focus:border-epic-cyan outline-none transition-colors text-sm"
                />
              </motion.div>
            )}
          </section>

          {/* Image Upload / Preview */}
          <section>
            <label className="block text-xs font-bold uppercase tracking-widest text-ue-text-muted mb-2">
              {lang === 'en' ? 'Preview Image' : 'Vorschaubild'}
            </label>
            
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={cn(
                "relative group h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all overflow-hidden",
                isDragging ? "border-epic-cyan bg-epic-cyan/5" : "border-ue-border bg-ue-bg hover:border-ue-text-muted",
                imageUrl && "border-none"
              )}
            >
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => setImageUrl('')}
                      className="p-3 bg-unreal-orange text-ue-text rounded-full hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                    <label className="p-3 bg-epic-cyan text-ue-bg rounded-full hover:scale-110 transition-transform cursor-pointer">
                      <Upload size={20} />
                      <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-ue-panel flex items-center justify-center text-ue-text-muted group-hover:text-epic-cyan transition-colors">
                    <Upload size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-ue-text">
                      {lang === 'en' ? 'Drag image here' : 'Bild hierhin ziehen'}
                    </p>
                    <p className="text-[10px] text-ue-text-muted mt-1">
                      {lang === 'en' ? 'or click to upload' : 'oder klicken zum Hochladen'}
                    </p>
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={onFileChange} />
                </>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={imageUrl.startsWith('data:') ? (lang === 'en' ? 'Image uploaded' : 'Bild hochgeladen') : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={imageUrl.startsWith('data:')}
                  placeholder={lang === 'en' ? 'Or paste an image URL...' : 'Oder Bild-URL einfügen...'}
                  className="w-full bg-ue-bg border border-ue-border rounded-lg pl-10 pr-4 py-2 text-ue-text focus:border-epic-cyan outline-none transition-colors disabled:opacity-50"
                />
                <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ue-text-muted" />
              </div>
            </div>
          </section>

          {/* Save as Template */}
          <section className="p-4 bg-ue-bg/50 border border-ue-border rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Save size={18} className="text-unreal-orange" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-ue-text">
                {lang === 'en' ? 'Save as Template' : 'Als Vorlage speichern'}
              </h3>
            </div>
            <p className="text-xs text-ue-text-muted mb-4">
              {lang === 'en' ? 'Choose an icon and save the current project setup as a template.' : 'Wähle ein Symbol und speichere die aktuelle Struktur als Vorlage.'}
            </p>
            
            <div className="grid grid-cols-8 gap-2 mb-4">
              {icons.map(item => (
                <button
                  key={item.name}
                  onClick={() => setSelectedIcon(item.name)}
                  className={cn(
                    "p-2 rounded-lg border transition-all flex items-center justify-center cursor-pointer",
                    selectedIcon === item.name 
                      ? "bg-unreal-orange/20 border-unreal-orange text-unreal-orange" 
                      : "bg-ue-bg border-ue-border text-ue-text-muted hover:border-ue-text-muted"
                  )}
                >
                  <item.icon size={16} />
                </button>
              ))}
            </div>

            <button 
              onClick={handleSaveTemplate}
              disabled={isSavingTemplate}
              className="w-full py-2 bg-ue-panel border border-ue-border hover:border-unreal-orange text-ue-text rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Save size={14} />
              <span className="text-xs font-bold">
                {isSavingTemplate ? (lang === 'en' ? 'Saving...' : 'Speichert...') : (lang === 'en' ? 'Create Template' : 'Vorlage erstellen')}
              </span>
            </button>
          </section>
        </div>

        <div className="p-4 border-t border-ue-border bg-ue-bg/30 flex justify-between items-center shrink-0">
          <div>
            {onArchive && (
              <button 
                onClick={() => { onArchive(); onClose(); }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-ue-text-muted hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all cursor-pointer"
              >
                <Archive size={16} />
                {lang === "en" ? (project.archived ? "Unarchive" : "Archive") : (project.archived ? "Wiederherstellen" : "Archivieren")}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-ue-text-muted hover:text-ue-text cursor-pointer">
              {lang === "en" ? "Cancel" : "Abbrechen"}
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-epic-cyan text-ue-bg font-bold rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              {lang === "en" ? "Save" : "Speichern"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
