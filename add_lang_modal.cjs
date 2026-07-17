const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const modalStr = `
            <LanguageSelectorModal
              isOpen={showLanguageSelector}
              defaultLang={lang}
              onSelect={(l) => {
                setLang(l);
                localStorage.setItem('uefn-lang', l);
                localStorage.setItem('uefn-lang-set', 'true');
                setShowLanguageSelector(false);
              }}
            />
`;

code = code.replace('<AnimatePresence>', '<AnimatePresence>' + modalStr);

fs.writeFileSync('src/components/Dashboard.tsx', code);
