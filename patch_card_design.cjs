const fs = require('fs');
let file = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

file = file.split('className="group block bg-ue-panel hover:bg-ue-panel-hover border border-ue-border hover:border-epic-cyan/50 rounded-xl overflow-hidden transition-all duration-300 relative"').join('className="group block bg-ue-panel/50 backdrop-blur-sm hover:bg-ue-panel-hover/80 border border-white/5 hover:border-epic-cyan/50 rounded-xl overflow-hidden transition-all duration-300 relative shadow-lg hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]"');

file = file.split('className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-lg text-ue-text-muted hover:text-unreal-orange transition-colors opacity-0 group-hover:opacity-100 z-10"').join('className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-lg text-ue-text-muted hover:text-unreal-orange transition-colors opacity-0 group-hover:opacity-100 z-10 hover:bg-black/70"');

file = file.split('className="p-6"').join('className="p-6 relative z-10"');

fs.writeFileSync('src/components/Dashboard.tsx', file);
