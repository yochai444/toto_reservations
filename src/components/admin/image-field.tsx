"use client";

import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { styled } from "@mui/material/styles";
import { useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { MENU_IMAGES_BUCKET } from "@/lib/supabase/config";
import { brand } from "@/theme/theme";

const Preview = styled("div")({
  aspectRatio: "4 / 3",
  width: 224,
  overflow: "hidden",
  borderRadius: 18,
  background: brand.blush,
  "& img": { width: "100%", height: "100%", objectFit: "cover" },
  "& .none": { display: "grid", height: "100%", placeItems: "center", color: brand.muted },
});

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
    <div style={{ display: "grid", gap: 8 }}>
      <FormLabel component="span">תמונה</FormLabel>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
        <Preview>
          {/* eslint-disable-next-line @next/next/no-img-element -- preview of an arbitrary just-uploaded URL */}
          {url ? <img src={url} alt="" /> : <div className="none">אין תמונה</div>}
        </Preview>
        <div style={{ display: "grid", gap: 8, justifyItems: "start" }}>
          <Button size="small" onClick={() => input.current?.click()}>
            {url ? "החלפת תמונה" : "העלאת תמונה"}
          </Button>
          <FormHelperText>אפשר לצלם ישר מהטלפון. מומלץ צילום לרוחב.</FormHelperText>
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onFile(f);
          e.target.value = "";
        }}
      />
      <input type="hidden" name={name} value={url} />
      {status && <FormHelperText sx={{ fontWeight: 700, color: brand.berry }}>{status}</FormHelperText>}
      {error && <FormHelperText error>{error}</FormHelperText>}
    </div>
  );
}
