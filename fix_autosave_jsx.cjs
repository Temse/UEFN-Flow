const fs = require('fs');
let file = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

file = file.replace(/const \[showAutoSaveToast, setShowAutoSaveToast\] = useState\(false\);\n/, "");
file = file.replace(/\{showAutoSaveToast && \(\s*<motion\.div\s*key="view-autosave"[\s\S]*?<\/motion\.div>\s*\)\}\s*/, "");

fs.writeFileSync('src/components/ProjectView.tsx', file);
