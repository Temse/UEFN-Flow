const fs = require('fs');
let file = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

file = file.replace(/const interval = setInterval\(\(\) => \{\n\s*setShowAutoSaveToast\(true\);\n\s*const timer = setTimeout\(\(\) => setShowAutoSaveToast\(false\), 4000\);\n\s*return \(\) => clearTimeout\(timer\);\n\s*\}, 5 \* 60 \* 1000\);/, 
`const interval = setInterval(() => {
      toast(t.progressSaved || 'Progress auto-saved', {
        icon: '🔄',
        style: {
          border: '1px solid #4ade80',
          padding: '16px',
          color: '#ffffff',
          background: '#1a1a1a',
        },
      });
    }, 5 * 60 * 1000);`);

file = file.replace(/\{showAutoSaveToast && \([\s\S]*?\}\)/, "");

fs.writeFileSync('src/components/ProjectView.tsx', file);
