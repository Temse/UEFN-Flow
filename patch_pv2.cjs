const fs = require('fs');

let code = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

const catchBlock = `.catch(err => {
        console.error('Error fetching project:', err);
        setError(err.message);
        setIsLoading(false);
      });`;

const newCatchBlock = `.catch(err => {
        console.error('Error fetching project from backend:', err);
        // Try fallback to local storage
        try {
          const cached = localStorage.getItem(\`uefn-cached-project-\${projectId}\`);
          if (cached) {
            const data = JSON.parse(cached);
            setProject(data);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing cached project:', e);
        }
        setError(err.message);
        setIsLoading(false);
      });`;

code = code.replace(catchBlock, newCatchBlock);

fs.writeFileSync('src/components/ProjectView.tsx', code);
