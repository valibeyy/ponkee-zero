# CartPilot

Premium, mobile-first grocery lists + monthly budget tracking — **Next.js (App Router)**, **Tailwind**, **React Context**, **localStorage** persistence (no backend).

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Vercel → **New Project** → import repo.
3. Framework should auto-detect **Next.js** (`npm run build` / `.next` output).

Optional CLI:

```bash
npx vercel
```

Latest production deploy from this workspace:

- `https://cartpilot-eight.vercel.app`

## Notes

- PWA support is provided via `next-pwa` (service worker artifacts are emitted into `public/` in production builds).
