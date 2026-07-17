awk '
/onClick=\{\(e\) => onDelete\(project\.id, e\)\}/ {
    print "            <button "
    print "              onClick={(e) => onArchive(project.id, e)}"
    print "              className=\"p-2 bg-black/60 hover:bg-emerald-500 text-ue-text rounded-lg backdrop-blur-md transition-all hover:scale-110 border border-white/10 cursor-pointer\""
    print "              title={lang === '"'"'en'"'"' ? (project.archived ? '"'"'Unarchive Project'"'"' : '"'"'Archive Project'"'"') : (project.archived ? '"'"'Projekt wiederherstellen'"'"' : '"'"'Projekt archivieren'"'"')}"
    print "            >"
    print "              <Archive size={14} />"
    print "            </button>"
    print $0
    next
}
{ print }
' src/components/Dashboard.tsx > src/components/Dashboard.tsx.tmp
mv src/components/Dashboard.tsx.tmp src/components/Dashboard.tsx
