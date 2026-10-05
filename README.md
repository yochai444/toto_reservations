# TOTO Catering — ordering site

Customers browse the TOTO dairy catering menu, build an order, and send it. The order reaches the owner on WhatsApp through a bot (WhatsApp Cloud API); the deal is closed by the owner personally. No payments and no order database.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Settings go in `.env.local` (template: `.env.example`). Without Supabase values the site runs on the seed menu; without WhatsApp values orders are printed to the terminal instead of sent.

### One-time database setup

```bash
npm run db:setup                         # creates tables, security rules, image bucket; loads the menu
npm run admin:create -- owner@example.com # owner login for /admin (prints a temporary password)
```

`db:setup` is safe to re-run: it never overwrites dishes the owner has edited.

Order pricing/validation sanity checks: `npm run check:order`

## Where things live

| Path | What |
|---|---|
| `src/data/menu-seed.ts` | Initial menu (from the 2026 PDF): loaded into Supabase by `db:setup`, and the fallback when Supabase isn't configured |
| `supabase/migrations/` | Database schema + row-level security: public reads, only admins write |
| `src/lib/menu.ts` | `getMenu()`: cached public menu; admin saves refresh it immediately |
| `src/app/admin/` | Owner's admin area: dishes, categories, fillings/flavors, photo upload |
| `src/app/admin/actions.ts` | Admin server actions; each one re-checks admin rights |
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
2. ✅ Supabase: menu in a database + image storage, admin area for the owner to edit the menu (needs project credentials)
3. WhatsApp bot: Meta Business account, bot phone number, approved templates, live sending
4. Deploy (Netlify / Vercel), domain, real dish photos
