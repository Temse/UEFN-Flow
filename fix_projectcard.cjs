const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
code = code.replace("function ProjectCard({ project, onDelete, onArchive, index, lang }: any) {", "function ProjectCard({ project, onDelete, onArchive, onExport, index, lang }: any) {");
fs.writeFileSync('src/components/Dashboard.tsx', code);
