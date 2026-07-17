const fs = require('fs');

let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const oldFunc = `  const handleExportBackup = () => {
    window.open('/api/backup/export', '_blank');
  };`;

const newFunc = `  const handleExportBackup = () => {
    try {
      const backupData = JSON.stringify(projects, null, 2);
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`uefn-flow-backup-\${new Date().toISOString().split('T')[0]}.json\`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error exporting backup:', e);
      window.open('/api/backup/export', '_blank'); // fallback
    }
  };`;

code = code.replace(oldFunc, newFunc);
fs.writeFileSync('src/components/Dashboard.tsx', code);
