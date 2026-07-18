cat << 'INNER_EOF' > project_fetch.txt
    // Fetch initial data completely locally
    setError(null);
    try {
      const cached = localStorage.getItem(`uefn-cached-project-${projectId}`);
      if (cached) {
        const data = JSON.parse(cached);
        data.tasks = deduplicateById(data.tasks || []);
        data.columns = deduplicateById(data.columns || []);
        setProject(data);
      } else {
        throw new Error(lang === 'en' ? 'Project could not be loaded' : 'Projekt konnte nicht geladen werden');
      }
    } catch (e) {
      console.error('Error parsing cached project:', e);
      setError((e as Error).message);
    }
    setIsLoading(false);

    // No WebSocket Connection for fully local mode
    return () => {};
INNER_EOF

sed -i -e '/\/\/ Fetch initial data/,/return () => {/c\
'"$(cat project_fetch.txt | sed 's/$/\\/')"'' src/components/ProjectView.tsx
sed -i -e 's/\\$//' src/components/ProjectView.tsx
