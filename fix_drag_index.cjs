const fs = require('fs');
let file = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

// In handleDragOver cross-column movement
file = file.replace(/const overIndex = project\.tasks!\.findIndex\(t => t\.id === overId\);\n\s*const newColumnId = project\.tasks!\[overIndex\]\.columnId;/, 
`const overIndex = project.tasks!.findIndex(t => t.id === overId);
      if (activeIndex === -1 || overIndex === -1) return;
      const newColumnId = project.tasks![overIndex].columnId;`);

// In handleDragEnd reorder tasks in same column
file = file.replace(/const overIndex = project\.tasks!\.findIndex\(t => t\.id === overId\);\n\s*if \(project\.tasks!\[activeIndex\]\.columnId === project\.tasks!\[overIndex\]\.columnId\)/,
`const overIndex = project.tasks!.findIndex(t => t.id === overId);
      if (activeIndex === -1 || overIndex === -1) return;
      if (project.tasks![activeIndex].columnId === project.tasks![overIndex].columnId)`);

fs.writeFileSync('src/components/ProjectView.tsx', file);
