# Portfolio — Arnav Sharma

Personal portfolio site. React + Vite + Tailwind v4, animated with Motion, deployed to GitHub
Pages at https://arnavucd.github.io/PortfolioWebsite/.

## Running locally

```bash
npm install
npm run dev
```

| Script              | What it does                              |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Dev server at http://localhost:5173       |
| `npm run build`     | Production build into `dist/`             |
| `npm run preview`   | Serve the production build locally        |
| `npm run typecheck` | `tsc --noEmit` over the whole project     |

## Layout

```
src/
  app/
    App.tsx              routes, preloader, scroll restoration
    components/          one file per page section
      demos/             the animated project demos + their registry
      experience/        the Work & Education provenance graph (see note below)
    data/
      projects.ts        all project content (typed)
      experience.ts      roles, education, headline metrics
      site.ts            email, links, résumé path
  styles/
    globals.css          design tokens, surface texture, type
public/
  Arnav-Sharma-Resume.pdf
```

### Editing content

Almost everything visitors read lives in three places:

- **Projects** — `src/app/data/projects.ts`. Adding an entry to the array adds it to the home
  page selector, the `/work` grid, and its own case-study page. A project's `demo` key must
  match one registered in `src/app/components/demos/index.ts`.
- **Contact details, links, résumé** — `src/app/data/site.ts`.
- **Experience** — `src/app/data/experience.ts`. Each entry's optional `metric` is the
  oversized figure shown at the foot of its card; education has none, so that row is omitted.
  An entry's `tags` are what populate the skill cloud, so that is where skills get added.
- **Skills** — there is no separate skills list any more. Every skill is a `tag` on an
  experience entry, which is what makes the graph the single source of truth for them.
  `SkillsMarquee.tsx` is the retired toolkit ticker: still on disk, no longer imported.

Experience renders as a provenance graph (`experience/ExperienceGraph.tsx`): role cards on the
left, a physics-driven cloud of skill pills on the right. Every pill comes from the entries'
`tags` — add a tag and a pill appears. Notes for future edits:

- **The cloud is a real simulation**, not an animation. Every pill is a chamfered
  `matter-js` rectangle body in a zero-gravity world bounded by four static walls, so pills
  collide, rebound off each other, and are shoved aside by the cursor. Rotation is locked
  (`Body.setInertia(body, Infinity)`) because a tumbling word is unreadable.
- **Nothing is hand-positioned.** Pills are seeded one per grid cell and then pulled toward an
  attractor that is itself wandering on two incommensurate harmonics, so no path repeats
  visibly. A skill owned by more than one role is marked `×n`.
- **Selecting a role gathers its skills in front of that card** — a loose grid filling the
  card's horizontal band, never a column. The pull simply switches target and strengthens
  (`PULL_IDLE` → `PULL_GATHER`); the physics never stops, so the cluster keeps breathing.
  Selecting a single *skill* only highlights it, since gathering one lone pill looked broken.
- **Tuning lives in the constants block** at the top of the file. The one thing to understand
  before touching it: Matter multiplies `force / mass` by `delta²` before it becomes velocity,
  which at 60fps is a factor of **~278**. Writing a pull constant as though force mapped
  straight to acceleration makes it ~1000× too strong, which is exactly how the first version
  ended up flinging pills across the field at 1800 px/s. Derive them instead:

      ω = sqrt(PULL * 278)   radians per step      ζ = DRAG / (2 * ω)

  `DRAG 0.12` puts the gather at ζ ≈ 1.2 (no overshoot) and the idle drift at ζ ≈ 2.5 (a slow
  loiter). Measured behaviour: idle 3–8 px/s, gather peaks ~240 px/s and settles in about a
  second, cursor push ~65 px/s. `MAX_SPEED` is insurance for contact spikes — if it starts
  firing during ordinary motion, the pull constants are too strong rather than the cap too low.
  `scripts/` has no harness for this, but replaying the constants headlessly against
  `matter-js` in a throwaway node script is the only way to check the feel without a browser.
- The engine runs on a **fixed timestep** (`STEP_MS`) with an accumulator capped at three steps
  per frame — Matter is unstable on a variable delta, and the cap stops a stalled tab from
  spiralling. React never re-renders per frame; the loop writes transforms directly.
- Hover and keyboard focus both select; clicking toggles a lock, which is what touch gets.
- Under `prefers-reduced-motion` the simulation never starts and the pills stay on their seeded
  grid; only the highlight states respond.
- Below `lg` the cloud is replaced by stacked cards with inline skill chips.

### Theming

Every colour resolves from custom properties in the `:root` block of `globals.css`, mapped to
Tailwind utilities via `@theme inline`. Components reference only semantic names — `bg-glass`,
`border-glass-line`, `text-ink`, `text-ink-dim`, `text-ink-faint`, `bg-accent` — so the palette
changes in one place rather than across thirty files.

There are two card materials, and they are not interchangeable:

- **`.neu`** — opaque neumorphism, used for every card. Form comes from a matched shadow pair,
  light from the top-left and dark from the bottom-right, over `--raised`. The light shadow has
  to stay very faint on a dark surface or the extruded illusion collapses into a grey box.
  `.neu-raised` lifts it further for hover/selected; `.neu-inset` presses it in.
- **`.glass` / `.glass-pill`** — translucent frost plus a diagonal sheen, used for pills and
  the demo panels, where things move behind the surface and it needs to read as glass.

Never put a `backdrop-blur-*` utility on an element that already has `.glass`: Tailwind
composes its own `backdrop-filter` and silently overrides the class.

Two more rules worth keeping:

- **`--accent` is light.** Anything sitting on it takes `text-surface`, never `text-white`.
- **`index.html` carries a hardcoded `background-color`** matching `--surface`, so the first
  frame is not white before the stylesheet lands. Change it alongside the token.

### The contact form

With no configuration the form opens a pre-filled draft in the visitor's mail client. To have
it submit directly instead, point it at any backend that accepts a JSON `POST` (Formspree,
Getform, a Cloudflare Worker):

```bash
echo 'VITE_CONTACT_ENDPOINT=https://formspree.io/f/xxxxxxxx' > .env.local
```

In CI, add the same variable as a repository secret and expose it to the build step.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which typechecks, builds, and publishes
`dist/` to GitHub Pages.

Two things are tied to the repository name and must change together if it is ever renamed:
`base` in `vite.config.ts`, and the canonical/og URLs in `index.html`. The app uses a
`HashRouter` so that deep links such as `/#/work/cardiosense` resolve without any server-side
rewrite — Pages serves only static files.
