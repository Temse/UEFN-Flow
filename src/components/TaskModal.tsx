import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle2, Info, MessageSquare, ListTodo, Lightbulb, Plus, Trash2, AlertTriangle, Calendar } from 'lucide-react';
import { Task, SubTask } from '../types';
import { cn } from '../lib/utils';
import { nanoid } from 'nanoid';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskModal({ task, onClose, onUpdate, onDelete }: TaskModalProps) {
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  const toggleSubTask = (subTaskId: string) => {
    const newSubTasks = (task.subTasks || []).map(st => 
      st.id === subTaskId ? { ...st, completed: !st.completed } : st
    );
    onUpdate({ ...task, subTasks: newSubTasks });
  };

  const addSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTaskTitle.trim()) return;
    
    const newSubTask: SubTask = {
      id: nanoid(),
      title: newSubTaskTitle.trim(),
      completed: false
    };
    
    onUpdate({
      ...task,
      subTasks: [...(task.subTasks || []), newSubTask]
    });
    setNewSubTaskTitle('');
  };

  const removeSubTask = (subTaskId: string) => {
    onUpdate({
      ...task,
      subTasks: (task.subTasks || []).filter(st => st.id !== subTaskId)
    });
  };

  const updateNotes = (notes: string) => {
    onUpdate({ ...task, notes });
  };

  const updateTitle = (title: string) => {
    onUpdate({ ...task, title });
  };

  const updateDescription = (description: string) => {
    onUpdate({ ...task, description });
  };

  const toggleCritical = () => {
    onUpdate({ ...task, isCritical: !task.isCritical });
  };

  const updateDueDate = (dueDate: string) => {
    onUpdate({ ...task, dueDate });
  };

  const subTasks = task.subTasks || [];
  const tips = task.tips || [];
  const completedCount = subTasks.filter(st => st.completed).length;
  const progress = subTasks.length > 0 ? Math.round((completedCount / subTasks.length) * 100) : 0;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.subTasks?.every(st => st.completed);

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
        className="relative w-full max-w-3xl bg-ue-panel border border-ue-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-ue-border flex items-start justify-between bg-ue-bg/50">
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ue-text-muted">Task Details</span>
              <button 
                onClick={toggleCritical}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border transition-colors",
                  task.isCritical 
                    ? "text-unreal-orange bg-unreal-orange/10 border-unreal-orange/20" 
                    : "text-ue-text-muted bg-ue-bg border-ue-border hover:border-unreal-orange/50"
                )}
              >
                {task.isCritical ? 'Critical' : 'Mark Critical'}
              </button>
              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                  isOverdue ? "text-red-400 bg-red-400/10 border-red-400/20" : "text-epic-cyan bg-epic-cyan/10 border-epic-cyan/20"
                )}>
                  <Calendar size={12} />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
            <input 
              type="text"
              value={task.title}
              onChange={(e) => updateTitle(e.target.value)}
              className="text-2xl font-bold text-white bg-transparent border-none outline-none focus:ring-1 focus:ring-epic-cyan/30 rounded w-full"
              placeholder="Task Titel"
            />
            <textarea 
              value={task.description}
              onChange={(e) => updateDescription(e.target.value)}
              className="text-ue-text-muted text-sm mt-1 bg-transparent border-none outline-none focus:ring-1 focus:ring-epic-cyan/30 rounded w-full resize-none"
              placeholder="Beschreibung hinzufügen..."
              rows={2}
            />
          </div>
          <div className="flex items-center gap-2">
            {onDelete && (
              <button 
                onClick={() => {
                  if (confirm('Diesen Task wirklich löschen?')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
                className="p-2 hover:bg-unreal-orange/20 rounded-full transition-colors text-ue-text-muted hover:text-unreal-orange"
                title="Task löschen"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-ue-panel-hover rounded-full transition-colors text-ue-text-muted hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Checklist */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ListTodo size={18} className="text-epic-cyan" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Checkliste</h3>
                </div>
                <span className="text-xs font-bold text-epic-cyan">{progress}%</span>
              </div>
              
              <div className="space-y-2 mb-4">
                {subTasks.map((st, index) => (
                  <div key={`${st.id}-${index}`} className="group flex items-center gap-2">
                    <button
                      onClick={() => toggleSubTask(st.id)}
                      className={cn(
                        "flex-1 flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                        st.completed 
                          ? "bg-epic-cyan/5 border-epic-cyan/20 text-ue-text" 
                          : "bg-ue-bg border-ue-border hover:border-ue-text-muted text-ue-text-muted"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        st.completed ? "bg-epic-cyan border-epic-cyan" : "border-ue-border"
                      )}>
                        {st.completed && <CheckCircle2 size={14} className="text-ue-bg" />}
                      </div>
                      <span className={cn("text-sm font-medium", st.completed && "line-through opacity-50")}>
                        {st.title}
                      </span>
                    </button>
                    <button 
                      onClick={() => removeSubTask(st.id)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:text-unreal-orange transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={addSubTask} className="flex gap-2">
                <input 
                  type="text"
                  value={newSubTaskTitle}
                  onChange={(e) => setNewSubTaskTitle(e.target.value)}
                  placeholder="Neuer Punkt..."
                  className="flex-1 bg-ue-bg border border-ue-border rounded-lg px-4 py-2 text-sm text-white focus:border-epic-cyan outline-none transition-colors"
                />
                <button 
                  type="submit"
                  className="p-2 bg-ue-bg border border-ue-border hover:border-epic-cyan text-epic-cyan rounded-lg transition-all"
                >
                  <Plus size={20} />
                </button>
              </form>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-ue-text-muted" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Notizen & Bugs</h3>
              </div>
              <textarea
                value={task.notes || ''}
                onChange={(e) => updateNotes(e.target.value)}
                placeholder="Schreibe hier deine Gedanken oder Bugs auf..."
                className="w-full h-32 bg-ue-bg border border-ue-border rounded-lg p-4 text-sm text-ue-text placeholder:text-ue-text-muted focus:outline-none focus:border-epic-cyan transition-colors resize-none"
              />
            </section>
          </div>

          {/* Right Column: Tips & Settings */}
          <div className="space-y-6">
            <section className="bg-ue-bg/50 border border-ue-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-epic-cyan" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Deadline</h3>
              </div>
              <input 
                type="date"
                value={task.dueDate || ''}
                onChange={(e) => updateDueDate(e.target.value)}
                className="w-full bg-ue-bg border border-ue-border rounded-lg px-3 py-2 text-xs text-white focus:border-epic-cyan outline-none transition-colors"
              />
              {task.dueDate && (
                <button 
                  onClick={() => updateDueDate('')}
                  className="text-[10px] text-red-400 hover:text-red-300 mt-2 underline"
                >
                  Deadline entfernen
                </button>
              )}
            </section>

            {tips.length > 0 && (
              <section className="bg-ue-bg/50 border border-ue-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={18} className="text-unreal-orange" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">UEFN Quick-Tips</h3>
                </div>
                <ul className="space-y-4">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-unreal-orange mt-1.5 shrink-0" />
                      <p className="text-xs leading-relaxed text-ue-text-muted">{tip}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-ue-border bg-ue-bg/30 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-epic-cyan text-ue-bg font-bold rounded-lg hover:bg-white transition-colors"
          >
            Fertig
          </button>
        </div>
      </motion.div>
    </div>
  );
}
