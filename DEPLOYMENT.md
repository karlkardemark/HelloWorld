# Deployment

This is a static site (HTML/CSS/JS, no build step). It is hosted on **Vercel**
with two environments, each with its own shareable link:

| Environment | Deploys from branch | URL pattern | Who it's for |
| --- | --- | --- | --- |
| **Production** | `main` | `https://<project>.vercel.app` | Share widely with colleagues |
| **Dev / staging** | `dev` | `https://<project>-git-dev-<scope>.vercel.app` | Test changes before promoting to prod |

> Every branch and pull request also gets its own automatic **preview URL**, so
> you can share a work-in-progress link without touching `dev` or `main`.

## One-time setup (you do this once, ~2 minutes)

1. Go to <https://vercel.com/new> and **Sign in with GitHub**.
2. Click **Import** next to the `karlkardemark/HelloWorld` repository.
3. Framework preset: **Other** (it's a plain static site — no build needed).
   Leave Build Command empty and Output Directory as the repo root.
4. Click **Deploy**. The first deploy of `main` becomes your **production** URL.
5. In **Project → Settings → Git**, confirm the **Production Branch** is `main`.
   That makes every other branch (including `dev`) a non-production deploy.

After this, Vercel watches the repo automatically — you never run a deploy by
hand again.

## Day-to-day workflow

```
feature branch ──PR──▶ dev (staging URL) ──PR──▶ main (production URL)
```

1. Develop on a feature branch and open a PR. Vercel posts a **preview URL** on
   the PR — share that for review.
2. Merge into `dev` to publish to the **dev/staging** URL for wider testing.
3. When it's solid, merge `dev` into `main` to ship to **production**.

## Run it locally

No install needed (uses `npx`):

```bash
npm run dev      # serves at http://localhost:3000
```

Or with Python:

```bash
python3 -m http.server 3000
```

## Switching hosts

The site is plain static files, so it also runs as-is on Netlify, Cloudflare
Pages, GitHub Pages, or any static host. Only the `vercel.json` is
Vercel-specific; everything else is portable.
