# Ponkee Zero

Local-first debt payoff tracker: offline, fast, emotionally satisfying when your numbers go down. Data stays in **IndexedDB** on each device (no backend, no login).

## Run locally

```bash
npm install
npm run dev
```

- Dev server uses **`vite --host`** so you can open it from other devices on the same Wi‑Fi (see the “Network” URL in the terminal).

## Production build

```bash
npm run build
npm run preview
```

## Deploy on Vercel (production link)

1. Push this repo to GitHub (if it is not already).
2. In [Vercel](https://vercel.com) → **Add New… → Project** → import the repository.
3. Leave defaults: **Framework: Vite**, **Build Command:** `npm run build`, **Output Directory:** `dist` (also set in `vercel.json`).
4. Click **Deploy**. Your app will be available at `https://<project>.vercel.app` (and optional custom domain).

The repo includes `vercel.json` with:

- explicit **Vite** build settings,
- **SPA rewrite** to `index.html` (safe if you add client-side routes later),
- long-cache headers for **`/assets/*`**,
- basic security headers.

After the first deploy, every push to the connected branch redeploys automatically.
