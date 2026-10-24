# AGENTS.md — Portfolio (vittesh.com)

## Critical

- **Production** is the archive site at `/` (`app/(site)/`). Homepage is the singularity landing.
- **Previous portfolio** lives under `/legacy/` (`app/legacy/`). Do not replace it.
- Lab tools: `/classic`, `/singularity`, `/classic/workbench`. `/v2/*` redirects to the same paths without the prefix.
- Case studies to edit are the pages under `app/(site)/work/` and copy in `src/config/v2/caseStudies.ts`.
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
| `/about` | About |
| `/tldr` | One-screen summary (identity, work, contact) |
| `/work/[slug]` | Case-study templates (published slugs in `caseStudies.ts`) |
| `/classic` | Archived orbit / particle landing (lab) |
| `/classic/workbench` | Archived workbench (lab) |
| `/singularity` | Interactive singularity playground (lab) |
| `/machine` | Plain-text agent bio |
| `/legacy/` | Previous portfolio |
| `/legacy/about/` | Previous about |
| `/legacy/work/` | Previous selected work |
| `/legacy/work-pages/virtual-humans/` | Previous Virtual Humans case study |
| `/v2/*` | Redirects to the same path without `/v2` |

## Preview

```bash
npm run dev
```

- Primary: `http://localhost:3000/`
- About: `http://localhost:3000/about/`
- Case study: `http://localhost:3000/work/vr-eeg-analytics/`
- Previous site: `http://localhost:3000/legacy/`
- Classic: `http://localhost:3000/classic/`
