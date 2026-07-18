const fs = require('fs');

let file = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

file = file.replace(/function ProjectCard\(\{  const t = translations\[lang\]; project, onDelete, onArchive, onExport, index, lang \}: any\) \{/, "function ProjectCard({ project, onDelete, onArchive, onExport, index, lang }: any) {\n  const t = translations[lang];");

fs.writeFileSync('src/components/Dashboard.tsx', file);
