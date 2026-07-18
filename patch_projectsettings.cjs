const fs = require('fs');
let file = fs.readFileSync('src/components/ProjectSettingsModal.tsx', 'utf8');

file = file.replace(/lang === 'en' \? 'Please upload images only\.' : 'Bitte lade nur Bilder hoch\.'/g, 't.uploadImageOnly');
file = file.replace(/lang === 'en' \? 'Project Name' : 'Projektname'/g, 't.projectNameLabel');
file = file.replace(/lang === 'en' \? 'Project Status' : 'Projektstatus'/g, 't.projectStatus');
file = file.replace(/lang === 'en' \? 'Online' : 'Online'/g, 't.statusOnline');
file = file.replace(/lang === 'en' \? 'Offline' : 'Offline'/g, 't.statusOffline');
file = file.replace(/lang === 'en' \? 'Private' : 'Privat'/g, 't.statusPrivate');
file = file.replace(/lang === 'en' \? 'Custom' : 'Eigener'/g, 't.statusCustom');
file = file.replace(/lang === 'en' \? 'Enter custom status\.\.\.' : 'Eigenen Status eingeben\.\.\.'/g, 't.enterCustomStatus');
file = file.replace(/lang === 'en' \? 'Preview Image' : 'Vorschaubild'/g, 't.previewImage');
file = file.replace(/lang === 'en' \? 'Drag image here' : 'Bild hierhin ziehen'/g, 't.dragImageHere');
file = file.replace(/lang === 'en' \? 'or click to upload' : 'oder klicken zum Hochladen'/g, 't.orClickToUpload');
file = file.replace(/lang === 'en' \? 'Image uploaded' : 'Bild hochgeladen'/g, 't.imageUploaded');
file = file.replace(/lang === 'en' \? 'Or paste an image URL\.\.\.' : 'Oder Bild-URL einfügen\.\.\.'/g, 't.orPasteImageUrl');
file = file.replace(/lang === 'en' \? 'Save as Template' : 'Als Vorlage speichern'/g, 't.saveAsTemplate');
file = file.replace(/lang === 'en' \? 'Choose an icon and save the current project setup as a template\.' : 'Wähle ein Symbol und speichere die aktuelle Struktur als Vorlage\.'/g, 't.saveTemplateDesc');
file = file.replace(/isSavingTemplate \? \(lang === 'en' \? 'Saving\.\.\.' : 'Speichert\.\.\.'\) : \(lang === 'en' \? 'Create Template' : 'Vorlage erstellen'\)/g, 'isSavingTemplate ? t.savingTemplate : t.createTemplateBtn');

fs.writeFileSync('src/components/ProjectSettingsModal.tsx', file);
