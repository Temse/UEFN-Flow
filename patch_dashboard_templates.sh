awk '
/const tRes = await fetch\('"'"'\/api\/templates'"'"'\);/ {
    print "        let templates = [];"
    print "        try {"
    print "          const tRes = await fetch(\"/api/templates\");"
    print "          if (tRes.ok) templates = await tRes.json();"
    print "          else throw new Error(\"Fetch templates failed\");"
    print "        } catch(e) {"
    print "          const cached = localStorage.getItem(\"uefn-cached-templates\");"
    print "          if (cached) templates = JSON.parse(cached);"
    print "        }"
    skip = 1
    next
}
skip && /const templates = await tRes.json\(\);/ { skip = 0; next }
skip { next }
{ print }
' src/components/Dashboard.tsx > src/components/Dashboard.tsx.tmp
mv src/components/Dashboard.tsx.tmp src/components/Dashboard.tsx
