cat << 'INNER_EOF' > handle_create_project.txt
  const handleCreateProject = async (name: string, template: ProjectTemplate, island_code?: string, customTemplateId?: string) => {
    let columns = INITIAL_COLUMNS;
    let tasks = getTemplateTasks(template);
    
    try {
      if (customTemplateId) {
        let templates: any[] = [];
        try {
          const cached = localStorage.getItem("uefn-custom-templates");
          if (cached) templates = JSON.parse(cached);
        } catch(e) {
          console.error(e);
        }
        const custom = templates.find((t: any) => t.id === customTemplateId);
        if (custom) {
          columns = custom.columns;
          tasks = custom.tasks;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch custom template columns/tasks, using defaults:', e);
    }

    const localId = 'proj_' + Math.random().toString(36).substring(2, 11);
    const newProj: Project = {
      id: localId,
      name,
      template,
      island_code: island_code || '',
      columns,
      tasks,
      status: 'Blank',
      notes: '',
      created_at: new Date().toISOString()
    };

    try {
      localStorage.setItem(`uefn-cached-project-${localId}`, JSON.stringify(newProj));
      const updatedList = [...projects, newProj];
      setProjects(deduplicateById(updatedList));
      localStorage.setItem('uefn-cached-projects', JSON.stringify(deduplicateById(updatedList)));
      navigate(`/project/${localId}`);
    } catch (storageErr) {
      console.error('Local Storage also failed:', storageErr);
      alert(lang === 'en' ? 'Error saving project locally' : 'Fehler beim lokalen Sichern des Projekts');
    }
  };
INNER_EOF

sed -i -e '/const handleCreateProject = async (/,/const archiveProject = async (/!b; /const archiveProject = async (/!d' src/components/Dashboard.tsx
sed -i -e '/const archiveProject = async (/i \
'"$(cat handle_create_project.txt | sed 's/$/\\/')"'' src/components/Dashboard.tsx
sed -i -e 's/\\$//' src/components/Dashboard.tsx
