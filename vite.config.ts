// vite.config.js
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://api.zacht.tech",
        changeOrigin: true,
        secure: false, // Tambahkan ini jika diperlukan
        rewrite: (path) => path.replace(/^\/api/, ""), // Nonaktifkan fungsi rewrite
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
