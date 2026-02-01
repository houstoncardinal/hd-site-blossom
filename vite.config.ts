import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fallbacks used when the hosting environment doesn't provide build-time env vars.
  // These are *public* values (URL + publishable/anon key) required for the browser client.
  const FALLBACK_SUPABASE_PROJECT_ID = "rkvzzzgyoulifccnfcpv";
  const FALLBACK_SUPABASE_URL = `https://${FALLBACK_SUPABASE_PROJECT_ID}.supabase.co`;
  const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdnp6emd5b3VsaWZjY25mY3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0OTgzMjUsImV4cCI6MjA4MzA3NDMyNX0.Z9-tJg0vQR--Is8nZzSj_1e_oMGBA9BfdzJ80KOtJ1Y";

  // Ensure VITE_* variables are available during build/preview even when the hosting
  // environment doesn't inject them into import.meta.env as expected.
  const env = loadEnv(mode, process.cwd(), "");

  const supabaseUrl =
    env.VITE_SUPABASE_URL ||
    env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    FALLBACK_SUPABASE_URL;

  const supabaseKey =
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    env.SUPABASE_PUBLISHABLE_KEY ||
    env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    FALLBACK_SUPABASE_PUBLISHABLE_KEY;

  const supabaseProjectId =
    env.VITE_SUPABASE_PROJECT_ID ||
    process.env.VITE_SUPABASE_PROJECT_ID ||
    FALLBACK_SUPABASE_PROJECT_ID;

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
    // Inline these so the generated Supabase client can always initialize.
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
          drop_console: mode === "production",
          drop_debugger: true,
        },
      },
      // Manual chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            animation: ["framer-motion"],
            ui: ["@radix-ui/react-accordion", "@radix-ui/react-dialog", "@radix-ui/react-tabs"],
            forms: ["react-hook-form", "@hookform/resolvers", "zod"],
            query: ["@tanstack/react-query"],
            supabase: ["@supabase/supabase-js"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: mode === "development",
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom", "framer-motion"],
    },
  };
});
