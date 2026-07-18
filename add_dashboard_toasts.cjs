const fs = require('fs');
let file = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

if (!file.includes("import toast from 'react-hot-toast';")) {
  file = file.replace(/import \{ calculateProgress \} from '\.\.\/lib\/progress';/, "import { calculateProgress } from '../lib/progress';\nimport toast from 'react-hot-toast';");
}

// Inside handleImportProject
file = file.replace(/setShowImportExport\(null\);\n    \} catch \(e\)/, "setShowImportExport(null);\n      toast.success(t.projectImported || 'Project imported successfully!');\n    } catch (e)");

// Inside createProject
file = file.replace(/navigate\(\`\/project\/\$\{localId\}\`\);\n    \} catch \(storageErr\)/, "toast.success(t.projectCreated || 'Project created successfully!');\n      navigate(`/project/${localId}`);\n    } catch (storageErr)");

// Inside archiveProject
file = file.replace(/setProjects\(updatedProjects\);\n    localStorage\.setItem\("uefn-cached-projects", JSON\.stringify\(deduplicateById\(updatedProjects\)\)\);\n  \};/, "setProjects(updatedProjects);\n    localStorage.setItem(\"uefn-cached-projects\", JSON.stringify(deduplicateById(updatedProjects)));\n    toast.success(newArchivedState ? (t.projectArchived || 'Project archived') : (t.projectUnarchived || 'Project unarchived'));\n  };");

// Inside confirmDeleteProject
file = file.replace(/setProjectToDelete\(null\);\n  \};/, "setProjectToDelete(null);\n    toast.success(t.projectDeleted || 'Project deleted');\n  };");

fs.writeFileSync('src/components/Dashboard.tsx', file);
