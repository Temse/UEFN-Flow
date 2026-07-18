import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layout, Zap, DollarSign, ArrowRight, Sparkles, X, Shield, Sword, Ghost, Car, Target, Users, Flag, Gamepad2, EyeOff, Mountain, ArrowUp, Palette, FileText, LucideIcon } from 'lucide-react';
import { ProjectTemplate } from '../types';
import { cn } from '../lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  Layout, Zap, DollarSign, Shield, Sword, Ghost, Car, Target, Users, Flag, Gamepad2, EyeOff, Mountain, ArrowUp, Palette, FileText
};

interface OnboardingModalProps { key?: string | number;
  onComplete: (name: string, template: ProjectTemplate, islandCode?: string, customTemplateId?: string) => void;
  onCancel?: () => void;
}

export default function OnboardingModal({ onComplete, onCancel }: OnboardingModalProps) {
  const [name, setName] = useState(() => {
    return localStorage.getItem('uefn-draft-name') || '';
  });
  const [islandCode, setIslandCode] = useState(() => {
    return localStorage.getItem('uefn-draft-island-code') || '';
  });
  const [template, setTemplate] = useState<ProjectTemplate>(() => {
    return (localStorage.getItem('uefn-draft-template') as ProjectTemplate) || 'blank';
  });
  const [selectedCustomId, setSelectedCustomId] = useState<string | null>(() => {
    return localStorage.getItem('uefn-draft-custom-id') || null;
  });
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Save changes to localStorage for draft persistence
  useEffect(() => {
    localStorage.setItem('uefn-draft-name', name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem('uefn-draft-island-code', islandCode);
  }, [islandCode]);

  useEffect(() => {
    localStorage.setItem('uefn-draft-template', template);
  }, [template]);

  useEffect(() => {
    if (selectedCustomId) {
      localStorage.setItem('uefn-draft-custom-id', selectedCustomId);
    } else {
      localStorage.removeItem('uefn-draft-custom-id');
    }
  }, [selectedCustomId]);

  const fetchTemplates = () => {
    try {
      const cached = localStorage.getItem("uefn-custom-templates");
      if (cached) setCustomTemplates(JSON.parse(cached));
    } catch(e) {}
  };

  const deleteCustomTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const cachedStr = localStorage.getItem("uefn-custom-templates");
      if (cachedStr) {
         let cached = JSON.parse(cachedStr);
         cached = cached.filter((t: any) => t.id !== id);
         localStorage.setItem("uefn-custom-templates", JSON.stringify(cached));
      }
      fetchTemplates();
      if (selectedCustomId === id) setSelectedCustomId(null);
    } catch (err) {
      console.error(err);
    }
  };
  const templates = [
    { id: 'blank' as ProjectTemplate, title: 'Blank Slate', description: 'Standard Workflow.', icon: Layout, color: 'text-ue-text-muted' },
    { id: 'zone-wars' as ProjectTemplate, title: 'Zone Wars', description: 'Storm & Loadouts.', icon: Zap, color: 'text-epic-cyan' },
    { id: 'tycoon' as ProjectTemplate, title: 'Tycoon', description: 'Economy & Saving.', icon: DollarSign, color: 'text-unreal-orange' },
    { id: 'bed-wars' as ProjectTemplate, title: 'Bed Wars', description: 'Objectives & Respawns.', icon: Shield, color: 'text-red-400' },
    { id: 'box-fight' as ProjectTemplate, title: 'Box Fight', description: 'Barriers & Reset.', icon: Sword, color: 'text-blue-400' },
    { id: 'horror' as ProjectTemplate, title: 'Horror', description: 'Atmosphere & Scares.', icon: Ghost, color: 'text-purple-400' },
    { id: 'racing' as ProjectTemplate, title: 'Racing', description: 'Checkpoints & Vehicles.', icon: Car, color: 'text-yellow-400' },
    { id: 'prop-hunt' as ProjectTemplate, title: 'Prop Hunt', description: 'Prop-O-Matic Setup.', icon: Target, color: 'text-pink-400' },
    { id: 'red-vs-blue' as ProjectTemplate, title: 'Red vs Blue', description: 'Team Bases & Combat.', icon: Users, color: 'text-orange-400' },
    { id: 'capture-the-flag' as ProjectTemplate, title: 'CTF', description: 'Flag Logic & Scores.', icon: Flag, color: 'text-green-400' },
    { id: 'gun-game' as ProjectTemplate, title: 'Gun Game', description: 'Weapon Progression.', icon: Gamepad2, color: 'text-indigo-400' },
    { id: 'hide-and-seek' as ProjectTemplate, title: 'Hide & Seek', description: 'Hiding Logic.', icon: EyeOff, color: 'text-gray-400' },
    { id: 'parkour' as ProjectTemplate, title: 'Parkour', description: 'Movement & Death.', icon: Mountain, color: 'text-emerald-400' },
    { id: 'only-up' as ProjectTemplate, title: 'Only Up', description: 'Height & Fall Logic.', icon: ArrowUp, color: 'text-cyan-400' },
    { id: 'rpg' as ProjectTemplate, title: 'RPG', description: 'Quests & Leveling.', icon: Palette, color: 'text-violet-400' },
  ];

  const handleComplete = () => {
    if (!name.trim()) return;
    onComplete(name.trim(), template, islandCode.trim(), selectedCustomId || undefined);
    
    // Clear persisted drafts on successful submission
    localStorage.removeItem('uefn-draft-name');
    localStorage.removeItem('uefn-draft-island-code');
    localStorage.removeItem('uefn-draft-template');
    localStorage.removeItem('uefn-draft-custom-id');
  };

  // Stagger configurations for Framer Motion
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02
      }
    }
  };

  const gridItemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.96 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 24 
      } 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ue-bg/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-ue-panel border border-ue-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-ue-border flex items-center justify-between bg-ue-bg/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-unreal-orange rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,103,33,0.3)] animate-pulse">
              <Sparkles size={24} className="text-ue-text" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-ue-text tracking-tight">Neues Projekt erstellen</h1>
              <p className="text-ue-text-muted text-sm">Wähle eine Vorlage und starte deinen Workflow.</p>
            </div>
          </div>
          {onCancel && (
            <button onClick={onCancel} className="p-2 hover:bg-ue-panel-hover rounded-full text-ue-text-muted transition-colors cursor-pointer">
              <X size={24} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-ue-text-muted">Projektname</label>
                {name.trim() ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Gültig</span>
                ) : (
                  <span className="text-[10px] font-bold text-unreal-orange bg-unreal-orange/10 px-2 py-0.5 rounded border border-unreal-orange/20">Erforderlich</span>
                )}
              </div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Neon City Zone Wars"
                className={cn(
                  "w-full bg-ue-bg border rounded-xl px-4 py-3 text-lg focus:outline-none transition-all duration-300",
                  name.trim() 
                    ? "border-ue-border focus:border-epic-cyan focus:shadow-[0_0_15px_rgba(0,229,255,0.15)]" 
                    : "border-unreal-orange/40 focus:border-unreal-orange focus:shadow-[0_0_15px_rgba(255,103,33,0.15)]"
                )}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-ue-text-muted">Island Code (Optional)</label>
                {islandCode.trim() && (
                  <span className="text-[10px] font-bold text-epic-cyan bg-epic-cyan/10 px-2 py-0.5 rounded border border-epic-cyan/20">Eingegeben</span>
                )}
              </div>
              <input 
                type="text" 
                value={islandCode}
                onChange={(e) => setIslandCode(e.target.value)}
                placeholder="0000-0000-0000"
                className="w-full bg-ue-bg border border-ue-border rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-epic-cyan focus:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300"
              />
            </div>
          </div>

          {customTemplates.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-ue-text-muted mb-4">Deine Vorlagen</label>
              <motion.div 
                variants={gridContainerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
              >
                {customTemplates.map((t, index) => (
                  <motion.div
                    key={`custom-${t.id || index}-${index}`}
                    variants={gridItemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTemplate('blank');
                      setSelectedCustomId(t.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setTemplate('blank');
                        setSelectedCustomId(t.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "flex flex-col items-center text-center p-4 rounded-xl border transition-all group relative cursor-pointer outline-none min-h-[110px] justify-center overflow-hidden"
                    )}
                  >
                    {selectedCustomId === t.id && (
                      <motion.div 
                        layoutId="activeTemplateGlow"
                        className="absolute inset-0 rounded-xl border border-unreal-orange bg-unreal-orange/5 shadow-[0_0_20px_rgba(255,103,33,0.15)] z-0 pointer-events-none"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <button 
                      type="button"
                      onClick={(e) => deleteCustomTemplate(t.id, e)}
                      className="absolute top-2 right-2 p-1 bg-black/40 hover:bg-red-500 text-ue-text rounded opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                    <div className="z-10 flex flex-col items-center">
                      {(() => {
                        const Icon = ICON_MAP[t.icon] || FileText;
                        return <Icon size={24} className="mb-2 text-unreal-orange transition-transform group-hover:scale-110" />;
                      })()}
                      <h3 className="font-bold text-[10px] uppercase tracking-wider mb-1 truncate w-full max-w-[120px]">{t.name}</h3>
                      <p className="text-[9px] text-ue-text-muted leading-tight line-clamp-2">Eigene Vorlage</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-ue-text-muted mb-4 font-black">Standard Vorlagen ({templates.length})</label>
            <motion.div 
              variants={gridContainerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
            >
              {templates.map((t, index) => (
                <motion.button
                  key={`standard-${t.id}-${index}`}
                  variants={gridItemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTemplate(t.id);
                    setSelectedCustomId(null);
                  }}
                  className={cn(
                    "flex flex-col items-center text-center p-4 rounded-xl border transition-all group relative min-h-[110px] justify-center outline-none cursor-pointer overflow-hidden"
                  )}
                >
                  {template === t.id && !selectedCustomId && (
                    <motion.div 
                      layoutId="activeTemplateGlow"
                      className="absolute inset-0 rounded-xl border border-epic-cyan bg-epic-cyan/5 shadow-[0_0_20px_rgba(0,229,255,0.15)] z-0 pointer-events-none"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div className="z-10 flex flex-col items-center">
                    <t.icon size={24} className={cn("mb-2 transition-transform group-hover:scale-110", t.color)} />
                    <h3 className="font-bold text-[10px] uppercase tracking-wider mb-1 truncate w-full max-w-[120px]">{t.title}</h3>
                    <p className="text-[9px] text-ue-text-muted leading-tight line-clamp-2">{t.description}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="p-6 border-t border-ue-border bg-ue-bg/30">
          <button
            disabled={!name.trim()}
            onClick={handleComplete}
            className="w-full py-4 bg-epic-cyan hover:bg-white disabled:opacity-30 disabled:hover:bg-epic-cyan text-ue-bg font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(0,229,255,0.2)] cursor-pointer"
          >
            Projekt erstellen
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
