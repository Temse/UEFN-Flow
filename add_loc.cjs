const fs = require('fs');
const path = './src/constants.ts';
let file = fs.readFileSync(path, 'utf8');

const tKeys = {
  title: 'task_localize_project_1001',
  desc: 'task_translate_ui_texts__1002',
  st1: 'task_add_string_tables_1003',
  st2: 'task_translate_to_engli_1004',
  tip: 'task_more_languages_eq__1005'
};

const newTask = `
    {
      id: 'task-opt-5',
      columnId: 'optimization',
      title: t.${tKeys.title},
      description: t.${tKeys.desc},
      subTasks: [
        { id: 'st-opt-5-1', title: t.${tKeys.st1}, completed: false },
        { id: 'st-opt-5-2', title: t.${tKeys.st2}, completed: false },
      ],
      tips: [t.${tKeys.tip}],
      notes: ''
    },`;

// Add before the "release" tasks start
file = file.replace(/    \{\s*id: 'task-rel-1',/m, newTask + "\n    {\n      id: 'task-rel-1',");
fs.writeFileSync(path, file);

// Add to translations
let trans = fs.readFileSync('./src/lib/translations.ts', 'utf8');

const additions = {
  en: {
    [tKeys.title]: "Localize Project",
    [tKeys.desc]: "Translate UI texts and game messages for a wider audience.",
    [tKeys.st1]: "Add String Tables",
    [tKeys.st2]: "Translate to English/Spanish",
    [tKeys.tip]: "More languages = larger player base."
  },
  de: {
    [tKeys.title]: "Projekt lokalisieren",
    [tKeys.desc]: "UI-Texte und Ingame-Nachrichten für mehr Spieler übersetzen.",
    [tKeys.st1]: "String Tables hinzufügen",
    [tKeys.st2]: "Auf Englisch/Spanisch übersetzen",
    [tKeys.tip]: "Mehr Sprachen = größere Spielerbasis."
  }
};

const langs = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'zh', 'ja'];
const lines = trans.split('\n');
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
    // Inject the translation
    const add = additions[currentLang] || additions['en'];
    for (const [key, val] of Object.entries(add)) {
      updatedLines.push(`    "${key}": "${val}",`);
    }
  }
}

fs.writeFileSync('./src/lib/translations.ts', updatedLines.join('\n'));
