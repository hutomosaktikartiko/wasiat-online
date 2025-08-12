import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      buffer: "buffer",
      process: "process",
    },
  },
  optimizeDeps: {
    include: ["buffer", "process"],
  },
  ssr: {
    noExternal: ["@solana/wallet-adapter-react", "@solana/wallet-adapter-react-ui"],
  },
});
