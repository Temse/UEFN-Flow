const fs = require('fs');
let file = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
file = file.replace(/function ProjectCard\(\{\s+const t = translations\[lang\]; project, onDelete, onArchive, onExport, index, lang \}: any\) \{/g, "function ProjectCard({ project, onDelete, onArchive, onExport, index, lang }: any) {\n  const t = translations[lang];");
fs.writeFileSync('src/components/Dashboard.tsx', file);

let file2 = fs.readFileSync('src/components/ProjectHealthChart.tsx', 'utf8');
file2 = file2.replace(/export default function ProjectHealthChart\(\{\s+const t = translations\[lang\]; projects, lang \}: ProjectHealthChartProps\) \{/g, "export default function ProjectHealthChart({ projects, lang }: ProjectHealthChartProps) {\n  const t = translations[lang];");
fs.writeFileSync('src/components/ProjectHealthChart.tsx', file2);
