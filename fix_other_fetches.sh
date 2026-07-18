sed -i -e '/fetch("\/api\/templates")/,+17c\
    try {\
      const cached = localStorage.getItem("uefn-custom-templates");\
      if (cached) setCustomTemplates(JSON.parse(cached));\
    } catch(e) {}\
' src/components/OnboardingModal.tsx

sed -i -e '/await fetch(`\/api\/templates\/${id}`, { method: "DELETE" });/d' src/components/OnboardingModal.tsx

cat << 'INNER_EOF' > settings_fetch.txt
        const cached = localStorage.getItem("uefn-custom-templates");
        const existing = cached ? JSON.parse(cached) : [];
        const newTemplates = [...existing, payload];
        localStorage.setItem("uefn-custom-templates", JSON.stringify(newTemplates));
INNER_EOF

sed -i -e '/const response = await fetch("\/api\/templates", {/,+5c\
'"$(cat settings_fetch.txt | sed 's/$/\\/')"'' src/components/ProjectSettingsModal.tsx
sed -i -e 's/\\$//' src/components/ProjectSettingsModal.tsx
