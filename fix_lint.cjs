const fs = require('fs');

// App.tsx missing import LanguageProvider
let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes("import { LanguageProvider }")) {
    app = app.replace("import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';", 
    "import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';\nimport { LanguageProvider } from './lib/LanguageContext';");
    fs.writeFileSync('src/App.tsx', app);
}

// Header.tsx missing import useLanguage
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');
if (!header.includes("import { useLanguage }")) {
    header = header.replace("import { translations, Language } from '../lib/translations';", 
    "import { translations, Language } from '../lib/translations';\nimport { useLanguage } from '../lib/LanguageContext';");
    fs.writeFileSync('src/components/Header.tsx', header);
}

// ProjectNotesPanel.tsx missing import useLanguage
let notes = fs.readFileSync('src/components/ProjectNotesPanel.tsx', 'utf8');
if (!notes.includes("import { useLanguage }")) {
    notes = notes.replace("import { translations, Language } from '../lib/translations';", 
    "import { translations, Language } from '../lib/translations';\nimport { useLanguage } from '../lib/LanguageContext';");
    fs.writeFileSync('src/components/ProjectNotesPanel.tsx', notes);
}

// mockApi.ts fixes
let mockApi = fs.readFileSync('src/lib/mockApi.ts', 'utf8');
mockApi = mockApi.replace("const url = typeof resource === 'string' ? resource : resource.url;", 
"const url = typeof resource === 'string' ? resource : (resource as any).url;");
mockApi = mockApi.replace("if (p) p.position = body.position;", "if (p) (p as any).position = body.position;");
fs.writeFileSync('src/lib/mockApi.ts', mockApi);
