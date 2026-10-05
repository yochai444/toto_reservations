/**
 * Applies supabase/migrations/*.sql and loads the menu seed into empty tables.
 * Existing rows are never overwritten, so it's safe to re-run after the owner has edited the menu.
 *
 *   npm run db:setup          (reads SUPABASE_DB_URL from .env.local)
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";
import { menuSeed } from "../src/data/menu-seed";
import { seedRows } from "../src/lib/menu-rows";

const url = process.env.SUPABASE_DB_URL;
if (!url) throw new Error("SUPABASE_DB_URL is missing in .env.local");

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

try {
  const dir = join(import.meta.dirname, "..", "supabase", "migrations");
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    await client.query(readFileSync(join(dir, file), "utf8"));
    console.log(`applied ${file}`);
  }

  const { categories, optionGroups, items } = seedRows(menuSeed);
  await client.query("begin");
  for (const c of categories) {
    await client.query(
      "insert into public.categories (id, name, note, image, sort, visible) values ($1,$2,$3,$4,$5,$6) on conflict (id) do nothing",
      [c.id, c.name, c.note, c.image, c.sort, c.visible],
    );
  }
  for (const g of optionGroups) {
    await client.query(
      "insert into public.option_groups (id, legend, cta, min, max, choices) values ($1,$2,$3,$4,$5,$6) on conflict (id) do nothing",
      [g.id, g.legend, g.cta, g.min, g.max, JSON.stringify(g.choices)],
    );
  }
  for (const it of items) {
    await client.query(
      `insert into public.items (id, category_id, name, price, image, unit, description, option_group_id, badge, featured, available, sort)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) on conflict (id) do nothing`,
      [it.id, it.category_id, it.name, it.price, it.image, it.unit, it.description, it.option_group_id, it.badge, it.featured, it.available, it.sort],
    );
  }
  await client.query("commit");

  const counts = await client.query(
    "select (select count(*) from public.categories) c, (select count(*) from public.option_groups) g, (select count(*) from public.items) i",
  );
  const { c, g, i } = counts.rows[0];
  console.log(`menu in database: ${c} categories, ${g} option groups, ${i} dishes`);
} catch (err) {
  await client.query("rollback").catch(() => {});
  throw err;
} finally {
  await client.end();
}
