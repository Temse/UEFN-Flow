const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('LanguageProvider')) {
  code = code.replace("import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';", 
    "import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\nimport { LanguageProvider } from './lib/LanguageContext';");

  code = code.replace("<Router>", "<LanguageProvider>\n      <Router>");
  code = code.replace("</Router>", "</Router>\n    </LanguageProvider>");
  
  fs.writeFileSync('src/App.tsx', code);
}
