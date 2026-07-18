const fs = require('fs');
let file = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');

file = file.replace(/newTasks\[activeIndex\]\.columnId = newColumnId;/, "newTasks[activeIndex] = { ...newTasks[activeIndex], columnId: newColumnId };");
file = file.replace(/newTasks\[activeIndex\]\.columnId = overId;/, "newTasks[activeIndex] = { ...newTasks[activeIndex], columnId: overId };");

fs.writeFileSync('src/components/ProjectView.tsx', file);
