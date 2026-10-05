"use client";

import { useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { MENU_IMAGES_BUCKET } from "@/lib/supabase/config";

/** Downscale to max 1600px and re-encode as WebP so phone photos upload fast and load fast. */
async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode failed"))), "image/webp", 0.82));
}

/** Uploads straight from the browser to Supabase Storage (admins only, enforced by storage policies). */
export function ImageField({ name, defaultValue, folder, error }: { name: string; defaultValue: string; folder: string; error?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [status, setStatus] = useState<string>();
  const input = useRef<HTMLInputElement>(null);

  async function onFile(file: File) {
    setStatus("מעלים תמונה…");
    try {
      const blob = await compress(file);
      const path = `${folder}/${crypto.randomUUID()}.webp`;
      const db = createBrowserSupabase();
      const { error } = await db.storage.from(MENU_IMAGES_BUCKET).upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
      if (error) throw error;
      setUrl(db.storage.from(MENU_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl);
      setStatus("התמונה הועלתה. לשמירה לחצו על שמירה.");
    } catch (e) {
      setStatus(`ההעלאה נכשלה: ${e instanceof Error ? e.message : "שגיאה"}`);
    }
  }

  return (
    <div className="grid gap-2">
      <span className="font-extrabold text-berry">תמונה</span>
      <div className="flex flex-wrap items-center gap-4">
        <div className="aspect-[4/3] w-56 overflow-hidden rounded-[18px] bg-blush">
          {/* eslint-disable-next-line @next/next/no-img-element -- preview of an arbitrary just-uploaded URL */}
          {url ? <img src={url} alt="" className="size-full object-cover" /> : <div className="grid size-full place-items-center text-muted">אין תמונה</div>}
        </div>
        <div className="grid gap-2">
          <button type="button" onClick={() => input.current?.click()} className="rounded-full bg-pink-btn px-4 py-2 font-extrabold text-white">
            {url ? "החלפת תמונה" : "העלאת תמונה"}
          </button>
          <span className="text-sm text-muted">אפשר לצלם ישר מהטלפון. מומלץ צילום לרוחב.</span>
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onFile(f);
          e.target.value = "";
        }}
      />
      <input type="hidden" name={name} value={url} />
      {status && <span className="text-sm font-bold text-berry">{status}</span>}
      {error && <span className="text-sm font-bold text-[#B03224]">{error}</span>}
    </div>
  );
}
