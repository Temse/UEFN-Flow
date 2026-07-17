import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-ue-bg z-[1000] flex flex-col items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#00e5ff0a,transparent)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-unreal-orange rounded-2xl flex items-center justify-center text-5xl font-black text-white mb-8 shadow-[0_0_40px_rgba(255,103,33,0.4)] animate-pulse">
          U
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-ue-text">
            <Loader2 size={20} className="animate-spin text-epic-cyan" />
            <span className="text-sm font-bold uppercase tracking-[0.2em]">Initialisiere UEFN Flow</span>
          </div>
          <div className="w-48 h-1 bg-ue-panel rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-epic-cyan shadow-[0_0_10px_rgba(0,229,255,0.5)]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
