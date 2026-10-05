export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** False until the Supabase project values are in .env.local; the site then runs on the seed menu. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const MENU_IMAGES_BUCKET = "menu-images";
