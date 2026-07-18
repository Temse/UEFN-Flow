import React, { useState } from 'react';
import { X, Copy, Check, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { translations } from '../lib/translations';

interface ImportExportModalProps {
  mode: 'import' | 'export';
  exportData?: string;
  onImport?: (data: string) => void;
  onClose: () => void;
  lang: any;
}

export default function ImportExportModal({ mode, exportData, onImport, onClose, lang }: ImportExportModalProps) {
  const [importData, setImportData] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const t = translations[lang];

  const handleCopy = async () => {
    if (exportData) {
      await navigator.clipboard.writeText(exportData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleImport = () => {
    try {
      if (!importData.trim()) {
        setError(lang === 'en' ? 'Please paste project data first.' : 'Bitte füge zuerst die Projektdaten ein.');
        return;
      }
      JSON.parse(importData); // Validate JSON
      if (onImport) onImport(importData);
    } catch (e) {
      setError(lang === 'en' ? 'Invalid JSON data. Please check the format.' : 'Ungültige JSON-Daten. Bitte Format überprüfen.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-ue-panel border border-ue-border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold">
            {mode === 'export' ? (lang === 'en' ? 'Export Project Data' : 'Projektdaten exportieren') : (lang === 'en' ? 'Import Project Data' : 'Projektdaten importieren')}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-ue-text-muted hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-ue-text-muted mb-4">
            {mode === 'export' 
              ? (lang === 'en' ? 'Copy this text and save it somewhere safe. You can use it later to import the project.' : 'Kopiere diesen Text und speichere ihn sicher. Du kannst ihn später verwenden, um das Projekt zu importieren.')
              : (lang === 'en' ? 'Paste the project data text here to import it.' : 'Füge den Projektdaten-Text hier ein, um es zu importieren.')}
          </p>

          {mode === 'export' ? (
            <textarea
              readOnly
              value={exportData}
              className="w-full h-64 bg-black/50 border border-ue-border rounded-lg p-4 font-mono text-sm text-ue-text resize-none focus:outline-none focus:border-epic-cyan custom-scrollbar"
            />
          ) : (
            <textarea
              value={importData}
              onChange={(e) => {
                setImportData(e.target.value);
                setError('');
              }}
              placeholder="{...}"
              className="w-full h-64 bg-black/50 border border-ue-border rounded-lg p-4 font-mono text-sm text-ue-text resize-none focus:outline-none focus:border-epic-cyan custom-scrollbar"
            />
          )}

          {error && <p className="text-unreal-orange text-sm mt-2 font-medium">{error}</p>}
        </div>

        <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium hover:bg-white/5 transition-colors"
          >
            {t.cancelBtn}
          </button>
          
          {mode === 'export' ? (
            <button 
              onClick={handleCopy}
              className="bg-epic-cyan hover:bg-[#00c9e0] text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? (lang === 'en' ? 'Copied!' : 'Kopiert!') : (lang === 'en' ? 'Copy to Clipboard' : 'In Zwischenablage kopieren')}
            </button>
          ) : (
            <button 
              onClick={handleImport}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Save size={18} />
              {lang === 'en' ? 'Import Project' : 'Projekt importieren'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
