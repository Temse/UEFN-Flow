const fs = require('fs');
let code = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

code = code.replace("import { translations, Language } from '../lib/translations';", "import { translations, Language } from '../lib/translations';\nimport { useLanguage } from '../lib/LanguageContext';");

if (code.includes(`  // Read language and theme setting
  const lang = (localStorage.getItem('uefn-lang') as Language) || 'en';
  const t = translations[lang];`)) {
  code = code.replace(`  // Read language and theme setting
  const lang = (localStorage.getItem('uefn-lang') as Language) || 'en';
  const t = translations[lang];`, `  // Read language and theme setting
  const { lang } = useLanguage();
  const t = translations[lang];`);
}

fs.writeFileSync('src/components/ProjectView.tsx', code);
