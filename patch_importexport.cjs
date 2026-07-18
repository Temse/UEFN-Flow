const fs = require('fs');
let file = fs.readFileSync('src/components/ImportExportModal.tsx', 'utf8');

file = file.replace(/lang === 'en' \? 'Please paste project data first\.' : 'Bitte füge zuerst die Projektdaten ein\.'/g, 't.pasteProjectDataFirst');
file = file.replace(/lang === 'en' \? 'Invalid JSON data\. Please check the format\.' : 'Ungültige JSON-Daten\. Bitte Format überprüfen\.'/g, 't.invalidJsonData');
file = file.replace(/lang === 'en' \? 'Export Project Data' : 'Projektdaten exportieren'/g, 't.exportProjectData');
file = file.replace(/lang === 'en' \? 'Import Project Data' : 'Projektdaten importieren'/g, 't.importProjectData');
file = file.replace(/lang === 'en' \? 'Copy this text and save it somewhere safe\. You can use it later to import the project\.' : 'Kopiere diesen Text und speichere ihn sicher\. Du kannst ihn später verwenden, um das Projekt zu importieren\.'/g, 't.copyExportText');
file = file.replace(/lang === 'en' \? 'Paste the project data text here to import it\.' : 'Füge den Projektdaten-Text hier ein, um es zu importieren\.'/g, 't.pasteImportText');
file = file.replace(/lang === 'en' \? 'Copied!' : 'Kopiert!'/g, 't.copied');
file = file.replace(/lang === 'en' \? 'Copy to Clipboard' : 'In Zwischenablage kopieren'/g, 't.copyToClipboard');
file = file.replace(/lang === 'en' \? 'Import Project' : 'Projekt importieren'/g, 't.importProject');

fs.writeFileSync('src/components/ImportExportModal.tsx', file);
