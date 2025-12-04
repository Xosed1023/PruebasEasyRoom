import { defineConfig, normalizePath } from "vite"
import react from "@vitejs/plugin-react-swc"
import { VitePWA } from "vite-plugin-pwa"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import { createRequire } from "module"
import { viteStaticCopy } from "vite-plugin-static-copy"

const require = createRequire(import.meta.url)

const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"))
const cMapsDir = normalizePath(path.join(pdfjsDistPath, "cmaps"))

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        viteStaticCopy({
            targets: [
                {
                    src: cMapsDir,
                    dest: "",
                },
            ],
        }),
        VitePWA({
            devOptions: {
                enabled: true,
            },
            registerType: "autoUpdate",
            workbox: {
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
            },
            includeAssets: ["favicon.svg", "robots.txt"],
            manifest: {
                name: "Easyroom",
                short_name: "Easyroom",
                display: "standalone",
                description: "Easyroom PWA",
                theme_color: "#000000",
                background_color: "#ffffff",
                icons: [
                    {
                        src: "logo/App_icon_192.webp",
                        sizes: "192x192 512x512",
                        type: "image/webp",
                    },
                    {
                        src: "logo/App_icon_192.webp",
                        type: "image/webp",
                        sizes: "192x192",
                    },
                    {
                        src: "logo/App_icon_512.webp",
                        type: "image/webp",
                        sizes: "512x512",
                    },
                    {
                        src: "logo/App_icon_512.svg",
                        type: "image/svg",
                        sizes: "512x512",
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            src: "/src",
            components: "/src/components",
            assets: "/src/assets",
            hooks: "/src/hooks",
        },
    },
    server: {
        host: true,
    },
})
