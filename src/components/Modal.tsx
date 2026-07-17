import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps { key?: string | number;
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
}

export function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Bestätigen', 
  cancelText = 'Abbrechen',
  type = 'info'
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ue-bg/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-ue-panel border border-ue-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type === 'danger' ? 'bg-red-500/20 text-red-500' : 'bg-epic-cyan/20 text-epic-cyan'}`}>
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-bold text-ue-text">{title}</h3>
              </div>
              <p className="text-ue-text-muted mb-8">{message}</p>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 bg-ue-bg border border-ue-border rounded-lg text-ue-text font-bold hover:bg-ue-panel-hover transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-4 py-2 rounded-lg text-ue-bg font-bold transition-colors ${type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-epic-cyan hover:bg-white'}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface InputModalProps { key?: string | number;
  isOpen: boolean;
  title: string;
  placeholder: string;
  initialValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  confirmText?: string;
}

export function InputModal({
  isOpen,
  title,
  placeholder,
  defaultValue = '',
  onConfirm,
  onCancel,
  confirmText = 'Speichern'
}: InputModalProps & { defaultValue?: string }) {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    if (isOpen) setValue(defaultValue);
  }, [isOpen, defaultValue]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ue-bg/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-ue-panel border border-ue-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-ue-text">{title}</h3>
                <button onClick={onCancel} className="text-ue-text-muted hover:text-ue-text transition-colors">
                  <X size={20} />
                </button>
              </div>
              <input
                autoFocus
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-ue-bg border border-ue-border rounded-xl px-4 py-3 text-ue-text mb-8 focus:outline-none focus:border-epic-cyan transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && value.trim()) onConfirm(value);
                  if (e.key === 'Escape') onCancel();
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 bg-ue-bg border border-ue-border rounded-lg text-ue-text font-bold hover:bg-ue-panel-hover transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => value.trim() && onConfirm(value)}
                  disabled={!value.trim()}
                  className="flex-1 px-4 py-2 bg-epic-cyan text-ue-bg font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
