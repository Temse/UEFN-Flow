const fs = require('fs');
let file = fs.readFileSync('src/lib/translations.ts', 'utf8');

const tSearch = {
  en: '"searchProjects": "Search projects...",',
  de: '"searchProjects": "Projekte durchsuchen...",',
  es: '"searchProjects": "Buscar proyectos...",',
  fr: '"searchProjects": "Rechercher des projets...",',
  it: '"searchProjects": "Cerca progetti...",',
  pt: '"searchProjects": "Procurar projetos...",',
  ru: '"searchProjects": "Поиск проектов...",',
  zh: '"searchProjects": "搜索项目...",',
  ja: '"searchProjects": "プロジェクトを検索...",'
};

const lines = file.split('\n');
let currentLang = null;
const updatedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  updatedLines.push(line);
  
  const match = line.match(/^\s+([a-z]{2}):\s+\{/);
  if (match) {
    currentLang = match[1];
  }
  
  if (currentLang && line.includes('"liveProgress":')) {
    updatedLines.push(`    ${tSearch[currentLang] || tSearch['en']}`);
  }
}

fs.writeFileSync('src/lib/translations.ts', updatedLines.join('\n'));
