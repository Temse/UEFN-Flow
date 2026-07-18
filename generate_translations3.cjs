const fs = require('fs');

const baseTranslations = {
  topActiveProjects: { en: "Top Active UEFN Projects", de: "Aktivste UEFN-Projekte", es: "Proyectos UEFN más activos", fr: "Top des projets UEFN actifs", it: "Progetti UEFN più attivi", pt: "Principais projetos UEFN ativos", ru: "Топ активных проектов UEFN", zh: "热门活跃 UEFN 项目", ja: "トップアクティブUEFNプロジェクト" },
  liveProgress: { en: "Live Progress", de: "Live-Fortschritt", es: "Progreso en vivo", fr: "Progression en direct", it: "Progresso in tempo reale", pt: "Progresso ao vivo", ru: "Живой прогресс", zh: "实时进度", ja: "ライブ進捗" },
  template: { en: "Template", de: "Vorlage", es: "Plantilla", fr: "Modèle", it: "Modello", pt: "Modelo", ru: "Шаблон", zh: "模板", ja: "テンプレート" },
  templateSaved: { en: "Template successfully saved!", de: "Vorlage erfolgreich gespeichert!", es: "¡Plantilla guardada con éxito!", fr: "Modèle enregistré avec succès !", it: "Modello salvato con successo!", pt: "Modelo salvo com sucesso!", ru: "Шаблон успешно сохранен!", zh: "模板保存成功！", ja: "テンプレートが正常に保存されました！" },
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
