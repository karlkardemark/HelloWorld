# Deployment

This is a static site (HTML/CSS/JS, no build step). It is hosted on
**Azure Static Web Apps**, wired up through the GitHub Actions workflow at
`.github/workflows/azure-static-web-apps-ashy-bay-0bd9fab10.yml`.

| Environment | Trigger | URL |
| --- | --- | --- |
| **Production** | push to `main` | <https://ashy-bay-0bd9fab10.7.azurestaticapps.net> |
| **Staging / dev** | open a **pull request → `main`** | Azure auto-creates a per-PR preview URL and posts it as a comment on the PR |

## How it works

- Every push to `main` triggers the workflow, which uploads the site to the
  **production** environment.
- Every **open pull request targeting `main`** gets its own **preview
  environment** with a unique URL. Azure posts that URL as a comment on the PR
  and redeploys it on each push to the PR branch. When the PR is closed, the
  preview environment is torn down automatically (`close_pull_request_job`).

> Note: on the Static Web Apps free plan, staging environments are
> **per-pull-request**, not per-branch. A branch like `dev` only gets a live
> URL while it has an open PR into `main`.

### Build configuration

The workflow uses these settings (already correct for this static site):

```yaml
app_location: "/"      # site source is the repo root
api_location: ""       # no Azure Functions API
output_location: ""    # no build output dir
skip_app_build: true   # nothing to compile — upload as-is
```

The deployment token is stored in the repo secret
`AZURE_STATIC_WEB_APPS_API_TOKEN_ASHY_BAY_0BD9FAB10`.

## Day-to-day workflow

```
feature branch ──PR──▶ main
                 │
                 └─ Azure posts a preview URL on the PR (test here)
                    merge ─▶ production redeploys automatically
```

1. Develop on a branch and open a PR into `main`.
2. Test on the preview URL Azure comments on the PR.
3. Merge to `main` — production redeploys on its own.

## Run it locally

Zero dependencies — `npm run dev` runs a tiny built-in Node static server
(`server.js`), no install or network needed:

```bash
npm run dev               # serves at http://localhost:3000
PORT=8080 npm run dev     # or pick a different port
```

Equivalents that also work:

```bash
node server.js            # same thing, without npm
python3 -m http.server 3000
```
