import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Deve corresponder EXATAMENTE ao nome do repositório
  build: {
    chunkSizeWarningLimit: 1500,
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html", // Mantenha como index.html
      },
    },
    assetsDir: "assets",
  },
});
