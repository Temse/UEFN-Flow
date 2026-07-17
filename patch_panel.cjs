const fs = require('fs');

let code = fs.readFileSync('src/components/ProjectNotesPanel.tsx', 'utf8');

code = code.replace("  lang: string;", "");
code = code.replace("export default function ProjectNotesPanel({ project, onUpdateNotes, onClose, lang }: ProjectNotesPanelProps) {", 
"export default function ProjectNotesPanel({ project, onUpdateNotes, onClose }: ProjectNotesPanelProps) {");

fs.writeFileSync('src/components/ProjectNotesPanel.tsx', code);

// and also in ProjectView.tsx where it's passed
let pv = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');
pv = pv.replace("lang={lang}", "");
fs.writeFileSync('src/components/ProjectView.tsx', pv);
