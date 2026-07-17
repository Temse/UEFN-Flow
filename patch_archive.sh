awk '
/const handleArchive = async \(\) => \{/ {
    print "  const handleArchive = async () => {"
    print "    if (!project) return;"
    print "    const newArchivedState = !project.archived;"
    print "    setProject(prev => prev ? { ...prev, archived: newArchivedState } : prev);"
    print "    socket?.emit(\"project-updated\", { ...project, archived: newArchivedState });"
    print "    try {"
    print "      const cachedListStr = localStorage.getItem(\"uefn-cached-projects\");"
    print "      if (cachedListStr) {"
    print "        const list = JSON.parse(cachedListStr);"
    print "        const updatedList = list.map((p: any) => p.id === project.id ? { ...p, archived: newArchivedState } : p);"
    print "        localStorage.setItem(\"uefn-cached-projects\", JSON.stringify(updatedList));"
    print "      }"
    print "    } catch (e) {}"
    print "    try {"
    print "      await fetch(`/api/projects/${project.id}/archive`, {"
    print "        method: \"PUT\","
    print "        headers: { \"Content-Type\": \"application/json\" },"
    print "        body: JSON.stringify({ archived: newArchivedState })"
    print "      });"
    print "    } catch (e) {}"
    print "  };"
    skip = 1
    next
}
skip && /^  \}/ {
    skip = 0
    next
}
skip { next }
{ print }
' src/components/ProjectView.tsx > src/components/ProjectView.tsx.tmp
mv src/components/ProjectView.tsx.tmp src/components/ProjectView.tsx
