const fs = require('fs');

let settingsCode = fs.readFileSync('src/components/ProjectSettingsModal.tsx', 'utf8');

settingsCode = settingsCode.replace(
  'interface ProjectSettingsModalProps { key?: string | number;',
  'interface ProjectSettingsModalProps { key?: string | number;\n  onArchive?: () => void;'
);

settingsCode = settingsCode.replace(
  'export default function ProjectSettingsModal({ project, onClose, onUpdate }: ProjectSettingsModalProps) {',
  'export default function ProjectSettingsModal({ project, onClose, onUpdate, onArchive }: ProjectSettingsModalProps) {'
);

const archiveBtnStr = `
          {onArchive && (
            <div className="pt-6 mt-6 border-t border-ue-border/50">
              <button
                onClick={() => {
                  if (confirm(project.archived ? (lang === 'en' ? 'Unarchive this project?' : 'Projekt wiederherstellen?') : (lang === 'en' ? 'Archive this project?' : 'Projekt archivieren?'))) {
                    onArchive();
                    onClose();
                  }
                }}
                className="w-full py-2 bg-transparent border border-ue-text-muted/30 hover:bg-ue-text-muted/10 hover:border-ue-text text-ue-text rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-bold text-sm"
              >
                {project.archived ? (lang === 'en' ? 'Unarchive Project' : 'Projekt wiederherstellen') : (lang === 'en' ? 'Archive Project' : 'Projekt archivieren')}
              </button>
            </div>
          )}
`;

settingsCode = settingsCode.replace(
  '{/* Actions */}',
  `{/* Actions */}` + archiveBtnStr
);

fs.writeFileSync('src/components/ProjectSettingsModal.tsx', settingsCode);

let viewCode = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

const handleArchiveStr = `
  const handleArchive = async () => {
    if (!project) return;
    try {
      const newArchivedState = !project.archived;
      await fetch(\`/api/projects/\${project.id}/archive\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: newArchivedState })
      });
      setProject(prev => prev ? { ...prev, archived: newArchivedState } : prev);
      socket?.emit('project-updated', { ...project, archived: newArchivedState });
    } catch(e) {}
  };
`;

viewCode = viewCode.replace(
  'const [isSaving, setIsSaving] = useState(false);',
  `const [isSaving, setIsSaving] = useState(false);\n${handleArchiveStr}`
);

viewCode = viewCode.replace(
  '<ProjectSettingsModal key="view-settings"',
  '<ProjectSettingsModal key="view-settings"\n            onArchive={handleArchive}'
);

fs.writeFileSync('src/components/ProjectView.tsx', viewCode);
