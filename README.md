# Zaza Luxury — Store (zazaluxury.com)

Public e-commerce storefront. Reads products from the **zaza-collection** panel backend
and records sales back to it as `platform: 'Store'`.

## Stack
- **Next.js 15 (App Router)** — SSR/ISR for SEO (product pages statically generated, revalidated every 60s)
- **Stripe Checkout (hosted)** — card details never touch this server
- Cart: client-side (localStorage), no auth
- Palette: logo terracotta `#D96835` + cream

## Run locally
```bash
# 1) Panel backend (separate project) must be running:
#    cd ../zaza-collection && npm run server   (port 3002)
# 2) Store:
npm run dev                                    # port 3000
```

## Environment (`.env.local`)
| Var | Purpose |
|---|---|
| `PANEL_ORIGIN` | Panel backend origin (`http://localhost:3002` / `https://panel.zazaluxury.com`) |
| `SITE_URL` | This site's public URL (Stripe redirects + sitemap) |
| `STORE_SECRET` | Shared secret — must equal panel's `STORE_SECRET` |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` | Stripe API keys |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature secret (`whsec_...`) |
| `STORE_DEV_MOCK_CHECKOUT` | `1` = simulate payment locally when Stripe keys are absent (**never in prod**) |

## Payment flow
1. `POST /api/checkout` — re-reads each product fresh from the panel (never trusts client prices), creates a Stripe Checkout Session, returns hosted URL.
2. Customer pays on Stripe's page.
3. Stripe calls `POST /api/webhook` — signature verified, then the sale is recorded to the panel (`POST /api/store/orders` with `X-Store-Secret`), which marks products `sold` (they drop off the store automatically) and credits the `Store` platform in the dashboard.
4. Idempotent: Stripe retries can't create duplicate sales (session id = idempotency key).

## Stripe setup (when ready to go live)
1. Get keys at dashboard.stripe.com → fill `STRIPE_SECRET_KEY`, set `STORE_DEV_MOCK_CHECKOUT=0`.
2. Local webhook testing: `stripe listen --forward-to localhost:3000/api/webhook` → copy the `whsec_...` into `STRIPE_WEBHOOK_SECRET`.
3. Production: add a webhook endpoint for `checkout.session.completed` → `https://zazaluxury.com/api/webhook`.

## Deploy plan (later)
- Store → Vercel (`zazaluxury.com`)
- Panel → small VPS (`panel.zazaluxury.com`) — JSON data + `/uploads` need a persistent disk
- Porkbun DNS: root → Vercel, `panel` → VPS IP
