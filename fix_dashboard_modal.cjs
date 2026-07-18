const fs = require('fs');
let file = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const regexWrongModal = /\{showGlobalSettings && \(\s*<GlobalSettingsModal onClose=\{\(\) => setShowGlobalSettings\(false\)\} lang=\{lang\} \/>\s*\)\}/;
file = file.replace(regexWrongModal, '');

// Also put it at the end of the Dashboard component (which is the last one in the file usually).
// Let's replace the last `</div>\n  );\n}` with the modal.
const lastIndex = file.lastIndexOf('</div>');
if (lastIndex !== -1) {
  const end = file.substring(lastIndex);
  file = file.substring(0, lastIndex) + `{showGlobalSettings && (
        <GlobalSettingsModal onClose={() => setShowGlobalSettings(false)} lang={lang} />
      )}\n    ` + end;
}

fs.writeFileSync('src/components/Dashboard.tsx', file);
