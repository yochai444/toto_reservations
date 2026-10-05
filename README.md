# TOTO Catering — ordering site

Customers browse the TOTO dairy catering menu, build an order, and send it. The order reaches the owner on WhatsApp through a bot (WhatsApp Cloud API); the deal is closed by the owner personally. No payments and no order database.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Without WhatsApp credentials in `.env.local`, submitted orders are printed to the terminal instead of sent (see `.env.example`).

Order pricing/validation sanity checks: `npx tsx scripts/check-order.ts`

## Where things live

| Path | What |
|---|---|
| `src/data/menu-seed.ts` | The menu: categories, dishes, prices, filling/flavor options (from the 2026 PDF) |
| `src/lib/menu.ts` | `getMenu()`: the only place that reads the menu (Supabase will plug in here) |
| `src/lib/pricing.ts` | Tray price incl. extras (salmon +45 per tray), pick validation. Shared by browser and server |
| `src/lib/order.ts` | Order schema, server-side re-pricing, WhatsApp message text |
| `src/lib/whatsapp.ts` | WhatsApp Cloud API client (template messages), dry-run without credentials |
| `src/app/actions/submit-order.ts` | Server Action called by the checkout form; throttles bursts per IP |
| `src/components/store.tsx` | Client state: cart (saved in localStorage), dish sheet, cart drawer, search, toast |
| `design/prototype/` | Approved clickable design prototype |
| `public/img/` | Logo, crown, pattern, kashrut seals (from TOTO's PDF) and temporary stock food photos |

The browser only sends dish ids, picks and quantities. Prices are always recomputed on the server.

## Roadmap

1. ✅ Customer site: home, menu, dish options, cart, checkout (orders logged in dry run)
2. Supabase: menu in a database + image storage, admin area for the owner to edit the menu
3. WhatsApp bot: Meta Business account, bot phone number, approved templates, live sending
4. Deploy (Netlify / Vercel), domain, real dish photos
