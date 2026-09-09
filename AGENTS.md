# AGENTS.md

## Cursor Cloud specific instructions

This repository is a single client-side product: a React 18 + Vite 6 + TypeScript
portfolio SPA (Tailwind v4, Motion, `matter-js`). There is no backend, database, or
API — everything runs from the Vite dev server. Routing uses `HashRouter`, so deep
links look like `http://localhost:5173/#/work/<project>`.

Standard commands are documented in `README.md` and `package.json` scripts; use those
rather than duplicating them here. In short: `npm run dev` (dev server on port 5173),
`npm run typecheck` (`tsc --noEmit` — this is the only "lint"/static check), and
`npm run build`.

Non-obvious notes for future agents:
- There is no test runner configured. "Testing" means `npm run typecheck` plus manual
  visual/interaction checks in the browser.
- The dev server binds to `localhost` only (no `--host`); reach it at
  `http://localhost:5173/`.
- The contact section is contact info + links (no submitting form fields in the current
  build). An optional `VITE_CONTACT_ENDPOINT` (set in `.env.local`) is only relevant if a
  submitting form variant is wired up; without it nothing is blocked.
- Deployment is GitHub Pages via `.github/workflows/deploy.yml` (typecheck → build →
  publish `dist/`). `base` in `vite.config.ts` and the canonical/og URLs in `index.html`
  are tied to the deploy target and must change together if that ever changes.
