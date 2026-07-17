const fs = require('fs');

let code = fs.readFileSync('src/components/ProjectNotesPanel.tsx', 'utf8');

code = code.replace(/bg-ue-bg\/30/g, 'bg-black/5 dark:bg-black/30');
code = code.replace(/bg-ue-bg\/60/g, 'bg-black/5 dark:bg-black/60');
code = code.replace(/bg-ue-bg\/40/g, 'bg-black/5 dark:bg-black/40');
code = code.replace(/bg-ue-bg\/20/g, 'bg-black/5 dark:bg-black/20');
code = code.replace(/text-white/g, 'text-ue-text');

// Put it back to side-by-side instead of absolute, maybe side-by-side was better
// The user just said "when I open notes the background is bugged" -> probably the transparent bg issue!
code = code.replace(
  'absolute right-0 top-0 bottom-0 z-30',
  'relative z-30'
);

fs.writeFileSync('src/components/ProjectNotesPanel.tsx', code);
