const fs = require('fs');
let file = fs.readFileSync('src/components/ImportExportModal.tsx', 'utf8');

if (!file.includes("import toast from 'react-hot-toast';")) {
  file = file.replace(/import \{ translations \} from '\.\.\/lib\/translations';/, "import { translations } from '../lib/translations';\nimport toast from 'react-hot-toast';");
}

file = file.replace(/await navigator\.clipboard\.writeText\(exportData\);\n\s*setCopied\(true\);\n\s*setTimeout\(\(\) => setCopied\(false\), 2000\);/, "await navigator.clipboard.writeText(exportData);\n      setCopied(true);\n      toast.success(t.copiedToClipboard || 'Copied to clipboard!');\n      setTimeout(() => setCopied(false), 2000);");

fs.writeFileSync('src/components/ImportExportModal.tsx', file);
