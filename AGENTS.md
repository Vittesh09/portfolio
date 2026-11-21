# AGENTS.md — Portfolio (vittesh.com)

## Critical

- **Production** is the desk site at `/` (`app/(site)/(desk)/`, components in `src/components/v2/desk/`): `/`, `/about/`, `/work/[slug]/`.
- **Previous version** (singularity archive) lives under `/v2/` (`app/(site)/v2/`). Internal archive links go through `v2Path()`.
- **Oldest portfolio** lives under `/legacy/` (`app/legacy/`). Do not replace it.
- Lab tools: `/classic`, `/singularity`, `/classic/workbench`. `/desk/*` redirects to the same paths at the root.
- Route checks (`isDeskPath`) live in `src/config/v2/routes.ts`.
- Case-study copy lives in `src/config/v2/caseStudies.ts` (shared by `/work/[slug]` and `/v2/work/[slug]`).
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
| `/` | **Primary homepage** (desk: singularity stage + horizontal work rail) |
| `/about` | About (desk) |
| `/work/[slug]` | Case study (desk) |
| `/v2/` | Previous homepage (singularity archive landing) |
| `/v2/about` | Previous about |
| `/v2/work/[slug]` | Previous case-study template |
| `/tldr` | One-screen summary (identity, work, contact) |
| `/classic` | Archived orbit / particle landing (lab) |
| `/classic/workbench` | Archived workbench (lab) |
| `/singularity` | Interactive singularity playground (lab) |
| `/desk/*` | Redirects to the same path at the root |
| `/machine` | Plain-text agent bio |
| `/legacy/` | Previous portfolio |
| `/legacy/about/` | Previous about |
| `/legacy/work/` | Previous selected work |
| `/legacy/work-pages/virtual-humans/` | Previous Virtual Humans case study |

## Preview

```bash
npm run dev
```

- Primary: `http://localhost:3000/`
- About: `http://localhost:3000/about/`
- Case study: `http://localhost:3000/work/vr-eeg-analytics/`
- Previous site: `http://localhost:3000/legacy/`
- Classic: `http://localhost:3000/classic/`
- Previous version: `http://localhost:3000/v2/`
