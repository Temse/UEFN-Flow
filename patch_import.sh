awk '
/const handleImportFile =/ {
    print "  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {"
    print "    const file = e.target.files?.[0];"
    print "    if (!file) return;"
    print "    try {"
    print "      const text = await file.text();"
    print "      const jsonData = JSON.parse(text);"
    print "      let importedProjects = [];"
    print "      if (Array.isArray(jsonData)) importedProjects = jsonData;"
    print "      else if (jsonData.projects) importedProjects = jsonData.projects;"
    print "      else throw new Error(\"Invalid JSON format\");"
    print "      try {"
    print "        const res = await fetch(\"/api/backup/import\", {"
    print "          method: \"POST\","
    print "          headers: { \"Content-Type\": \"application/json\" },"
    print "          body: JSON.stringify(jsonData)"
    print "        });"
    print "        if (!res.ok) throw new Error(\"Failed backend import\");"
    print "      } catch (backendErr) {"
    print "        console.warn(\"Backend import failed, using local storage fallback:\", backendErr);"
    print "        const currentListStr = localStorage.getItem(\"uefn-cached-projects\");"
    print "        let currentList = currentListStr ? JSON.parse(currentListStr) : [];"
    print "        const combined = deduplicateById([...currentList, ...importedProjects]);"
    print "        localStorage.setItem(\"uefn-cached-projects\", JSON.stringify(combined));"
    print "        importedProjects.forEach((p: any) => {"
    print "          localStorage.setItem(`uefn-cached-project-${p.id}`, JSON.stringify(p));"
    print "          if (p.tasks) localStorage.setItem(`uefn-tasks-sync-${p.id}`, JSON.stringify(p.tasks));"
    print "        });"
    print "      }"
    print "      alert(lang === \"en\" ? \"Projects successfully imported!\" : \"Projekte erfolgreich importiert!\");"
    print "      fetchProjects();"
    print "      setLastSaveTime(new Date().toLocaleTimeString());"
    print "    } catch (err) {"
    print "      console.error(\"Import error:\", err);"
    print "      alert((lang === \"en\" ? \"Error importing file: \" : \"Fehler beim Importieren der Datei: \") + (err as Error).message);"
    print "    } finally {"
    print "      if (fileInputRef.current) fileInputRef.current.value = \"\";"
    print "    }"
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
' src/components/Dashboard.tsx > src/components/Dashboard.tsx.tmp
mv src/components/Dashboard.tsx.tmp src/components/Dashboard.tsx
