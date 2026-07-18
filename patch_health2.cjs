const fs = require('fs');

let file = fs.readFileSync('src/components/ProjectHealthChart.tsx', 'utf8');

if (!file.includes('const t = translations[lang];')) {
  file = file.replace(/const \{ lang \} = useLanguage\(\);/g, "const { lang } = useLanguage();\n  const t = translations[lang];");
}

fs.writeFileSync('src/components/ProjectHealthChart.tsx', file);
