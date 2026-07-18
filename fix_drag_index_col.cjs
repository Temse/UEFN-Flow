const fs = require('fs');
let file = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

// In handleDragOver cross-column movement
file = file.replace(/const activeIndex = project\.tasks!\.findIndex\(t => t\.id === activeId\);\n\s*if \(project\.tasks!\[activeIndex\]\.columnId !== overId\)/, 
`const activeIndex = project.tasks!.findIndex(t => t.id === activeId);
      if (activeIndex === -1) return;
      if (project.tasks![activeIndex].columnId !== overId)`);

fs.writeFileSync('src/components/ProjectView.tsx', file);
