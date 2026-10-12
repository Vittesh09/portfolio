# AGENTS.md — Portfolio (vittesh.com)

## Critical

- **Production** is the previous portfolio in `app/(main)/` (`/`, `/about/`, `/work/`, `/work-pages/virtual-humans/`).
- **Newer site** lives under `/v2/` (`app/(site)/v2/`). Lab tools stay under `/v2/classic`, `/v2/singularity`, `/v2/workbench`.
- Do not replace live `/` with the singularity landing unless asked. Case studies to edit are the pages under `app/(main)/`.
- Classic orbit / particle landing: `/v2/classic`.

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
| `/` | **Primary homepage** (previous portfolio) |
| `/about` | About (previous portfolio) |
| `/work` | Selected work (previous portfolio) |
| `/work-pages/virtual-humans` | Virtual Humans case study |
| `/v2` | Newer singularity homepage |
| `/v2/about` | Newer about page |
| `/v2/work/[slug]` | Newer case-study templates (published slugs in `caseStudies.ts`) |
| `/v2/classic` | Archived orbit / particle landing (lab) |
| `/v2/classic/workbench` | Archived workbench (lab) |
| `/v2/singularity` | Interactive singularity playground (lab) |
| `/v2/machine` | Plain-text agent bio |
| `/legacy/` | Redirects to `/` |

## Preview

```bash
npm run dev
```

- Primary: `http://localhost:3000/`
- Case study: `http://localhost:3000/work-pages/virtual-humans/`
- Newer site: `http://localhost:3000/v2/`
- Classic: `http://localhost:3000/v2/classic/`
