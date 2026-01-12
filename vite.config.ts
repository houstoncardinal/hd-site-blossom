import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Ensure VITE_* vars are available during build and get inlined.
  // In Lovable Cloud, secrets are typically provided via process.env (not local .env files).
  const fileEnv = loadEnv(mode, process.cwd(), "");

  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? fileEnv.VITE_SUPABASE_URL ?? "";
  const supabaseKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? fileEnv.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";
  const supabaseProjectId =
    process.env.VITE_SUPABASE_PROJECT_ID ?? fileEnv.VITE_SUPABASE_PROJECT_ID ?? "";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Hard-define the env values so the client bundle never sees `undefined`.
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(supabaseKey),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(supabaseProjectId),
    },
    build: {
      // Optimize bundle size
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: mode === "production", // Remove console.logs in production
          drop_debugger: true,
        },
      },
      // Manual chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            animation: ["framer-motion"],
            ui: ["@radix-ui/react-accordion", "@radix-ui/react-dialog", "@radix-ui/react-tabs"],
            forms: ["react-hook-form", "@hookform/resolvers", "zod"],
            query: ["@tanstack/react-query"],
            supabase: ["@supabase/supabase-js"],
          },
        },
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
      // Enable source maps in development only
      sourcemap: mode === "development",
    },
    // Optimize dependencies pre-bundling
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom", "framer-motion"],
    },
  };
});

