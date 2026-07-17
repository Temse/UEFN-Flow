awk '
/fetch\('"'"'\/api\/templates'"'"'\)/ {
    print "    fetch(\"/api/templates\")"
    print "      .then(res => {"
    print "         if (!res.ok) throw new Error(\"Backend error\");"
    print "         return res.json();"
    print "      })"
    print "      .then(data => setCustomTemplates(data))"
    print "      .catch(err => {"
    print "         console.error(\"Fallback to local templates:\", err);"
    print "         const cached = localStorage.getItem(\"uefn-cached-templates\");"
    print "         if (cached) setCustomTemplates(JSON.parse(cached));"
    print "         else setCustomTemplates([]);"
    print "      });"
    skip = 1
    next
}
skip && /\.catch\(err => console\.error\(err\)\);/ { skip = 0; next }
skip { next }

/await fetch\(\`\/api\/templates\/\$\{id\}\`, \{ method: '"'"'DELETE'"'"' \}\);/ {
    print "      try {"
    print "        await fetch(`/api/templates/${id}`, { method: \"DELETE\" });"
    print "      } catch(backendErr) {"
    print "        const cachedStr = localStorage.getItem(\"uefn-cached-templates\");"
    print "        if (cachedStr) {"
    print "           let cached = JSON.parse(cachedStr);"
    print "           cached = cached.filter((t: any) => t.id !== id);"
    print "           localStorage.setItem(\"uefn-cached-templates\", JSON.stringify(cached));"
    print "        }"
    print "      }"
    next
}
{ print }
' src/components/OnboardingModal.tsx > src/components/OnboardingModal.tsx.tmp
mv src/components/OnboardingModal.tsx.tmp src/components/OnboardingModal.tsx
