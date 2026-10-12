# AGENTS.md — Portfolio (vittesh.com)

## Critical

- **Production** routes live in `app/(site)/` (URLs at `/`, `/about/`, `/work/[slug]/`, …).
- **Legacy backup** (previous site) is at `/legacy/` (`app/legacy/`, `robots: noindex`).
- Do not break live `/` without explicit intent; lab tools stay under `/classic`, `/singularity`, `/workbench`.
- Primary homepage: singularity landing (`LandingExperienceSingularity` + `src/components/v2/singularity/`).
- Classic orbit / particle landing: `/classic`.

## Sources of truth

1. `design/design.md` — visual system
2. `design/Design Portfolio Handbook - FLUX.md` — homepage section order
3. `design/Reference1–16` — visual references

## Current direction (D)

Living design archive:
- Warm archival paper + bright red primary (`#F23828`); dark alternate
- Four-column research grid, oversized geometric display type, compact mono labels
- About / work / machine in `src/components/v2/archive/`
- Classic lab: `/classic` (orbit landing), `/classic/workbench`
- Homepage hero: singularity (bloom + lensing + drag / return) in `src/components/v2/singularity/`
- Singularity lab: `/singularity` (`SingularityLabExperience`)
- Styles: `src/styles/v2.css` + `src/styles/singularity.css`
- About portrait: `profile.png` only — **not** `about.png`. Pages load `profile-192.webp` (hero) and `profile-1400.webp` (about).

## Homepage structure (Flux)

Hero → Trust → Why → Work → About → CTA

## Routes

| Path | Purpose |
|------|---------|
| `/` | **Primary homepage** (singularity landing) |
| `/classic` | Archived orbit / particle landing (lab) |
| `/classic/workbench` | Archived workbench (lab) |
| `/about` | About |
| `/work/[slug]` | Curated case studies (published slugs in `caseStudies.ts`) |
| `/singularity` | Interactive singularity playground (lab) |
| `/machine` | Plain-text agent bio |
| `/workbench` | Redirect → `/classic/workbench` |
| `/legacy/` | Previous production site (backup, noindex) |

Old `/v2/*` URLs redirect to `/` via `public/.htaccess`.

## Preview

```bash
npm run dev
```

- Primary: `http://localhost:3000/`
- Classic: `http://localhost:3000/classic`
- Legacy backup: `http://localhost:3000/legacy/`
