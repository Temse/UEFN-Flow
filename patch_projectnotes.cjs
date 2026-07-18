const fs = require('fs');
let file = fs.readFileSync('src/components/ProjectNotesPanel.tsx', 'utf8');
file = file.replace(/import { useLanguage } from '\.\.\/lib\/LanguageContext';/g, "import { useLanguage } from '../lib/LanguageContext';\nimport { translations } from '../lib/translations';");

file = file.replace(/const { lang } = useLanguage\(\);/g, "const { lang } = useLanguage();\n  const tr = translations[lang];");

file = file.replace(/const t = \{\n    title: [^\n]+\n    desc: [^\n]+\n    placeholder: [^\n]+\n    reminders: [^\n]+\n    addPlaceholder: [^\n]+\n    saved: [^\n]+\n    saving: [^\n]+\n    noReminders: [^\n]+\n  \};/g, `const t = {
    title: tr.projectNotesTitle,
    desc: tr.projectNotesDesc,
    placeholder: tr.projectNotesPlaceholder,
    reminders: tr.quickReminders,
    addPlaceholder: tr.addQuickReminder,
    saved: tr.savedStatus,
    saving: tr.saving,
    noReminders: tr.noReminders,
  };`);

fs.writeFileSync('src/components/ProjectNotesPanel.tsx', file);
