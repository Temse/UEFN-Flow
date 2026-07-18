cat << 'INNER_EOF' > onboarding_delete.txt
  const fetchTemplates = () => {
    try {
      const cached = localStorage.getItem("uefn-custom-templates");
      if (cached) setCustomTemplates(JSON.parse(cached));
    } catch(e) {}
  };

  const deleteCustomTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const cachedStr = localStorage.getItem("uefn-custom-templates");
      if (cachedStr) {
         let cached = JSON.parse(cachedStr);
         cached = cached.filter((t: any) => t.id !== id);
         localStorage.setItem("uefn-custom-templates", JSON.stringify(cached));
      }
      fetchTemplates();
      if (selectedCustomId === id) setSelectedCustomId(null);
    } catch (err) {
      console.error(err);
    }
  };
INNER_EOF

sed -i -e '/const fetchTemplates = () => {/,/  const templates = \[/!b; /  const templates = \[/!d' src/components/OnboardingModal.tsx
sed -i -e '/const templates = \[/i \
'"$(cat onboarding_delete.txt | sed 's/$/\\/')"'' src/components/OnboardingModal.tsx
sed -i -e 's/\\$//' src/components/OnboardingModal.tsx
