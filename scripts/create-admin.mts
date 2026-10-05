/**
 * Creates (or re-uses) a login for the menu admin and grants it admin rights.
 *
 *   npm run admin:create -- owner@example.com
 *
 * Prints a one-time password for a new user; they can change it later from Supabase's reset flow.
 */
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !email.includes("@")) throw new Error("Usage: npm run admin:create -- owner@example.com");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required in .env.local");

const db = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });

let password: string | undefined;
let userId: string | undefined;

for (let page = 1; !userId; page++) {
  const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
  if (error) throw error;
  userId = data.users.find((u) => u.email?.toLowerCase() === email)?.id;
  if (data.users.length < 200) break;
}

if (!userId) {
  password = randomBytes(9).toString("base64url");
  const { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  userId = data.user.id;
}

const { error } = await db.from("admins").upsert({ user_id: userId, email });
if (error) throw error;

console.log(`admin ready: ${email}`);
if (password) console.log(`temporary password: ${password}`);
else console.log("existing user kept their current password");
