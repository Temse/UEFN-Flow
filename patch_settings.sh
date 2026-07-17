awk '
/const handleSaveTemplate =/ {
    print "  const handleSaveTemplate = async () => {"
    print "    setIsSavingTemplate(true);"
    print "    try {"
    print "      const newTemplate = {"
    print "        id: nanoid(),"
    print "        name: `${project.name} (${lang === \"en\" ? \"Template\" : \"Vorlage\"})`,"
    print "        columns: project.columns,"
    print "        tasks: project.tasks,"
    print "        icon: selectedIcon"
    print "      };"
    print "      try {"
    print "        const response = await fetch(\"/api/templates\", {"
    print "          method: \"POST\","
    print "          headers: { \"Content-Type\": \"application/json\" },"
    print "          body: JSON.stringify(newTemplate)"
    print "        });"
    print "        if (!response.ok) throw new Error(\"Backend error\");"
    print "      } catch (backendErr) {"
    print "        console.warn(\"Template backend save failed, using local fallback\", backendErr);"
    print "        const currentTemplatesStr = localStorage.getItem(\"uefn-cached-templates\");"
    print "        const currentTemplates = currentTemplatesStr ? JSON.parse(currentTemplatesStr) : [];"
    print "        currentTemplates.push(newTemplate);"
    print "        localStorage.setItem(\"uefn-cached-templates\", JSON.stringify(currentTemplates));"
    print "      }"
    print "      alert(lang === \"en\" ? \"Template successfully saved!\" : \"Vorlage erfolgreich gespeichert!\");"
    print "    } catch (err) {"
    print "      console.error(err);"
    print "    } finally {"
    print "      setIsSavingTemplate(false);"
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
' src/components/ProjectSettingsModal.tsx > src/components/ProjectSettingsModal.tsx.tmp
mv src/components/ProjectSettingsModal.tsx.tmp src/components/ProjectSettingsModal.tsx
