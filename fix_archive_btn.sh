sed -i -e '/<button /,+0{
    /onClick={(e) => onArchive(project.id, e)}/!b
}' src/components/Dashboard.tsx
