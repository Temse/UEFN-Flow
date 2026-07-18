const fs = require('fs');

function addT(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('const { lang } = useLanguage();') && !content.includes('const t = translations[lang];')) {
    content = content.replace(/const \{ lang \} = useLanguage\(\);/, "const { lang } = useLanguage();\n  const t = translations[lang];");
    if (!content.includes("import { translations }")) {
      content = content.replace(/import \{ useLanguage \} from '\.\.\/lib\/LanguageContext';/, "import { useLanguage } from '../lib/LanguageContext';\nimport { translations } from '../lib/translations';");
    }
    fs.writeFileSync(file, content);
  }
}

addT('src/components/Dashboard.tsx');
addT('src/components/ProjectHealthChart.tsx');
addT('src/components/ImportExportModal.tsx');
addT('src/components/Header.tsx');

