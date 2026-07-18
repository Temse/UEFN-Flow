const fs = require('fs');
let file = fs.readFileSync('src/constants.ts', 'utf8');

file = file.replace(/import \{ Project, Column, Task \} from '\.\/types';/g, "import { Project, Column, Task } from './types';\nimport { translations, Language } from './lib/translations';");
file = file.replace(/export const getDefaultColumns = \(lang: string = 'en'\): Column\[\] => \[/g, "export const getDefaultColumns = (lang: Language = 'en'): Column[] => {\n  const t = translations[lang];\n  return [");

file = file.replace(/\{ id: 'pre-production', title: lang === 'en' \? '📝 Pre-Production' : '📝 Pre-Production' \},/g, "{ id: 'pre-production', title: t.preProduction },");
file = file.replace(/\{ id: 'environment', title: lang === 'en' \? '🛠️ Environment & Art' : '🛠️ Environment & Art' \},/g, "{ id: 'environment', title: t.environmentArt },");
file = file.replace(/\{ id: 'logic', title: lang === 'en' \? '⚙️ Logic & Verse' : '⚙️ Logic & Verse' \},/g, "{ id: 'logic', title: t.logicVerse },");
file = file.replace(/\{ id: 'optimization', title: lang === 'en' \? '🧹 Optimization' : '🧹 Optimization' \},/g, "{ id: 'optimization', title: t.optimizationStage },");
file = file.replace(/\{ id: 'release', title: lang === 'en' \? '🎮 Playtesting & Release' : '🎮 Playtesting & Release' \},/g, "{ id: 'release', title: t.playtestingRelease },");
file = file.replace(/\];/g, "];\n};");

fs.writeFileSync('src/constants.ts', file);
