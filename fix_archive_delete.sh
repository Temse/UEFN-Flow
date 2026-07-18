cat << 'INNER_EOF' > archive_delete.txt
  const archiveProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    const newArchivedState = !project.archived;
    const updatedProjects = projects.map(p => p.id === id ? { ...p, archived: newArchivedState } : p);
    setProjects(updatedProjects);
    localStorage.setItem("uefn-cached-projects", JSON.stringify(deduplicateById(updatedProjects)));
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectToDelete(id);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    const id = projectToDelete;
    
    // Always update client-side immediately
    setProjects(prev => prev.filter(p => p.id !== id));
    
    try {
      localStorage.removeItem(`uefn-cached-project-${id}`);
      localStorage.removeItem(`uefn-tasks-sync-${id}`);
      localStorage.removeItem(`uefn-show-notes-${id}`);
      
      const cachedListStr = localStorage.getItem('uefn-cached-projects');
      if (cachedListStr) {
        const list = JSON.parse(cachedListStr) as Project[];
        const updatedList = list.filter(p => p.id !== id);
        localStorage.setItem('uefn-cached-projects', JSON.stringify(updatedList));
      }
    } catch (e) {
      console.error('Error cleaning up local storage on delete:', e);
    } finally {
      setProjectToDelete(null);
    }
  };
INNER_EOF

sed -i -e '/const archiveProject = async (/,/setProjectToDelete(null);/!b; /setProjectToDelete(null);/!d' src/components/Dashboard.tsx
sed -i -e '/setProjectToDelete(null);/i \
'"$(cat archive_delete.txt | sed 's/$/\\/')"'' src/components/Dashboard.tsx
sed -i -e '/setProjectToDelete(null);/d' src/components/Dashboard.tsx
sed -i -e '/^    }/d' src/components/Dashboard.tsx
