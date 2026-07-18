const fs = require('fs');

let file = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
file = file.replace(/lang === 'en' \? 'Export Project' : 'Projekt exportieren'/g, 't.exportProject');
file = file.replace(/lang === 'en' \? \(project\.archived \? 'Unarchive Project' : 'Archive Project'\) : \(project\.archived \? 'Projekt wiederherstellen' : 'Projekt archivieren'\)/g, 'project.archived ? t.unarchiveProject : t.archiveProject');
file = file.replace(/lang === 'en' \? 'Delete Project' : 'Projekt löschen'/g, 't.deleteProject');
file = file.replace(/lang === 'en' \? 'Completion' : 'Abschluss'/g, 't.completion');
file = file.replace(/lang === 'en' \? translations\.en\.openBtn : translations\.de\.openBtn/g, 't.openBtn');
file = file.replace(/lang === 'en' \? 'Failed to import project' : 'Import fehlgeschlagen'/g, 't.importFailed');
file = file.replace(/lang === 'en' \? 'Error saving project locally' : 'Fehler beim lokalen Sichern des Projekts'/g, 't.localSaveError');
file = file.replace(/lang === 'en' \? 'Import Project' : 'Projekt importieren'/g, 't.importProject');
file = file.replace(/lang === 'en' \? 'Import' : 'Import'/g, 't.importBtn');

fs.writeFileSync('src/components/Dashboard.tsx', file);
