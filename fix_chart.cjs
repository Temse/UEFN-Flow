const fs = require('fs');

let file = fs.readFileSync('src/components/ProjectHealthChart.tsx', 'utf8');

file = file.replace(/export default function ProjectHealthChart\(\{  const t = translations\[lang\]; projects, lang \}: ProjectHealthChartProps\) \{/, "export default function ProjectHealthChart({ projects, lang }: ProjectHealthChartProps) {\n  const t = translations[lang];");

fs.writeFileSync('src/components/ProjectHealthChart.tsx', file);
