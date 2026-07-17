const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace("import { translations, Language } from '../lib/translations';", "import { translations, Language } from '../lib/translations';\nimport { useLanguage } from '../lib/LanguageContext';");

// Replace the manual state
const manualStateStr = `  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('uefn-lang');
    if (saved) return saved as Language;
    
    // Auto-detect browser language if not set
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'zh', 'ja'];
    return supportedLangs.includes(browserLang) ? (browserLang as Language) : 'en';
  });
  
  const [showLanguageSelector, setShowLanguageSelector] = useState(() => {
    return !localStorage.getItem('uefn-lang-set');
  });`;

if (code.includes(manualStateStr)) {
  code = code.replace(manualStateStr, `  const { lang, setLang, showLanguageSelector, setShowLanguageSelector } = useLanguage();`);
}

// Remove old props passed to LanguageSelectorModal
code = code.replace(`            <LanguageSelectorModal
              isOpen={showLanguageSelector}
              defaultLang={lang}
              onSelect={(l) => {
                setLang(l);
                localStorage.setItem('uefn-lang', l);
                localStorage.setItem('uefn-lang-set', 'true');
                setShowLanguageSelector(false);
              }}
              onClose={() => {
                localStorage.setItem('uefn-lang-set', 'true');
                setShowLanguageSelector(false);
              }}
            />`, `            <LanguageSelectorModal
              isOpen={showLanguageSelector}
              defaultLang={lang}
              onSelect={(l) => {
                setLang(l);
                setShowLanguageSelector(false);
              }}
              onClose={() => setShowLanguageSelector(false)}
            />`);

fs.writeFileSync('src/components/Dashboard.tsx', code);
