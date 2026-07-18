sed -i -e '/await fetch(`\/api\/projects\/${project.id}\/archive`/,+4d' src/components/ProjectView.tsx
sed -i -e '/fetch(`\/api\/columns\/${col.id}`/,+4d' src/components/ProjectView.tsx
sed -i -e '/await fetch(`\/api\/projects\/${projectId}\/logs`/,+4d' src/components/ProjectView.tsx
sed -i -e '/const res = await fetch(`\/api\/tasks`/,+5d' src/components/ProjectView.tsx
sed -i -e '/await fetch(`\/api\/tasks\/${taskId}`/d' src/components/ProjectView.tsx
sed -i -e '/await fetch(`\/api\/columns`, {/,+4d' src/components/ProjectView.tsx
sed -i -e '/await fetch(`\/api\/columns\/${columnId}`, {/,+4d' src/components/ProjectView.tsx
sed -i -e '/await fetch(`\/api\/columns\/${columnId}`, { method/d' src/components/ProjectView.tsx
