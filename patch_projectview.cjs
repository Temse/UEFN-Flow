const fs = require('fs');
let file = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

file = file.replace(/lang === 'en' \? 'Project could not be loaded' : 'Projekt konnte nicht geladen werden'/g, 't.projectLoadError');
file = file.replace(/lang === 'en' \? 'Project Not Found' : 'Projekt nicht gefunden'/g, 't.projectNotFound');
file = file.replace(/error \|\| \(lang === 'en' \? 'The requested project does not exist\.' : 'Das angeforderte Projekt existiert nicht\.'\)/g, 'error || t.projectNotExist');
file = file.replace(/lang === 'en' \? 'Note for GitHub Pages:' : 'Hinweis für GitHub Pages:'/g, 't.noteForGithub');

file = file.replace(/lang === 'en' \s*\n\s*\? 'If you are using the static GitHub Pages version of this app, projects are only saved in your browser\\'s local storage\. Links cannot be shared across different devices because there is no backend server\.' \s*\n\s*\: 'Wenn du die statische GitHub Pages-Version dieser App verwendest, werden Projekte nur im lokalen Speicher deines Browsers gespeichert\. Links können nicht geräteübergreifend geteilt werden, da kein Backend-Server vorhanden ist\.'/g, 't.githubNoteDesc');

file = file.replace(/lang === 'en' \? 'Add New Column' : 'Neue Spalte hinzufügen'/g, 't.addNewColumn');
file = file.replace(/lang === 'en' \? 'Enter column name\.\.\.' : 'Spaltenname eingeben\.\.\.'/g, 't.enterColumnName');
file = file.replace(/lang === 'en' \? 'Add New Task' : 'Neue Aufgabe hinzufügen'/g, 't.addNewTask');
file = file.replace(/lang === 'en' \? 'Enter task title\.\.\.' : 'Aufgabentitel eingeben\.\.\.'/g, 't.enterTaskTitle');
file = file.replace(/lang === 'en' \? 'Rename Column' : 'Spalte umbenennen'/g, 't.renameColumn');
file = file.replace(/lang === 'en' \? 'New column name\.\.\.' : 'Neuer Spaltenname\.\.\.'/g, 't.newColumnName');
file = file.replace(/lang === 'en' \? 'Delete Column' : 'Spalte löschen'/g, 't.deleteColumnBtn');
file = file.replace(/lang === 'en' \? 'Are you sure you want to delete this column and all its tasks\?' : 'Bist du sicher, dass du diese Spalte und alle darin enthaltenen Aufgaben löschen möchtest\?'/g, 't.deleteColumnConfirm');
file = file.replace(/lang === 'en' \? 'Delete' : 'Löschen'/g, 't.deleteBtn');
file = file.replace(/lang === 'en' \? 'Cancel' : 'Abbrechen'/g, 't.cancelBtn');
file = file.replace(/lang === 'en' \? 'Progress saved successfully' : 'Fortschritt erfolgreich gesichert'/g, 't.progressSaved');
file = file.replace(/lang === 'en' \? 'All changes saved' : 'Alle Änderungen gespeichert'/g, 't.allChangesSaved');

fs.writeFileSync('src/components/ProjectView.tsx', file);
