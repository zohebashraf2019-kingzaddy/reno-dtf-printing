# Reno DTF — Website

Static site (HTML/CSS/JS, no build step) for **Reno DTF** — custom DTF transfers & gang sheets in Reno, NV.

## Pages
- `index.html` — Home: animated hero, features, order options, gang sheet sizes, 7-step guide, fabric settings, pickup, FAQ
- `how-to-use.html` — Full application guide with pro tips + care instructions
- `contact.html` — Contact form (opens email to the shop), Shop sign-in, pickup info

## Edit business info in ONE place
Open `js/config.js`:
- `email` — **replace the placeholder with the client's real order email**
- `shopify` — links for the Gang Sheet Builder, account/sign-in and cart
- `cutoffHour` — daily same-day cutoff (Pacific Time) used by the live countdown

## Deploy (GitHub + Vercel)
1. Create a new GitHub repo and upload the contents of this folder (so `index.html` is at the repo root).
2. In Vercel: **Add New → Project → Import** the repo. Framework preset: **Other**. No build command, output directory = root.
3. Deploy. `vercel.json` enables clean URLs (`/contact`, `/how-to-use`).

## Domain + Shopify note
The Shopify store currently lives on `www.renodtfprinting.com`. If this site takes over that domain,
move Shopify to a subdomain (e.g. `shop.renodtfprinting.com`) in Shopify → Settings → Domains,
then update `shopify.base` in `js/config.js`.

## Animations
- Generative neon "ink" loop on hero backgrounds (canvas, `js/main.js`)
- Looping transfer-peel animation on the hero T-shirt (CSS)
- Scroll reveals, marquee, animated gradients, cursor glow
- All motion turns off automatically for visitors with "reduce motion" enabled.

## Local preview
```
python3 -m http.server 8000
```
then open http://localhost:8000

## Videos
Looping background videos live in `assets/video/` (muted, autoplay, both `.webm` and `.mp4` for all browsers):
- `print-floor` — print head running (hero background, inner page headers, behind-the-scenes monitor)
- `gang-sheet-run` — gang sheet coming off the printer (behind-the-scenes monitor, bottom CTA)

To swap a video, replace the file with the same name. Keep clips short (5–15s) and under ~3 MB.
Videos pause automatically when scrolled off screen and for visitors with "reduce motion" on.
