const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  `  const [lang, setLang] = useState<Language>(() => {\n    return (localStorage.getItem('uefn-lang') as Language) || 'en';\n  });`,
  `  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('uefn-lang');
    if (saved) return saved as Language;
    
    // Auto-detect browser language if not set
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'zh', 'ja'];
    return supportedLangs.includes(browserLang) ? (browserLang as Language) : 'en';
  });
  
  const [showLanguageSelector, setShowLanguageSelector] = useState(() => {
    return !localStorage.getItem('uefn-lang-set');
  });`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
