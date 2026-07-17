const fs = require('fs');

const fixFile = (file) => {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes("import { useLanguage } from '../lib/LanguageContext';")) {
      // Find the best place to inject the import
      const translationsImport = "import { translations, Language } from '../lib/translations';";
      if (code.includes(translationsImport)) {
        code = code.replace(translationsImport, "import { translations, Language } from '../lib/translations';\nimport { useLanguage } from '../lib/LanguageContext';");
      } else {
        // Just put it at the top
        code = "import { useLanguage } from '../lib/LanguageContext';\n" + code;
      }
      fs.writeFileSync(file, code);
  }
}

fixFile('src/components/Header.tsx');
fixFile('src/components/ProjectNotesPanel.tsx');

