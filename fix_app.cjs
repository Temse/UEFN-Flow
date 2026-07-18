const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

file = file.replace(/import \{ LanguageProvider \} from '\.\/lib\/LanguageContext';/, "import { LanguageProvider } from './lib/LanguageContext';\nimport { SettingsProvider } from './lib/SettingsContext';\nimport MouseEffect from './components/MouseEffect';");

file = file.replace(/<LanguageProvider>/, "<LanguageProvider>\n      <SettingsProvider>");
file = file.replace(/<\/LanguageProvider>/, "</SettingsProvider>\n    </LanguageProvider>");
file = file.replace(/<Router>/, "<MouseEffect />\n      <Router>");

fs.writeFileSync('src/App.tsx', file);
