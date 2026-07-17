import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Search, Check, X } from 'lucide-react';
import { Language } from '../lib/translations';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onSelect: (lang: Language) => void;
  defaultLang: Language;
  onClose?: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export default function LanguageSelectorModal({ isOpen, onSelect, defaultLang, onClose }: LanguageSelectorModalProps) {
  const [search, setSearch] = useState('');
  
  if (!isOpen) return null;

  const filtered = LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-ue-panel border border-ue-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
      >
                <div className="p-6 border-b border-ue-border bg-ue-bg/30 relative">
          {onClose && (
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-ue-text-muted hover:text-ue-text hover:bg-ue-panel-hover rounded-full transition-colors cursor-pointer">
              <X size={20} />
            </button>
          )}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-epic-cyan/10 text-epic-cyan rounded-full flex items-center justify-center">
              <Globe size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-ue-text text-center mb-2">Select Language</h2>
          <p className="text-ue-text-muted text-center text-sm">Choose your preferred interface language.</p>
        </div>

        <div className="p-4 border-b border-ue-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ue-text-muted" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language..."
              className="w-full bg-ue-bg border border-ue-border focus:border-epic-cyan rounded-lg pl-9 pr-4 py-2.5 text-sm text-ue-text outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
          {filtered.map(lang => (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.code as Language)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                defaultLang === lang.code
                  ? 'bg-epic-cyan/10 border-epic-cyan text-ue-text'
                  : 'bg-ue-bg border-ue-border hover:border-epic-cyan/50 text-ue-text-muted hover:text-ue-text'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <span className={`font-bold ${defaultLang === lang.code ? 'text-epic-cyan' : ''}`}>
                  {lang.name}
                </span>
              </div>
              {defaultLang === lang.code && <Check size={18} className="text-epic-cyan" />}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-ue-text-muted py-8 text-sm">No languages found.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
