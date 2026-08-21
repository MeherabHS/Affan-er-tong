import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Admin Supabase client using SUPABASE_SERVICE_ROLE_KEY.
 * MUST NEVER BE EXPOSED OR CALLED IN CLIENT COMPONENTS.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("SECURITY VIOLATION: Admin Supabase Client cannot be initialized in the browser!");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
