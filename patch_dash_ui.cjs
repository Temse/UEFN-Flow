const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// 1. Add Import to imports
if (!content.includes('ImportExportModal')) {
  content = content.replace("import LanguageSelectorModal from './LanguageSelectorModal';", "import LanguageSelectorModal from './LanguageSelectorModal';\nimport ImportExportModal from './ImportExportModal';");
}

// 2. Add state for import/export in Dashboard component
const stateVars = `
  const [showImportExport, setShowImportExport] = useState<{mode: 'import' | 'export', data?: string} | null>(null);
  
  const handleImport = (dataStr: string) => {
    try {
      const parsed = JSON.parse(dataStr);
      // Generate a new ID to avoid collisions if they re-import the same project
      const newId = 'proj_' + Math.random().toString(36).substr(2, 9);
      const newProj = { ...parsed, id: newId };
      const updatedList = [...projects, newProj];
      setProjects(deduplicateById(updatedList));
      localStorage.setItem('uefn-cached-projects', JSON.stringify(deduplicateById(updatedList)));
      localStorage.setItem(\`uefn-cached-project-\${newId}\`, JSON.stringify(newProj));
      setShowImportExport(null);
    } catch (e) {
      console.error(e);
      alert(lang === 'en' ? 'Failed to import project' : 'Import fehlgeschlagen');
    }
  };
`;

if (!content.includes('showImportExport')) {
  content = content.replace("const [projectToDelete, setProjectToDelete] = useState<string | null>(null);", "const [projectToDelete, setProjectToDelete] = useState<string | null>(null);" + stateVars);
}

// 3. Update the export button in ProjectCard
// In ProjectCard, we need to pass a callback for export or handle it.
// The export button currently calls window.open('/api/backup/export/...').
// Let's change the ProjectCard props to accept onExport.
const cardPropsDefOld = `interface ProjectCardProps {
  project: Project;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onArchive: (id: string, e: React.MouseEvent) => void;
  index: number;
  lang: any;
}`;
const cardPropsDefNew = `interface ProjectCardProps {
  project: Project;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onArchive: (id: string, e: React.MouseEvent) => void;
  onExport: (project: Project, e: React.MouseEvent) => void;
  index: number;
  lang: any;
}`;
content = content.replace(cardPropsDefOld, cardPropsDefNew);

const cardCompOld = `function ProjectCard({ project, onDelete, onArchive, index, lang }: ProjectCardProps) {`;
const cardCompNew = `function ProjectCard({ project, onDelete, onArchive, onExport, index, lang }: ProjectCardProps) {`;
content = content.replace(cardCompOld, cardCompNew);

const exportBtnOld = `onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(\`/api/backup/export/\${project.id}\`, '_blank');
              }}`;
const exportBtnNew = `onClick={(e) => onExport(project, e)}`;
content = content.replace(exportBtnOld, exportBtnNew);

// 4. Update the ProjectCard usage in Dashboard
const mapOld = `onArchive={archiveProject}
                    index={index}
                    lang={lang}
                  />`;
const mapNew = `onArchive={archiveProject}
                    onExport={(p, e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const fullProject = localStorage.getItem(\`uefn-cached-project-\${p.id}\`);
                      if (fullProject) {
                        setShowImportExport({ mode: 'export', data: fullProject });
                      } else {
                        setShowImportExport({ mode: 'export', data: JSON.stringify(p, null, 2) });
                      }
                    }}
                    index={index}
                    lang={lang}
                  />`;
content = content.replace(mapOld, mapNew);

// 5. Add the import button to the header
const headerButtonsOld = `<button
              onClick={() => setShowArchived(!showArchived)}`;
const headerButtonsNew = `<button
              onClick={() => setShowImportExport({ mode: 'import' })}
              className="text-ue-text-muted hover:text-epic-cyan transition-colors flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded bg-ue-border/50 hover:bg-ue-border"
              title={lang === 'en' ? 'Import Project' : 'Projekt importieren'}
            >
              <Upload size={16} />
              {lang === 'en' ? 'Import' : 'Import'}
            </button>
            <button
              onClick={() => setShowArchived(!showArchived)}`;
content = content.replace(headerButtonsOld, headerButtonsNew);

// 6. Add ImportExportModal and Footer
const renderModalsOld = `</AnimatePresence>
    </div>`;
const renderModalsNew = `{showImportExport && (
          <ImportExportModal
            mode={showImportExport.mode}
            exportData={showImportExport.data}
            onImport={handleImport}
            onClose={() => setShowImportExport(null)}
            lang={lang}
          />
        )}
      </AnimatePresence>
      <footer className="max-w-7xl mx-auto px-6 pb-6 text-center text-ue-text-muted text-sm flex items-center justify-center gap-4">
        <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="hover:text-epic-cyan transition-colors">Discord</a>
        <span>&bull;</span>
        <span>made by hifn_w</span>
      </footer>
    </div>`;
content = content.replace(renderModalsOld, renderModalsNew);

fs.writeFileSync('src/components/Dashboard.tsx', content);
console.log("Patched UI successfully");
