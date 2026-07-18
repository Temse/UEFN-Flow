const fs = require('fs');
let file = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

file = file.replace(/const \[showManualSaveSuccess, setShowManualSaveSuccess\] = useState\(false\);\n/, "");
file = file.replace(/\{showManualSaveSuccess && \(\s*<motion\.div\s*key="view-manualsave"[\s\S]*?<\/motion\.div>\s*\)\}\s*/, "");

fs.writeFileSync('src/components/ProjectView.tsx', file);
