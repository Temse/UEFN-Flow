import React from 'react';
import { Column as ColumnType, Task, deduplicateById } from '../types';
import Column from './Column';
import { Plus } from 'lucide-react';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'motion/react';

interface KanbanBoardProps {
  columns: ColumnType[];
  tasks: Task[];
  onTaskClick: (id: string) => void;
  onAddTask: (columnId: string) => void;
  onAddColumn?: () => void;
  onUpdateColumn: (id: string, title: string) => void;
  onDeleteColumn: (id: string) => void;
}

export default function KanbanBoard({ 
  columns, 
  tasks, 
  onTaskClick, 
  onAddTask, 
  onAddColumn,
  onUpdateColumn,
  onDeleteColumn
}: KanbanBoardProps) {
  return (
    <div className="flex gap-6 h-full pb-4 items-start overflow-x-auto custom-scrollbar px-2">
      <SortableContext items={Array.from(new Set(columns.map(c => c.id)))} strategy={horizontalListSortingStrategy}>
        {deduplicateById(columns).map((column, index) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: index * 0.1 
            }}
            className="h-full shrink-0"
          >
            <Column 
              column={column} 
              tasks={tasks.filter(t => t.columnId === column.id)}
              onTaskClick={onTaskClick}
              onAddTask={onAddTask}
              onUpdate={onUpdateColumn}
              onDelete={onDeleteColumn}
            />
          </motion.div>
        ))}
      </SortableContext>
      
      {onAddColumn && (
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: columns.length * 0.1 }}
          whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 229, 255, 0.1)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddColumn}
          className="w-80 h-16 flex items-center justify-center gap-3 bg-ue-panel/30 border-2 border-dashed border-ue-border rounded-xl text-ue-text-muted hover:text-epic-cyan hover:border-epic-cyan transition-all shrink-0 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-xs font-bold uppercase tracking-widest">Spalte hinzufügen</span>
        </motion.button>
      )}
    </div>
  );
}
