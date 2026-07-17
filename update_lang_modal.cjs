const fs = require('fs');

let code = fs.readFileSync('src/components/LanguageSelectorModal.tsx', 'utf8');

code = code.replace(
  "import { Globe, Search, Check } from 'lucide-react';",
  "import { Globe, Search, Check, X } from 'lucide-react';"
);

code = code.replace(
  '  defaultLang: Language;',
  '  defaultLang: Language;\n  onClose?: () => void;'
);

code = code.replace(
  'export default function LanguageSelectorModal({ isOpen, onSelect, defaultLang }: LanguageSelectorModalProps) {',
  'export default function LanguageSelectorModal({ isOpen, onSelect, defaultLang, onClose }: LanguageSelectorModalProps) {'
);

const headerCode = `        <div className="p-6 border-b border-ue-border bg-ue-bg/30 relative">
          {onClose && (
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-ue-text-muted hover:text-ue-text hover:bg-ue-panel-hover rounded-full transition-colors cursor-pointer">
              <X size={20} />
            </button>
          )}`;

code = code.replace(
  '<div className="p-6 border-b border-ue-border bg-ue-bg/30">',
  headerCode
);

fs.writeFileSync('src/components/LanguageSelectorModal.tsx', code);

let dashCode = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dashCode = dashCode.replace(
  'setShowLanguageSelector(false);\n              }}',
  `setShowLanguageSelector(false);\n              }}\n              onClose={() => {\n                localStorage.setItem('uefn-lang-set', 'true');\n                setShowLanguageSelector(false);\n              }}`
);
fs.writeFileSync('src/components/Dashboard.tsx', dashCode);
