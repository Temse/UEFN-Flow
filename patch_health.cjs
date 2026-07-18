const fs = require('fs');

// Patch ProjectHealthChart.tsx
let health = fs.readFileSync('src/components/ProjectHealthChart.tsx', 'utf8');
health = health.replace(/lang === 'en' \? translations\.en\.projectHealthTitle : translations\.de\.projectHealthTitle/g, 't.projectHealthTitle');
health = health.replace(/lang === 'en' \? translations\.en\.activeProjectsStats : translations\.de\.activeProjectsStats/g, 't.activeProjectsStats');
health = health.replace(/lang === 'en' \? 'Top Active UEFN Projects' : 'Aktivste UEFN-Projekte'/g, 't.topActiveProjects');
health = health.replace(/lang === 'en' \? 'Live Progress' : 'Live-Fortschritt'/g, 't.liveProgress');
fs.writeFileSync('src/components/ProjectHealthChart.tsx', health);

// Patch ProjectSettingsModal.tsx
let settings = fs.readFileSync('src/components/ProjectSettingsModal.tsx', 'utf8');
settings = settings.replace(/lang === "en" \? "Template" : "Vorlage"/g, 't.template');
settings = settings.replace(/lang === "en" \? "Template successfully saved!" : "Vorlage erfolgreich gespeichert!"/g, 't.templateSaved');
settings = settings.replace(/lang === "en" \? \(project\.archived \? "Unarchive" : "Archive"\) : \(project\.archived \? "Wiederherstellen" : "Archivieren"\)/g, 'project.archived ? t.unarchiveBtn : t.archiveBtn');
settings = settings.replace(/lang === "en" \? "Cancel" : "Abbrechen"/g, 't.cancelBtn');
settings = settings.replace(/lang === "en" \? "Save" : "Speichern"/g, 't.saveBtn');
fs.writeFileSync('src/components/ProjectSettingsModal.tsx', settings);

