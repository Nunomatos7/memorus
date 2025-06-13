import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://api.memor-us.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // console.log and debugger remove | comment/uncomment
  esbuild: {
    drop: ["console", "debugger"],
  },
});
