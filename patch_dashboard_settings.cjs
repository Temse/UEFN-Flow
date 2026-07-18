const fs = require('fs');
let file = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

if (!file.includes("import GlobalSettingsModal from './GlobalSettingsModal';")) {
  file = file.replace(/import ImportExportModal from '\.\/ImportExportModal';/, "import ImportExportModal from './ImportExportModal';\nimport GlobalSettingsModal from './GlobalSettingsModal';");
}

if (!file.includes("const [showGlobalSettings, setShowGlobalSettings] = useState(false);")) {
  file = file.replace(/const \[showOnboarding, setShowOnboarding\] = useState\(false\);/, "const [showOnboarding, setShowOnboarding] = useState(false);\n  const [showGlobalSettings, setShowGlobalSettings] = useState(false);");
}

const settingsBtn = `<button
              onClick={() => setShowGlobalSettings(true)}
              className="text-ue-text-muted hover:text-epic-cyan transition-colors p-2"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}`;

file = file.replace(/<button\s*onClick=\{\(\) => setTheme\(theme === 'dark' \? 'light' : 'dark'\)\}/, settingsBtn);

const modalRender = `{showGlobalSettings && (
        <GlobalSettingsModal onClose={() => setShowGlobalSettings(false)} lang={lang} />
      )}
    </div>
  );
}`;

file = file.replace(/<\/div>\s*\);\s*\}/, modalRender);

fs.writeFileSync('src/components/Dashboard.tsx', file);
