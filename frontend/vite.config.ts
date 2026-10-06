import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "node:path";
import { defineConfig } from "vite";

const cesiumBaseUrl = "cesiumStatic";

export default defineConfig({
  define: {
    CESIUM_BASE_URL: JSON.stringify(`/${cesiumBaseUrl}`),
  },

  plugins: [react(), tailwindcss(), tanstackRouter()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@zip.js/zip.js/lib/zip-no-worker.js": path.resolve(
        __dirname,
        "node_modules/@zip.js/zip.js/dist/zip-fs.js",
      ),
    },
  },
});
