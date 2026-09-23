# AGENTS.md — Portfolio v2

## Critical

- Live production routes (`/`, `/about`, `/work`, …) must stay untouched.
- Preview archive lives under `app/v2/` + `src/components/v2/`.
- Primary homepage is the singularity landing (`LandingExperienceSingularity` + `src/components/v2/singularity/`).
- Classic orbit / particle landing is preserved at `/v2/classic`.

## Sources of truth

1. `design/design.md` — visual system
2. `design/Design Portfolio Handbook - FLUX.md` — homepage section order
3. `design/Reference1–16` — visual references

## Current direction (D)

Living design archive:
- Warm archival paper + bright red primary (`#F23828`); dark alternate
- Four-column research grid, oversized geometric display type, compact mono labels
- About / work / machine in `src/components/v2/archive/`
- Classic lab: `/v2/classic` (orbit landing), `/v2/classic/workbench`
- Homepage hero: singularity (bloom + lensing + drag / return) in `src/components/v2/singularity/`
- Singularity lab tool: `/v2/singularity` (`SingularityLabExperience`) — live bloom / disk / lens / color controls
- Styles: `src/styles/v2.css` + `src/styles/singularity.css`
- About portrait: `/assets/images/profile.png` only — do **not** use `about.png`

## Homepage structure (Flux)

Hero → Trust → Why → Work → About → CTA

## Routes

| Path | Purpose |
|------|---------|
| `/v2` | **Primary homepage** (singularity landing) |
| `/v2/classic` | Archived orbit / particle landing (lab) |
| `/v2/classic/workbench` | Archived workbench (lab) |
| `/v2/about` | About (`profile.png`) |
| `/v2/work/[slug]` | Three curated case studies |
| `/v2/singularity` | Interactive singularity playground (lab tool) |
| `/v2/machine` | Plain-text agent bio |
| `/v2/workbench` | Redirect → `/v2/classic/workbench` |

## Preview

```bash
npm run dev
```

- Primary: `http://localhost:3000/v2`
- Classic landing: `http://localhost:3000/v2/classic`
- Classic workbench: `http://localhost:3000/v2/classic/workbench`
