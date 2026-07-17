const fs = require('fs');

let code = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

const handleArchiveStrOld = `      setProject(prev => prev ? { ...prev, archived: newArchivedState } : prev);
      socket?.emit('project-updated', { ...project, archived: newArchivedState });
    } catch(e) {}`;

const handleArchiveStrNew = `      setProject(prev => prev ? { ...prev, archived: newArchivedState } : prev);
      socket?.emit('project-updated', { ...project, archived: newArchivedState });
      // Update local storage
      try {
        const cached = localStorage.getItem('uefn-cached-projects');
        if (cached) {
          const parsed = JSON.parse(cached);
          const updated = parsed.map((p: any) => p.id === project.id ? { ...p, archived: newArchivedState } : p);
          localStorage.setItem('uefn-cached-projects', JSON.stringify(updated));
        }
      } catch(err) {}
    } catch(e) {}`;

code = code.replace(handleArchiveStrOld, handleArchiveStrNew);
fs.writeFileSync('src/components/ProjectView.tsx', code);
