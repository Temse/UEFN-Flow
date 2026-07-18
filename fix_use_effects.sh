cat << 'INNER_EOF' > use_effects.txt
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAutoSaveToast(true);
      const timer = setTimeout(() => setShowAutoSaveToast(false), 4000);
      return () => clearTimeout(timer);
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    localStorage.setItem('uefn-lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('uefn-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('uefn-light');
    } else {
      document.documentElement.classList.remove('uefn-light');
    }
  }, [theme]);
INNER_EOF

sed -i -e '/useEffect(() => {/,/}, \[theme\]);/c\
'"$(cat use_effects.txt | sed 's/$/\\/')"'' src/components/Dashboard.tsx
sed -i -e 's/\\$//' src/components/Dashboard.tsx
