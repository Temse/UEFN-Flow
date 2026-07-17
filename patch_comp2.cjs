const fs = require('fs');

const fixFile = (file) => {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes('useLanguage')) {
    code = code.replace(/import \{.*?\} from '\.\.\/lib\/translations';/, "import { translations, Language } from '../lib/translations';\nimport { useLanguage } from '../lib/LanguageContext';");
    code = code.replace("const lang = (localStorage.getItem('uefn-lang') as Language) || 'en';", "const { lang } = useLanguage();");
    
    // Fallback if not found
    if (!code.includes('useLanguage()')) {
        code = code.replace("const t =", "const { lang } = useLanguage();\n  const t =");
    }
    
    fs.writeFileSync(file, code);
  }
};

fixFile('src/components/ProjectNotesPanel.tsx');
