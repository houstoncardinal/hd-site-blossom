import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { supabase as generatedClient } from "@/integrations/supabase/client";

// NOTE:
// This project normally injects these values via the hosting environment.
// However, preview environments can occasionally miss that injection and the
// auto-generated client falls back to placeholder values.
//
// These are PUBLIC values (URL + publishable/anon key) required for browser access.
const FALLBACK_SUPABASE_URL = "https://rkvzzzgyoulifccnfcpv.supabase.co";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdnp6emd5b3VsaWZjY25mY3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0OTgzMjUsImV4cCI6MjA4MzA3NDMyNX0.Z9-tJg0vQR--Is8nZzSj_1e_oMGBA9BfdzJ80KOtJ1Y";

const isPlaceholderClient = (client: SupabaseClient) => {
  // SupabaseClient exposes these on the instance.
  const url = (client as unknown as { supabaseUrl?: string }).supabaseUrl;
  const key = (client as unknown as { supabaseKey?: string }).supabaseKey;
  return (
    !url ||
    !key ||
    url.includes("placeholder.supabase.co") ||
    key === "placeholder-key"
  );
};

let cachedClient: SupabaseClient<Database> | null = null;

export const getPublicSupabaseClient = (): SupabaseClient<Database> => {
  if (cachedClient) return cachedClient;

  if (!isPlaceholderClient(generatedClient)) {
    cachedClient = generatedClient;
    return cachedClient;
  }

  // Fallback client (used only when preview env injection fails)
  cachedClient = createClient<Database>(
    FALLBACK_SUPABASE_URL,
    FALLBACK_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );

  return cachedClient;
};
