import React from 'react';
import { X, MousePointer2, Zap, Settings, Palette, Maximize, PaintBucket, Monitor, Sparkles, Layout, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from '../lib/translations';
import { useSettings, MouseColor, MouseSize, THEME_COLORS, ThemeMode, FontSize } from '../lib/SettingsContext';

export default function GlobalSettingsModal({ onClose, lang }: { onClose: () => void, lang: any }) {
  const { 
    mouseEffect, setMouseEffect, 
    performanceMode, setPerformanceMode,
    mouseColor, setMouseColor,
    mouseSize, setMouseSize,
    appPrimaryColor, setAppPrimaryColor,
    appSecondaryColor, setAppSecondaryColor,
    themeMode, setThemeMode,
    animations, setAnimations,
    glassmorphism, setGlassmorphism,
    fontSize, setFontSize
  } = useSettings();
  
  const t = translations[lang];

  const mouseColors: { value: MouseColor, label: string, bgClass: string }[] = [
    { value: 'dual', label: 'Cyan & Orange', bgClass: 'bg-gradient-to-br from-[#00E5FF] to-[#FF5E00]' },
    { value: 'cyan', label: 'Cyan', bgClass: 'bg-[#00E5FF]' },
    { value: 'orange', label: 'Orange', bgClass: 'bg-[#FF5E00]' },
    { value: 'purple', label: 'Purple', bgClass: 'bg-[#A855F7]' },
    { value: 'green', label: 'Green', bgClass: 'bg-[#10B981]' },
    { value: 'white', label: 'White', bgClass: 'bg-[#FAFAFA]' },
  ];

  const appColors = [
    { value: 'cyan', label: 'Cyan', hex: THEME_COLORS.cyan },
    { value: 'orange', label: 'Orange', hex: THEME_COLORS.orange },
    { value: 'purple', label: 'Purple', hex: THEME_COLORS.purple },
    { value: 'green', label: 'Green', hex: THEME_COLORS.green },
    { value: 'blue', label: 'Blue', hex: THEME_COLORS.blue },
    { value: 'pink', label: 'Pink', hex: THEME_COLORS.pink },
    { value: 'red', label: 'Red', hex: THEME_COLORS.red },
    { value: 'white', label: 'White', hex: THEME_COLORS.white },
  ];

  const sizes: { value: MouseSize, label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  const fontSizes: { value: FontSize, label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Large' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-ue-panel border border-ue-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-ue-panel to-ue-bg shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-epic-cyan/10 border border-epic-cyan/20 flex items-center justify-center text-epic-cyan">
              <Settings size={16} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Preferences</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-ue-text-muted hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
          
          {/* Theme & Display */}
          <div className="space-y-4">
            <h3 className="font-medium text-ue-text flex items-center gap-2 text-lg">
              <Monitor size={16} className="text-epic-cyan" />
              Display & UI
            </h3>
            
            <div className="space-y-6 pl-4 border-l-2 border-white/5">
              
              <div className="flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <h4 className="text-sm font-medium text-ue-text">Theme Mode</h4>
                  <p className="text-xs text-ue-text-muted">Choose between light and dark backgrounds.</p>
                </div>
                <div className="flex bg-ue-panel-hover/50 p-1 rounded-lg border border-ue-border">
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      themeMode === 'dark' ? 'bg-epic-cyan text-black shadow-sm' : 'text-ue-text-muted hover:text-white hover:bg-white/5'
                    }`}
                  >Dark</button>
                  <button
                    onClick={() => setThemeMode('light')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      themeMode === 'light' ? 'bg-epic-cyan text-black shadow-sm' : 'text-ue-text-muted hover:text-white hover:bg-white/5'
                    }`}
                  >Light</button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <h4 className="text-sm font-medium text-ue-text">Font Size</h4>
                  <p className="text-xs text-ue-text-muted">Adjust the global text size.</p>
                </div>
                <div className="flex bg-ue-panel-hover/50 p-1 rounded-lg border border-ue-border">
                  {fontSizes.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setFontSize(s.value)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        fontSize === s.value ? 'bg-epic-cyan text-black shadow-sm' : 'text-ue-text-muted hover:text-white hover:bg-white/5'
                      }`}
                    >{s.label}</button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          {/* App Colors */}
          <div className="space-y-4">
            <h3 className="font-medium text-ue-text flex items-center gap-2 text-lg">
              <PaintBucket size={16} className="text-epic-cyan" />
              Brand Colors
            </h3>
            
            <div className="space-y-4 pl-4 border-l-2 border-white/5">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-ue-text-muted">Primary Accent</h4>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {appColors.map((color) => (
                    <button
                      key={color.value}
                      title={color.label}
                      onClick={() => setAppPrimaryColor(color.value)}
                      className={`h-8 rounded-lg border flex items-center justify-center transition-all ${
                        appPrimaryColor === color.value 
                          ? 'border-white scale-110 shadow-lg z-10' 
                          : 'border-white/10 hover:border-white/50 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-ue-text-muted">Secondary Accent</h4>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {appColors.map((color) => (
                    <button
                      key={color.value}
                      title={color.label}
                      onClick={() => setAppSecondaryColor(color.value)}
                      className={`h-8 rounded-lg border flex items-center justify-center transition-all ${
                        appSecondaryColor === color.value 
                          ? 'border-white scale-110 shadow-lg z-10' 
                          : 'border-white/10 hover:border-white/50 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          {/* Effects & Animation */}
          <div className="space-y-4">
            <h3 className="font-medium text-ue-text flex items-center gap-2 text-lg">
              <Sparkles size={16} className="text-epic-cyan" />
              Effects & Visuals
            </h3>

            <div className="space-y-6 pl-4 border-l-2 border-white/5">
              
              <div className="flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <h4 className="text-sm font-medium text-ue-text">UI Animations</h4>
                  <p className="text-xs text-ue-text-muted">Enable interface transitions and hover animations.</p>
                </div>
                <button
                  onClick={() => setAnimations(!animations)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${animations ? 'bg-epic-cyan' : 'bg-ue-border'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${animations ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <h4 className="text-sm font-medium text-ue-text">Glassmorphism</h4>
                  <p className="text-xs text-ue-text-muted">Enable background blur effects on panels and modals.</p>
                </div>
                <button
                  onClick={() => setGlassmorphism(!glassmorphism)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${glassmorphism ? 'bg-epic-cyan' : 'bg-ue-border'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${glassmorphism ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <h4 className="text-sm font-medium text-ue-text">Mouse Glow Effect</h4>
                  <p className="text-xs text-ue-text-muted">A beautiful background glow that follows your cursor.</p>
                </div>
                <button
                  onClick={() => setMouseEffect(!mouseEffect)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${mouseEffect ? 'bg-epic-cyan' : 'bg-ue-border'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mouseEffect ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              
              <AnimatePresence>
                {mouseEffect && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <div className="pl-4 border-l-2 border-white/5 space-y-6 py-2">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-ue-text flex items-center gap-2">
                          <Palette size={14} className="text-ue-text-muted" />
                          Glow Color
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {mouseColors.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setMouseColor(color.value)}
                              className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                                mouseColor === color.value 
                                  ? 'border-epic-cyan bg-epic-cyan/10' 
                                  : 'border-ue-border hover:border-white/20 bg-ue-panel-hover/50 hover:bg-ue-panel-hover'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full ${color.bgClass}`} />
                              <span className="text-xs font-medium">{color.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-ue-text flex items-center gap-2">
                          <Maximize size={14} className="text-ue-text-muted" />
                          Glow Size
                        </h4>
                        <div className="flex bg-ue-panel-hover/50 p-1 rounded-lg border border-ue-border">
                          {sizes.map((size) => (
                            <button
                              key={size.value}
                              onClick={() => setMouseSize(size.value)}
                              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                mouseSize === size.value
                                  ? 'bg-epic-cyan text-black shadow-sm'
                                  : 'text-ue-text-muted hover:text-white hover:bg-white/5'
                              }`}
                            >
                              {size.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          <div className="h-px w-full bg-white/5" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1 pr-4">
              <h3 className="font-medium text-ue-text flex items-center gap-2 text-lg">
                <Zap size={16} className="text-unreal-orange" />
                Performance Mode
              </h3>
              <p className="text-xs text-ue-text-muted leading-relaxed">Simplifies visual complexity and reduces heavy blur effects to improve framerate on older devices.</p>
            </div>
            <button
              onClick={() => setPerformanceMode(!performanceMode)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${performanceMode ? 'bg-unreal-orange' : 'bg-ue-border'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${performanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
