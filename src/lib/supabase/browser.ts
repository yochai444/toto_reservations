import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

export const createBrowserSupabase = () => createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
