# Shay — Interactive Portfolio

A minimalist, monochrome scrollytelling portfolio built with React, TypeScript, Vite, Tailwind CSS, GSAP/ScrollTrigger, and Lucide icons.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Run the automated scoring checks with `npm test` and create the static production build with `npm run build`. The deployable output is written to `dist/`.

## Lead submission

The diagnostic stays entirely in the browser until question three is answered. Configure `VITE_FORM_ENDPOINT` with an HTTPS endpoint that accepts a JSON `POST` containing:

```json
{
  "email": "visitor@example.com",
  "answers": { "q1": "A", "q2": "B", "q3": "C" },
  "result": "delegation",
  "submittedAt": "2026-01-01T12:00:00.000Z"
}
```

The endpoint must return a 2xx response only after it has accepted the submission. The interface does not show a successful confirmation before that response. Failed requests show a retry action, and successful payloads are not sent twice during the same page session.

With no endpoint configured, the site runs in clearly labeled preview mode: results still calculate locally, but the UI explicitly states that the answers were not sent. API secrets must live in the external service, never in `VITE_` variables or frontend source.

Compatible providers include Formspree, Basin, Make, Zapier webhooks, or a small serverless function. Configure CORS at the endpoint for the deployed site origin.

## Content and scoring

- Questions and answer weights: `src/data/questions.ts`
- Result copy: `src/data/results.ts`
- Deterministic scoring and tie-break priority: `src/data/scoring.ts`

No email or answer is written to browser storage, query strings, or analytics.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys the site on pushes to `main`. Enable **Settings → Pages → Source → GitHub Actions** and add `VITE_FORM_ENDPOINT` as a repository Actions variable.

For project pages, the workflow automatically builds with `/<repository-name>/` as Vite's base path. For a custom domain, add an Actions repository variable named `VITE_BASE_PATH` with the value `/`, then add the domain using GitHub Pages settings (plus a `CNAME` file if desired).

The methodology placeholder is emitted as a real static `methodology/index.html`, so it works without client-side routing or rewrite rules.
