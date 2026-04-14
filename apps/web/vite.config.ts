import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_PROXY_TARGET || "http://localhost:8081";

  return {
    // @tailwindcss/vite resuelve @import con condición "style" y falla con el exports de @heroui/styles
    resolve: {
      alias: {
        "@heroui/styles/css": path.resolve(
          __dirname,
          "node_modules/@heroui/styles/dist/index.css"
        ),
      },
    },
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api/cards": {
          target: "http://localhost:4009",
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api\/cards/, ""),
        },
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
