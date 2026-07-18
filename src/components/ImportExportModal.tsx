import React, { useState } from 'react';
import { X, Copy, Check, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { translations } from '../lib/translations';
import toast from 'react-hot-toast';

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
      toast.success(t.copiedToClipboard || 'Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleImport = () => {
    try {
      if (!importData.trim()) {
        setError(t.pasteProjectDataFirst);
        return;
      }
      JSON.parse(importData); // Validate JSON
      if (onImport) onImport(importData);
    } catch (e) {
      setError(t.invalidJsonData);
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
            {mode === 'export' ? (t.exportProjectData) : (t.importProjectData)}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-ue-text-muted hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-ue-text-muted mb-4">
            {mode === 'export' 
              ? (t.copyExportText)
              : (t.pasteImportText)}
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
              {copied ? (t.copied) : (t.copyToClipboard)}
            </button>
          ) : (
            <button 
              onClick={handleImport}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Save size={18} />
              {t.importProject}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
