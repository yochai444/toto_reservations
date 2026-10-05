/**
 * Prepares the database and loads the menu seed into it.
 *
 *   npm run db:setup
 *
 * Schema: with SUPABASE_DB_URL set, applies supabase/migrations/*.sql directly. Without it, paste
 * supabase/migrations/0001_menu.sql into the Supabase SQL Editor once and run this script afterwards.
 *
 * Seed: inserts only rows that don't exist yet (by id), so owner edits are never overwritten. Uses the
 * secret key, which bypasses row-level security; it never leaves this machine.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import { menuSeed } from "../src/data/menu-seed";
import { seedRows } from "../src/lib/menu-rows";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required in .env.local");

if (process.env.SUPABASE_DB_URL) {
  const client = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const dir = join(import.meta.dirname, "..", "supabase", "migrations");
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
      await client.query(readFileSync(join(dir, file), "utf8"));
      console.log(`applied ${file}`);
    }
  } finally {
    await client.end();
  }
}

const db = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });

const probe = await db.from("categories").select("id").limit(1);
if (probe.error) {
  console.error(
    "\nThe menu tables don't exist yet.\n" +
      "Open Supabase → SQL Editor → New query, paste the contents of supabase/migrations/0001_menu.sql, click Run,\n" +
      "then run `npm run db:setup` again.\n",
  );
  process.exit(1);
}

const { categories, optionGroups, items } = seedRows(menuSeed);
const insertMissing = async (table: string, rows: object[]) => {
  const { error } = await db.from(table).upsert(rows, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw new Error(`${table}: ${error.message}`);
};
// Order matters: items reference categories and option groups.
await insertMissing("categories", categories);
await insertMissing("option_groups", optionGroups);
await insertMissing("items", items);

const count = async (table: string) => (await db.from(table).select("id", { head: true, count: "exact" })).count;
console.log(`menu in database: ${await count("categories")} categories, ${await count("option_groups")} option groups, ${await count("items")} dishes`);

const bucket = await db.storage.getBucket("menu-images");
console.log(bucket.data ? "image bucket: ready" : `image bucket missing: ${bucket.error?.message}`);
