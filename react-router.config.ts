import type { Config } from "@react-router/dev/config";

export default {
  // Enable SPA mode for Cloudflare Pages
  ssr: false,
  // Build for static hosting
  buildDirectory: "build",
} satisfies Config;
