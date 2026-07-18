sed -i -e 's/onClose={() => setShowOnboarding(false)}/onCancel={() => setShowOnboarding(false)}/' src/components/Dashboard.tsx
sed -i -e 's/onCreateProject={handleCreateProject}/onComplete={handleCreateProject}/' src/components/Dashboard.tsx
sed -i -e 's/<ConfirmModal/<ConfirmModal isOpen={true}/' src/components/Dashboard.tsx
sed -i -e 's/currentLang={lang}/isOpen={true} defaultLang={lang}/' src/components/Dashboard.tsx

# Add confirmDeleteProject
sed -i -e '/const deleteProject = async (/i \
  const confirmDeleteProject = async () => {\
    if (!projectToDelete) return;\
    const updatedProjects = projects.filter(p => p.id !== projectToDelete);\
    setProjects(updatedProjects);\
    localStorage.setItem("uefn-cached-projects", JSON.stringify(deduplicateById(updatedProjects)));\
    localStorage.removeItem(`uefn-cached-project-${projectToDelete}`);\
    setProjectToDelete(null);\
  };\
' src/components/Dashboard.tsx
