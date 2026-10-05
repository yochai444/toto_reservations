import "server-only";
import { redirect } from "next/navigation";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";

/**
 * Verifies the request comes from a signed-in admin. Call at the top of every admin page and admin action:
 * server actions are reachable by direct POST, so the page check alone is not enough.
 */
export async function requireAdmin() {
  if (!supabaseConfigured) redirect("/admin/login");
  const db = await createSessionClient();
  const { data } = await db.auth.getUser();
  if (!data.user) redirect("/admin/login");
  const { data: row } = await db.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!row) redirect("/admin/login?denied=1");
  return { db, user: data.user };
}
