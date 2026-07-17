const fs = require('fs');

const fixFile = (file) => {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes('useLanguage')) {
    code = code.replace("import { translations, Language } from '../lib/translations';", "import { translations, Language } from '../lib/translations';\nimport { useLanguage } from '../lib/LanguageContext';");
    code = code.replace("const lang = (localStorage.getItem('uefn-lang') as Language) || 'en';", "const { lang } = useLanguage();");
    fs.writeFileSync(file, code);
  }
};

fixFile('src/components/Header.tsx');
fixFile('src/components/ProjectSettingsModal.tsx');
