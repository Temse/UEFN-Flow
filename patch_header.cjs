const fs = require('fs');
let file = fs.readFileSync('src/components/Header.tsx', 'utf8');
file = file.replace(/lang === 'en' \? 'Back to Dashboard' : 'Zurück zum Dashboard'/g, 't.backToDashboard');
file = file.replace(/lang === 'en' \? 'Saving\.\.\.' : 'Speichert\.\.\.'/g, 't.saving');
file = file.replace(/lang === 'en' \? 'Save' : 'Speichern'/g, 't.saveBtn');
file = file.replace(/lang === 'en' \? 'Toggle Project Notes' : 'Projektnotizen umschalten'/g, 't.toggleNotes');
file = file.replace(/lang === 'en' \? 'Notes' : 'Notizen'/g, 't.notesBtn');
fs.writeFileSync('src/components/Header.tsx', file);
