import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Check, Trash2, Plus, Sparkles, Clipboard, CheckCircle, Clock } from 'lucide-react';
import { Project } from '../types';

interface TodoReminder {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface ProjectNotesPanelProps {
  project: Project;
  onUpdateNotes: (newNotesStr: string) => void;
  onClose: () => void;
  lang: string;
}

export default function ProjectNotesPanel({ project, onUpdateNotes, onClose, lang }: ProjectNotesPanelProps) {
  // Safe helper to parse complex JSON notes or legacy plain-text
  const parseNotes = (notesStr: string | null | undefined) => {
    if (!notesStr) return { text: '', todos: [] as TodoReminder[] };
    try {
      const trimmed = notesStr.trim();
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        const parsed = JSON.parse(trimmed);
        return {
          text: typeof parsed.text === 'string' ? parsed.text : '',
          todos: Array.isArray(parsed.todos) ? parsed.todos : [] as TodoReminder[]
        };
      }
    } catch (e) {
      console.warn('Failed to parse project notes as JSON, fallback to plain text.', e);
    }
    return { text: notesStr, todos: [] as TodoReminder[] };
  };

  const initialParsed = parseNotes(project.notes);
  const [text, setText] = useState(initialParsed.text);
  const [todos, setTodos] = useState<TodoReminder[]>(initialParsed.todos);
  const [newTodo, setNewTodo] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if external changes happen (via websockets)
  useEffect(() => {
    const parsed = parseNotes(project.notes);
    // Only update if notes have actually drifted
    if (parsed.text !== text) {
      setText(parsed.text);
    }
    // Deep comparison of todos is complex, but check length and JSON string representation
    if (JSON.stringify(parsed.todos) !== JSON.stringify(todos)) {
      setTodos(parsed.todos);
    }
  }, [project.notes]);

  // Debounced note save function
  const triggerSave = (updatedText: string, updatedTodos: TodoReminder[]) => {
    setSaveStatus('saving');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      const serialized = JSON.stringify({ text: updatedText, todos: updatedTodos });
      onUpdateNotes(serialized);
      setSaveStatus('saved');
    }, 800);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    triggerSave(val, todos);
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const newRem: TodoReminder = {
      id: 'rem_' + Math.random().toString(36).substr(2, 9),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newRem, ...todos];
    setTodos(updated);
    setNewTodo('');
    triggerSave(text, updated);
  };

  const handleToggleTodo = (id: string) => {
    const updated = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
    triggerSave(text, updated);
  };

  const handleDeleteTodo = (id: string) => {
    const updated = todos.filter(todo => todo.id !== id);
    setTodos(updated);
    triggerSave(text, updated);
  };

  const t = {
    title: lang === 'en' ? 'Project Notes' : 'Projektnotizen',
    desc: lang === 'en' ? 'Quick snippets and project wiki' : 'Schnelle Snippets und Projekt-Wiki',
    placeholder: lang === 'en' ? 'Write down coordinates, ideas, island settings, or reminders...' : 'Schreibe Koordinaten, Ideen, Island-Einstellungen oder Erinnerungen auf...',
    reminders: lang === 'en' ? 'Quick Reminders' : 'Schnelle Erinnerungen',
    addPlaceholder: lang === 'en' ? 'Add quick reminder...' : 'Schnelle Erinnerung hinzufügen...',
    saved: lang === 'en' ? 'Saved' : 'Gespeichert',
    saving: lang === 'en' ? 'Saving...' : 'Speichert...',
    noReminders: lang === 'en' ? 'No reminders yet.' : 'Noch keine Erinnerungen.',
  };

  return (
    <motion.div
      initial={{ x: 380, opacity: 0.8 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 380, opacity: 0.8 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-96 flex flex-col bg-ue-panel border-l border-ue-border h-full flex-shrink-0 relative z-30 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-ue-border flex items-center justify-between bg-ue-bg/30">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-unreal-orange animate-pulse" />
          <div>
            <h3 className="font-bold text-sm text-white">{t.title}</h3>
            <p className="text-[10px] text-ue-text-muted font-medium">{t.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border transition-colors ${
            saveStatus === 'saved' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-unreal-orange/10 border-unreal-orange/20 text-unreal-orange animate-pulse'
          }`}>
            {saveStatus === 'saved' ? t.saved : t.saving}
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-ue-border text-ue-text-muted hover:text-white rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-6">
        {/* Main Text Note (Wiki) */}
        <div className="flex-1 flex flex-col min-h-[250px]">
          <div className="flex items-center gap-1.5 mb-2 text-ue-text-muted">
            <Clipboard size={14} className="text-unreal-orange" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">Project Wiki</span>
          </div>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder={t.placeholder}
            className="flex-1 w-full bg-ue-bg/60 border border-ue-border hover:border-ue-border-hover focus:border-unreal-orange rounded-xl p-3 text-xs text-white leading-relaxed placeholder-ue-text-muted/60 focus:outline-none resize-none transition-all custom-scrollbar"
          />
        </div>

        {/* Reminders / Todos Checklist */}
        <div className="flex flex-col border-t border-ue-border pt-4">
          <div className="flex items-center gap-1.5 mb-3 text-ue-text-muted">
            <Clock size={14} className="text-epic-cyan" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">{t.reminders}</span>
          </div>

          <form onSubmit={handleAddTodo} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder={t.addPlaceholder}
              maxLength={120}
              className="flex-1 bg-ue-bg/40 border border-ue-border hover:border-ue-border-hover focus:border-epic-cyan rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none placeholder-ue-text-muted/60 transition-all"
            />
            <button
              type="submit"
              className="px-3 bg-epic-cyan hover:bg-white text-ue-bg font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              <Plus size={16} />
            </button>
          </form>

          {/* List of Reminders */}
          <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto custom-scrollbar">
            {todos.length === 0 ? (
              <div className="text-center py-6 text-ue-text-muted/40 text-xs italic font-medium">
                {t.noReminders}
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between p-2 rounded-lg border transition-all text-xs group ${
                    todo.completed
                      ? 'bg-ue-bg/20 border-ue-border/30 text-ue-text-muted line-through opacity-60'
                      : 'bg-ue-bg/40 border-ue-border hover:border-ue-border-hover text-white'
                  }`}
                >
                  <button
                    onClick={() => handleToggleTodo(todo.id)}
                    className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all ${
                      todo.completed
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : 'border-ue-border hover:border-epic-cyan/60 bg-black/20'
                    }`}
                  >
                    {todo.completed && <Check size={10} strokeWidth={3} />}
                  </button>

                  <span className="flex-1 px-3 truncate select-none leading-none">
                    {todo.text}
                  </span>

                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="p-1 text-ue-text-muted hover:text-unreal-orange hover:bg-unreal-orange/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
