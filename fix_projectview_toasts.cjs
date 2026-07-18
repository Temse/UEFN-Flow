const fs = require('fs');
let file = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

if (!file.includes("import toast from 'react-hot-toast';")) {
  file = file.replace(/import \{ Link \} from 'react-router-dom';/, "import { Link } from 'react-router-dom';\nimport toast from 'react-hot-toast';");
}

file = file.replace(/const handleManualSave = \(\) => \{\n\s*setIsSaving\(true\);\n\s*setTimeout\(\(\) => \{\n\s*setIsSaving\(false\);\n\s*setShowManualSaveSuccess\(true\);\n\s*setTimeout\(\(\) => setShowManualSaveSuccess\(false\), 3000\);\n\s*\}, 800\);\n\s*\};/, 
`const handleManualSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(t.allChangesSaved || 'All changes saved!', {
        icon: '💾',
        style: {
          border: '1px solid #00c9e0',
          padding: '16px',
          color: '#ffffff',
          background: '#1a1a1a',
        },
        iconTheme: {
          primary: '#00c9e0',
          secondary: '#1a1a1a',
        },
      });
    }, 800);
  };`);

file = file.replace(/\{showManualSaveSuccess && \([\s\S]*?\}\)/, "");

fs.writeFileSync('src/components/ProjectView.tsx', file);
