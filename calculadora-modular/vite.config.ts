import { defineConfig } from "vite";

const port = Number(process.env.PORT) || 3000;

export default defineConfig({
  base: "./",
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
