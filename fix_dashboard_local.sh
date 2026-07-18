cat << 'INNER_EOF' > dashboard_local_1.txt
  const fetchProjects = async () => {
    try {
      const cached = localStorage.getItem('uefn-cached-projects');
      if (cached) {
        setProjects(deduplicateById(JSON.parse(cached)));
      } else {
        setProjects([]);
      }
    } catch (cacheErr) {
      console.error('Error loading cached projects:', cacheErr);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };
INNER_EOF
sed -i -e '/const fetchProjects = async () => {/,/setLoading(false);/c\
'"$(cat dashboard_local_1.txt | sed 's/$/\\/')"'' src/components/Dashboard.tsx
sed -i -e 's/\\$//' src/components/Dashboard.tsx
