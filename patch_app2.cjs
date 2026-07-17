const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('LanguageProvider')) {
  code = code.replace("import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';", 
    "import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';\nimport { LanguageProvider } from './lib/LanguageContext';");

  code = code.replace("<Router>", "<LanguageProvider>\n    <Router>");
  code = code.replace("</Router>", "</Router>\n    </LanguageProvider>");
  
  fs.writeFileSync('src/App.tsx', code);
}
