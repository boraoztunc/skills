# Notice — MengTo/Skills web-design set

A subset of the skills in this repo is vendored from **[MengTo/Skills](https://github.com/MengTo/Skills)**
(`agent-skills/web-design/`).

**Original license:** MIT — see [`LICENSE-mengto-skills`](LICENSE-mengto-skills)
**Copyright:** 2026 Meng To

## What was vendored

Of the 77 skills in the upstream `web-design` folder — which upstream describes as a
**draft set** — 23 were adopted after audit. The rest were either prose-only mood
boards with no transferable technique, near-duplicates of each other, or technically
outdated. See the audit summary in the repo README.

Vendored verbatim or near-verbatim:

`beam-glow-states` · `beautiful-shadows` · `container-lines` · `corner-diagonals` ·
`css-border-gradient` · `documentary-brutalist-agency` · `editorial-portfolio-chapters` ·
`framed-grid-layout` · `glass-dark-ui` · `landing-page` · `liquid-metal-border` ·
`mesh-gradient-dark-blue-clean` · `operational-enterprise-ai` · `pricing-page` ·
`product-proof-saas` · `progressive-blur` · `reveal-hover-effect` ·
`service-booking-flow` (renamed from `editorial-service-booking`) ·
`shaders-cursor-ripples` · `skeuomorphic-ui` · `staggered-word-reveal` ·
`thinking-orbs` · `webgl-laser`

## Modifications made to the vendored files

Corrections applied on adoption — the upstream files have these defects:

- **`progressive-blur`** — added 16 `-webkit-mask` companion declarations. Upstream
  shipped only unprefixed `mask:`, so the effect silently failed in WebKit despite its
  own sibling skill mandating the prefix.
- **`css-border-gradient`** — added the unprefixed `mask:` layers. Upstream set
  `mask-composite: exclude` with only `-webkit-mask` layers declared, so in
  spec-compliant engines the `::before` had no mask and covered the entire surface.
- **`beam-glow-states`** — corrected the `line` variant `duration` default from `3.1`
  to `2.4` to match the upstream `border-beam` package.
- **`container-lines`** — changed `100vw` to `100%` in the guide-line offset. `100vw`
  includes the scrollbar width, so the guides misaligned from the content container by
  the scrollbar gutter on every desktop browser.
- **`shaders-cursor-ripples`** — replaced the soft "verify the current license terms"
  note with an explicit warning that the `shaders` package is proprietary and
  payment-gated (npm reports `license: None`), plus a free alternative.
- **`editorial-service-booking`** → renamed **`service-booking-flow`**; it is a
  booking-flow resilience skill, not a visual style.
- **`glass-dark-ui`** — added a `## Use When` section and explicit disambiguation
  against the other dark-surface skills, which upstream lacked.

## Not vendored — and why

Notable rejections:

- **`tailwindcss`** — written entirely for Tailwind v3 with zero mention of v4. An
  agent following it on a v4 project writes a config file that is silently ignored.
  Replaced with a v4-first `tailwind-v4` skill written for this repo.
- **19 palette-dump skills** (`dark-glass-clean-layout`, `blue-laser-clean-glass-layout`,
  `tech-green-dark-mode-modern`, `funky-purple-container-tech`, and similar) — all share
  one generated template with an empty `## Workflow` heading, a `## Use When` that
  restates the description, and no code, hex values, or spacing scale. Their
  descriptions are mutually indistinguishable, which degrades skill selection. Their
  handful of genuine techniques was harvested into the `visual-style-presets` skill
  written for this repo.
- **`animation-systems`, `atmosphere-background`, `corner-lasers`, `marquee-loop`,
  `gooey-blob-system`** — prose restatements of baseline model knowledge. `gooey-blob-system`
  prescribes a blur-plus-color-matrix threshold while omitting the `feColorMatrix`
  values, which is the only hard part.
- **`gsap`, `threejs`, `matterjs`, `globe-gl`** — library-README recaps; also collide
  by name with this repo's existing HyperFrames-scoped adapters.
- **`webgl-landing-steering`** — a prompt template with leaked authoring scaffolding,
  not technical knowledge.
- **`demo/` directories** — excluded entirely. Upstream ships 76 demo `index.html`
  files that collapse to only a handful of distinct files (six skills share one
  byte-identical 45KB file), only one loads any library at all, and no adopted
  `SKILL.md` references its demo. A demo shared between a skeuomorphism skill and a
  split-layout skill is evidence for neither.
