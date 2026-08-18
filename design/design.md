# System & Design Specification: Personal Portfolio & Case Studies

This document serves as the single source of truth for **Cursor AI** and developers building the personal portfolio website for **Vittesh** (Product Designer & Strategic Consultant).

---

## 1. Project Architecture & Tech Stack

* **Framework:** Next.js 14+ (App Router, TypeScript)
* **Styling:** Tailwind CSS v3+ with CSS Variables for theme switching
* **Animation:** Framer Motion (page transitions, micro-interactions, scroll animations)
* **Content Engine:** MDX (via `@next/mdx` or `contentlayer`) for case studies and articles
* **Icons:** Lucide React (`lucide-react`)
* **Fonts:** `Plus Jakarta Sans` or `Inter` (Sans-serif), `Playfair Display` or `Instrument Serif` (Editorial Serif accent), `JetBrains Mono` (Technical)
* **Deployment & Hosting:** Vercel

---

## 2. Aesthetic Direction & Visual Language (Inspiration Breakdown)

The site visual language blends **high-end editorial design**, **Swiss style grid system**, and **modern brutalist typography**.

### Key Visual DNA Elements:
1. **Editorial & Hybrid Typography Pairing:**
   * Oversized display titles mixing bold high-contrast serifs with ultra-clean, heavy sans-serif fonts.
   * Fine-print caption text, numeric index badges (`01/`, `02/`), asterisk symbols (`*`), and directional arrows (`→`, `↓`).
2. **Asymmetrical Grid & Architectural Layout:**
   * Off-center headers, structural dividing lines (`border-subtle`), overlapping text cards, and high-density information blocks.
   * Clean 2-column project grids featuring subtle hover indicators (e.g., top-right arrow badge `↗`).
3. **Pop Accent & Precision Palette:**
   * Primary background: Off-white / Warm light gray (`#EAEAEA` / `#F3F3F3`) and Deep Matte Obsidian (`#0D0D0E`).
   * High-contrast pop accents: International Klein Blue (`#2563EB`) or High-Energy Vermilion Red (`#E63946`) for interactive badges, highlights, and CTAs.
4. **Structured Metadata Cards:**
   * Stat metrics enclosed in square brackets `[ $1.5M ] [ 30% ]` or clean bordered blocks.
   * Process steps linked with inline direction arrows (`Discuss → Learn → Create → Produce`).

---

## 3. Directory & Folder Structure

```text
portfolio/
├── .cursorrules                  # Specific rules and constraints for Cursor AI
├── design.md                     # Design system & technical specification
├── public/
│   ├── assets/
│   │   ├── branding/             # Logos, favicons, open-graph images
│   │   ├── case-studies/         # High-res mocks, thumbnails
│   │   └── avatar/               # Dramatic black & white headshots
│   └── fonts/                    # Custom local fonts
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout with ThemeProvider & Font loaders
│   │   ├── page.tsx              # Homepage
│   │   ├── work/
│   │   │   ├── page.tsx          # Case studies archive
│   │   │   └── [slug]/page.tsx   # Dynamic case study page
│   │   ├── thoughts/
│   │   │   ├── page.tsx          # Essays index
│   │   │   └── [slug]/page.tsx   # Essay page
│   │   └── about/page.tsx        # Bio & methodology
│   ├── components/
│   │   ├── ui/                   # Buttons, tags, brackets, badges
│   │   ├── layout/               # Header, Footer, Grid guides
│   │   ├── sections/             # Hero, Project Grid, Process/Workflow
│   │   ├── case-study/           # Metrics cards, comparison blocks
│   │   └── mdx/                  # Custom MDX components
│   ├── content/                  # MDX Content files
│   ├── config/                   # Navigation & site configuration
│   ├── lib/                      # Helper utilities (`cn`, mdx parser)
│   ├── styles/                   # Global CSS & Tailwind variables
│   └── types/                    # TypeScript interfaces
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Color Palette & Typography Variables

```css
/* Light Mode (Editorial Warm Light Gray) */
:root {
  --bg-primary: #EAEAEA;
  --bg-surface: #FFFFFF;
  --bg-muted: #E0E0E0;
  --text-primary: #0D0D0E;
  --text-secondary: #4A4A4F;
  --text-muted: #8E8E93;
  --border-subtle: #D1D1D6;
  --accent-pop: #E63946; /* High-Energy Vermilion Red */
  --accent-blue: #2563EB; /* Precision Blue */
}

/* Dark Mode (High-Contrast Obsidian) */
.dark {
  --bg-primary: #0D0D0E;
  --bg-surface: #171719;
  --bg-muted: #222225;
  --text-primary: #F4F4F6;
  --text-secondary: #A1A1AA;
  --text-muted: #71717A;
  --border-subtle: #27272A;
  --accent-pop: #FF4D4D;
  --accent-blue: #3B82F6;
}
```

---

## 5. Instructions for Cursor AI

When generating components:
1. **Typography:** Mix bold geometric display titles with fine editorial serif accents and monospace numeric indexes.
2. **Structure:** Use visible hairline borders (`border-b border-border-subtle`), brackets for metric stats, and structured process flows.
3. **Accent Elements:** Apply high-contrast circular or rectangular pop-color badges (`bg-accent-pop`) for CTAs and highlighted tags.
4. **Layout:** Embrace asymmetrical whitespace, large portraits, and grid alignment lines.


---

## 6. Reference Links & Component Sources

The following live sites and component repositories serve as explicit references for interactions, dynamic components, and visual direction:

1. **[Niccolò Miranda - 404 Page Reference](https://www.niccolomiranda.com/404)**
   * **Purpose:** Custom interactive 404 page experience.
   * **Key Traits:** High-playfulness, tactile micro-interactions, memorable custom typography, and high-energy physics/canvas effects for error state handling.

2. **[21st.dev Component Library](https://21st.dev/community/components)**
   * **Purpose:** Primary component registry and code snippets for modern Tailwind + React/Next.js components.
   * **Key Traits:** Use 21st.dev patterns for ready-made UI primitives, animated buttons, ambient background grids, interactive cards, and high-trust landing section components.

3. **[Amaterasu AI](https://amaterasu.ai/)**
   * **Purpose:** Motion design, scroll-driven interactive narrative, and canvas/WebGL background physics.
   * **Key Traits:** Fluid page transitions, subtle glowing gradients, smooth scroll-triggered reveal effects, high-tech dark mode depth, and precision cursor interactions.