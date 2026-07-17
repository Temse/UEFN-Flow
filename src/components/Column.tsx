import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column as ColumnType, Task, deduplicateById } from '../types';
import TaskCard from './TaskCard';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import { Plus, MoreVertical, Trash2, Edit2, Calendar } from 'lucide-react';

interface ColumnProps {
  key?: string;
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (id: string) => void;
  onAddTask: (columnId: string) => void;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export default function Column({ column, tasks, onTaskClick, onAddTask, onUpdate, onDelete }: ColumnProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const completedTasks = tasks.filter(t => (t.subTasks || []).every(st => st.completed)).length;
  const hasDeadline = tasks.some(t => t.dueDate);

  if (isDragging) {
    return (
      <div 
        ref={setSortableRef}
        style={style}
        className="w-80 flex flex-col bg-ue-panel/20 rounded-xl border border-epic-cyan/30 opacity-50 h-[500px]"
      />
    );
  }

  return (
    <div 
      ref={setSortableRef}
      style={style}
      className={cn(
        "w-80 flex flex-col bg-ue-panel/40 rounded-xl border border-ue-border transition-all duration-300 group/column h-full max-h-[calc(100vh-280px)]",
        isOver && "bg-ue-panel/60 border-epic-cyan/30 shadow-[0_0_20px_rgba(0,229,255,0.05)]"
      )}
    >
      <div 
        {...attributes}
        {...listeners}
        className="p-4 flex items-center justify-between border-b border-ue-border/50 cursor-grab active:cursor-grabbing bg-ue-bg/20 rounded-t-xl"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <h3 className="font-bold text-sm text-ue-text uppercase tracking-wide truncate">{column.title}</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-ue-bg border border-ue-border rounded-full text-ue-text-muted shrink-0">
            {completedTasks}/{tasks.length}
          </span>
          {hasDeadline && (
            <motion.div 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                color: ["#F27D26", "#FF4444", "#F27D26"]
              }}
              transition={{ 
                scale: { type: "spring", stiffness: 300, damping: 10 },
                color: { duration: 2, repeat: Infinity }
              }}
              className="text-unreal-orange"
              title="Fristen in dieser Spalte"
            >
              <Calendar size={14} />
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <motion.button 
            whileHover={{ scale: 1.1, color: "#00E5FF" }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddTask(column.id);
            }}
            className="p-1 hover:bg-ue-bg rounded text-ue-text-muted transition-colors"
            title="Aufgabe hinzufügen"
          >
            <Plus size={16} />
          </motion.button>
          <div className="relative">
            <motion.button 
              whileHover={{ scale: 1.1, color: "#FFFFFF" }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-ue-bg rounded text-ue-text-muted transition-colors"
            >
              <MoreVertical size={16} />
            </motion.button>
            
            <AnimatePresence>
              {showMenu && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMenu(false)} 
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, y: -10, filter: "blur(10px)" }}
                    className="absolute right-0 mt-2 w-48 bg-ue-panel/95 backdrop-blur-md border border-ue-border rounded-lg shadow-xl z-20 py-1 overflow-hidden"
                  >
                    <button 
                      onClick={() => {
                        onUpdate(column.id, column.title);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-ue-text hover:bg-ue-bg flex items-center gap-2 transition-colors"
                    >
                      <Edit2 size={14} /> Umbenennen
                    </button>
                    <button 
                      onClick={() => {
                        onDelete(column.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-red-400/10 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 size={14} /> Löschen
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar min-h-[100px]"
      >
        <SortableContext items={Array.from(new Set(tasks.map(t => t.id)))} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {deduplicateById(tasks).map((task, index) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: index * 0.03 
                }}
              >
                <TaskCard task={task} onClick={() => onTaskClick(task.id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>
        
        {tasks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-24 border-2 border-dashed border-ue-border/30 rounded-lg flex items-center justify-center bg-ue-bg/5"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-ue-text-muted italic">Keine Karten</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
