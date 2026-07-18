const fs = require('fs');

let constants = fs.readFileSync('src/constants.ts', 'utf8');
let translations = fs.readFileSync('src/lib/translations.ts', 'utf8');

const regex = /isEn \? '((?:\\'|[^'])*)' : '((?:\\'|[^'])*)'/g;
let match;
let i = 0;

const extracted = [];
while ((match = regex.exec(constants)) !== null) {
  const enStr = match[1];
  const deStr = match[2];
  
  // Create a safe key name based on english string
  let key = 'task_' + enStr.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').substring(0, 20).toLowerCase() + '_' + i;
  i++;
  
  extracted.push({ key, enStr, deStr, original: match[0] });
}

// Now inject into translations
const lines = translations.split('\n');
const codes = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'zh', 'ja'];
let currentLang = null;
const updatedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('tasksCompleted":')) {
    updatedLines.push(line.replace('"', '",'));
  } else {
    updatedLines.push(line);
  }
  
  const match = line.match(/^\s+([a-z]{2}):\s+\{/);
  if (match) {
    currentLang = match[1];
  }
  
  if (currentLang && line.includes('liveProgress":')) {
    for (const ex of extracted) {
      const val = currentLang === 'de' ? ex.deStr : ex.enStr;
      updatedLines.push(`    "${ex.key}": "${val}",`);
    }
  }
}

fs.writeFileSync('src/lib/translations.ts', updatedLines.join('\n'));

// Now replace in constants.ts
let newConstants = constants;
for (const ex of extracted) {
  newConstants = newConstants.replace(ex.original, `t.${ex.key}`);
}

// Add const t = translations[lang]; to getTemplateTasks
newConstants = newConstants.replace(/export const getTemplateTasks = \(template: ProjectTemplate, lang: string = 'de'\): Task\[\] => \{/, "export const getTemplateTasks = (template: ProjectTemplate, lang: Language = 'de'): Task[] => {\n  const t = translations[lang];");

// Remove const isEn = lang === 'en';
newConstants = newConstants.replace(/const isEn = lang === 'en';\n/g, '');

fs.writeFileSync('src/constants.ts', newConstants);

console.log(`Extracted ${extracted.length} strings`);
