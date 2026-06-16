import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function createSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jwsdquwkrkonkqghyfns.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_9z5AeU_t109CUZ4047kyrg_UIijpL6C";

  return createClient(url, key);
}

export const supabase = createSupabaseClient();

export type { Message } from "@/lib/types";
