import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlertTriangle, CheckCircle2, ListTodo, Calendar } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface TaskCardProps {
  key?: string;
  task: Task;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const completedCount = (task.subTasks || []).filter(st => st.completed).length;
  const isFullyDone = completedCount === (task.subTasks || []).length && (task.subTasks || []).length > 0;

  const getTimeLeft = () => {
    if (!task.dueDate) return null;
    const diff = new Date(task.dueDate).getTime() - new Date().getTime();
    
    if (diff <= 0) return { label: 'Überfällig', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 2) return { label: `${days}T ${hours}Std`, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' };
    if (days >= 0) return { label: `${hours}Std ${minutes}Min`, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' };
    
    return { label: 'Überfällig', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' };
  };

  const timeLeft = getTimeLeft();

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className="h-24 bg-ue-panel/20 border border-ue-border rounded-lg"
      />
    );
  }

  return (
    <motion.div
      layoutId={task.id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      whileHover={{ 
        y: -4, 
        scale: 1.02, 
        boxShadow: "0 10px 30px -10px rgba(0, 229, 255, 0.2)",
        borderColor: "rgba(0, 229, 255, 0.4)"
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group p-4 bg-ue-panel border border-ue-border rounded-lg cursor-pointer transition-all relative overflow-hidden",
        task.isCritical && "border-l-4 border-l-unreal-orange shadow-[0_0_15px_rgba(255,94,0,0.1)]",
        isFullyDone && "opacity-60 grayscale-[0.5]"
      )}
    >
      {task.isCritical && (
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-unreal-orange pointer-events-none"
        />
      )}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium leading-tight group-hover:text-white transition-colors">
          {task.title}
        </h4>
        {task.isCritical && (
          <AlertTriangle size={14} className="text-unreal-orange shrink-0" />
        )}
      </div>

      {timeLeft && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest w-fit",
            timeLeft.color,
            timeLeft.bg,
            timeLeft.border
          )}
        >
          <Calendar size={10} className="animate-pulse" />
          {timeLeft.label}
        </motion.div>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-ue-border/50">
        <div className="flex items-center gap-1.5 text-ue-text-muted">
          <ListTodo size={12} className={cn(completedCount > 0 && "text-epic-cyan")} />
          <span className="text-[10px] font-bold tracking-wider">
            {completedCount}/{(task.subTasks || []).length}
          </span>
        </div>

        <div className="flex-1 ml-4">
          <div className="h-1.5 bg-ue-bg rounded-full overflow-hidden border border-ue-border/30 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / ((task.subTasks || []).length || 1)) * 100}%` }}
              className={cn(
                "h-full transition-all duration-700 ease-out relative",
                isFullyDone ? "bg-epic-cyan shadow-[0_0_15px_rgba(0,229,255,0.6)]" : "bg-ue-text-muted/50"
              )}
            >
              {completedCount > 0 && !isFullyDone && (
                <motion.div 
                  animate={{ x: ['0%', '100%'], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2"
                />
              )}
            </motion.div>
          </div>
        </div>

        {isFullyDone && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="ml-3"
          >
            <CheckCircle2 size={16} className="text-epic-cyan drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
