# TOTO Catering — ordering site

Customers browse the TOTO dairy catering menu, build an order, and send it. The order reaches the owner by email, and the customer gets a WhatsApp confirmation from the business number (058-7160723, via WhatsApp coexistence); the deal is closed by the owner personally. No payments and no order database.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Settings go in `.env.local` (template: `.env.example`). Without Supabase values the site runs on the seed menu; without Resend / WhatsApp values the order email and the customer confirmation are printed to the terminal instead of sent.

### One-time database setup

```bash
# 1. Supabase → SQL Editor: run supabase/migrations/0001_menu.sql (tables, security rules, image bucket)
npm run db:setup                         # 2. loads the menu (also applies migrations if SUPABASE_DB_URL is set)
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
| `src/lib/order.ts` | Order schema, server-side re-pricing, order message text |
| `src/lib/notify.ts` | Delivers an order: email to the owner, then WhatsApp confirmation to the customer |
| `src/lib/email.ts` | New-order email to the owner (Resend), dry-run without credentials |
| `src/lib/whatsapp.ts` | WhatsApp customer confirmation (template message), dry-run without credentials |
| `src/app/actions/submit-order.ts` | Server Action called by the checkout form; throttles bursts per IP |
| `src/components/store.tsx` | Client state: cart (saved in localStorage), dish sheet, cart drawer, search, toast |
| `design/prototype/` | Approved clickable design prototype |
| `public/img/` | Logo, crown, pattern, kashrut seals (from TOTO's PDF) and temporary stock food photos |

The browser only sends dish ids, picks and quantities. Prices are always recomputed on the server.

## Roadmap

1. ✅ Customer site: home, menu, dish options, cart, checkout (orders logged in dry run)
2. ✅ Supabase: menu in a database + image storage, admin area for the owner to edit the menu (needs project credentials)
3. Order delivery: email to the owner (Resend) ← in progress; then the customer confirmation from 058-7160723 via coexistence (provider: YCloud) with an approved `order_received` template
4. ✅ Deployed on Netlify (auto-deploys from `main`): https://dazzling-dasik-62f85d.netlify.app, hidden from search engines until launch
5. Before launch: order email live, real dish photos, domain, `SITE_INDEXING=on`
