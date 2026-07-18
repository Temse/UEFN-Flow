const fs = require('fs');

const baseTranslations = {
  projectNotesTitle: { en: "Project Notes", de: "Projektnotizen", es: "Notas del proyecto", fr: "Notes du projet", it: "Note del progetto", pt: "Notas do projeto", ru: "Заметки проекта", zh: "项目笔记", ja: "プロジェクトノート" },
  projectNotesDesc: { en: "Quick snippets and project wiki", de: "Schnelle Snippets und Projekt-Wiki", es: "Fragmentos rápidos y wiki del proyecto", fr: "Extraits rapides et wiki du projet", it: "Snippet rapidi e wiki del progetto", pt: "Trechos rápidos e wiki do projeto", ru: "Быстрые фрагменты и вики проекта", zh: "快速代码段和项目 wiki", ja: "クイックスニペットとプロジェクトwiki" },
  projectNotesPlaceholder: { en: "Write down coordinates, ideas, island settings, or reminders...", de: "Schreibe Koordinaten, Ideen, Island-Einstellungen oder Erinnerungen auf...", es: "Escribe coordenadas, ideas, ajustes de la isla o recordatorios...", fr: "Notez des coordonnées, idées, paramètres d'île ou rappels...", it: "Scrivi coordinate, idee, impostazioni isola o promemoria...", pt: "Escreva coordenadas, ideias, configurações da ilha ou lembretes...", ru: "Запишите координаты, идеи, настройки острова или напоминания...", zh: "写下坐标、想法、岛屿设置或提醒...", ja: "座標、アイデア、島の設定、またはリマインダーを書き留めます..." },
  quickReminders: { en: "Quick Reminders", de: "Schnelle Erinnerungen", es: "Recordatorios rápidos", fr: "Rappels rapides", it: "Promemoria rapidi", pt: "Lembretes rápidos", ru: "Быстрые напоминания", zh: "快速提醒", ja: "クイックリマインダー" },
  addQuickReminder: { en: "Add quick reminder...", de: "Schnelle Erinnerung hinzufügen...", es: "Añadir recordatorio rápido...", fr: "Ajouter un rappel rapide...", it: "Aggiungi promemoria rapido...", pt: "Adicionar lembrete rápido...", ru: "Добавить быстрое напоминание...", zh: "添加快速提醒...", ja: "クイックリマインダーを追加..." },
  savedStatus: { en: "Saved", de: "Gespeichert", es: "Guardado", fr: "Enregistré", it: "Salvato", pt: "Salvo", ru: "Сохранено", zh: "已保存", ja: "保存済み" },
};

const file = fs.readFileSync('src/lib/translations.ts', 'utf8');
const lines = file.split('\n');

const codes = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'zh', 'ja'];
let currentLang = null;

const updatedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('tasksCompleted":')) {
    updatedLines.push(line.replace('"', '",')); // Add comma if missing
  } else {
    updatedLines.push(line);
  }
  
  const match = line.match(/^\s+([a-z]{2}):\s+\{/);
  if (match) {
    currentLang = match[1];
  }
  
  if (currentLang && line.includes('tasksCompleted":')) {
    for (const [key, langs] of Object.entries(baseTranslations)) {
      if (langs[currentLang]) {
        updatedLines.push(`    "${key}": "${langs[currentLang]}",`);
      }
    }
  }
}

fs.writeFileSync('src/lib/translations.ts', updatedLines.join('\n'));
