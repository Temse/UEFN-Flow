awk '
/import {defineConfig, loadEnv} from '"'"'vite'"'"';/ {
    print "import {defineConfig, loadEnv} from \"vite\";"
    print "import { VitePWA } from \"vite-plugin-pwa\";"
    next
}
/plugins: \[react\(\), tailwindcss\(\)\],/ {
    print "    plugins: ["
    print "      react(),"
    print "      tailwindcss(),"
    print "      VitePWA({"
    print "        registerType: \"autoUpdate\","
    print "        injectRegister: \"auto\","
    print "        workbox: {"
    print "          globPatterns: [\"**/*.{js,css,html,ico,png,svg,json}\"],"
    print "          cleanupOutdatedCaches: true,"
    print "          runtimeCaching: ["
    print "            {"
    print "              urlPattern: /^https:\\/\\/fonts\\.(?:googleapis|gstatic)\\.com\\/.*/i,"
    print "              handler: \"CacheFirst\","
    print "              options: {"
    print "                cacheName: \"google-fonts\","
    print "                expiration: {"
    print "                  maxEntries: 10,"
    print "                  maxAgeSeconds: 60 * 60 * 24 * 365"
    print "                }"
    print "              }"
    print "            }"
    print "          ]"
    print "        },"
    print "        manifest: {"
    print "          name: \"UEFN Flow\","
    print "          short_name: \"UEFN Flow\","
    print "          description: \"UEFN Project Management\","
    print "          theme_color: \"#1a1a1a\","
    print "          icons: ["
    print "            {"
    print "              src: \"icon.png\","
    print "              sizes: \"192x192\","
    print "              type: \"image/png\""
    print "            }"
    print "          ]"
    print "        }"
    print "      })"
    print "    ],"
    next
}
{ print }
' vite.config.ts > vite.config.ts.tmp
mv vite.config.ts.tmp vite.config.ts
