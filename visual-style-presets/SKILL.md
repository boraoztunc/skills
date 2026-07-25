---
name: visual-style-presets
description: Pick and apply a complete visual style direction — surface ladder, type scale, accent discipline, and one signature structural motif — for a website, landing page, dashboard, or app shell. Use when asked for a specific look such as dark glass, dark technical, frosted workspace, warm paper, beige minimal, editorial grid, archival book, wireframe diagnostic, cobalt contrast, or "make it feel premium/expensive/engineered", or when a design needs a coherent direction rather than ad-hoc styling.
---

# Visual Style Presets

One skill, nine presets. Each preset is a complete direction: a surface ladder, an
accent rule, a type pairing, and **one signature structural motif** that carries the
identity. Pick a preset, apply its tokens, then commit to its motif.

## How to use this

1. Pick the preset that matches the request. If the user named a vibe ("premium
   dark", "paper-like", "engineered"), map it to the closest preset below.
2. Copy that preset's token block verbatim as the foundation. Retune hues to brand.
3. Implement the signature motif — this is what makes the preset legible. Skipping
   it leaves generic output regardless of the palette.
4. Apply the universal rules at the bottom. They matter more than the palette.

**Do not blend two presets in one interface.** Mixed glassmorphism + skeuomorphism +
frames is the single most common failure. One material system per screen.

---

## The presets

### 1. `dark-glass-workspace`
Premium dark console: frosted shells, multi-column workspace, floating data cards.

```css
:root {
  --bg: #08090b;           /* near-black base */
  --surface: rgba(24, 26, 31, 0.72);   /* frosted shell fill */
  --surface-raised: rgba(38, 41, 48, 0.78);
  --edge: rgba(255, 255, 255, 0.10);   /* 1px top-edge highlight */
  --edge-strong: rgba(255, 255, 255, 0.22);
  --ink: #f4f5f7;
  --ink-muted: #a1a7b3;   /* contrast floor — do not go dimmer */
  --accent: #60a5fa;
  --blur: 18px;
}
```

**Signature motif:** a 1px gradient-border wrapper with a *darker* translucent fill
inside it. The edge stays crisp precisely because the interior is darker than the
border — invert that and the shell reads as flat. Pair with `backdrop-filter: blur(var(--blur))`.

Layout: left nav / central stage / right operational sidebar, centered max-width
shell with thin vertical rails. Keep the center calm; cards support it.

**Always** provide a non-blur fallback — `backdrop-filter` fails in more places than
people assume:
```css
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: rgba(20, 22, 27, 0.94); }
}
```

### 2. `dark-technical-framed`
Engineered monochrome. Identity comes from **frame logic**, not soft floating cards.

```css
:root {
  --bg: #0a0a0a;
  --panel: #121214;
  --panel-raised: #1a1a1e;
  --line: rgba(255, 255, 255, 0.12);
  --line-strong: rgba(255, 255, 255, 0.28);
  --ink: #fafafa;
  --ink-muted: #8b8b93;
  --accent: #e4e4e7;   /* monochrome by default; brand accent used sparsely */
}
```

**Signature motif:** vertical rails that **overshoot the shell** — extend guide lines
slightly past the container's top/bottom edge, plus tiny corner squares marking the
boundary. That overshoot is what reads as "engineered" rather than "bordered".

Layout: asymmetrical panel grid (large hero region + smaller utility/visualization
panel), separated by thin dividers. Active list rows get a left-edge bar, brighter
text, subtle translucent fill; inactive rows stay outlined and low-contrast.
Uppercase mono labels with tracking for section codes and metadata.

### 3. `cobalt-contrast-dark`
High-contrast dark with a saturated blue lead. Louder than `dark-glass-workspace`.

```css
:root {
  --bg: #05070d;
  --surface: #0d1220;
  --edge: rgba(96, 165, 250, 0.24);
  --ink: #f8fafc;
  --ink-muted: #94a3b8;
  --accent: #2563eb;
  --accent-hot: #dbeafe;   /* near-white core for beams/highlights */
}
```

**Signature motif:** if using a beam or laser accent, **separate core thickness from
glow width** — a thin near-white core (~2–5px) with a wide soft halo (~30–40px).
Thickening the core to get more glow is the classic mistake; it reads as a smear.
Keep the core near-white, not saturated; let the halo carry the hue.

### 4. `matte-accent-dark`
Dark neutral base with one confident accent hue. Hue is a parameter.

```css
:root {
  --bg: #0b0b0c;
  --surface: #16161a;
  --line: rgba(255, 255, 255, 0.10);
  --ink: #fafafa;
  --ink-muted: #8f8f98;
  /* pick one: emerald #10b981 · lime #a3e635 · fuchsia #d946ef · violet #8b5cf6 */
  --accent: #10b981;
}
```

**Signature motif:** accent appears in **exactly three roles** and nowhere else —
active state, one focal number/metric, primary CTA. Everything else is neutral.
The restraint is the style; accent everywhere collapses it into generic dark mode.

### 5. `warm-paper-light`
Warm off-white surfaces framed by a darker outer shell. Tactile, not stark.

```css
:root {
  --page: #1c1a17;        /* dark outer field */
  --paper: #f7f3ec;       /* warm interior — never #fff */
  --paper-sunk: #ece6db;
  --line: rgba(28, 26, 23, 0.14);
  --ink: #21201d;
  --ink-muted: #6b665d;
  --accent: #c2410c;
  --radius-shell: 24px;
}
```

**Signature motif:** two-zone composition — a large rounded light container holding
the whole experience, placed on a darker page background. The frame is the idea.
Add low-contrast diagonal texture on large paper regions and small L-bracket corner
details. Sans-serif for UI, mono for timestamps/captions/metadata.

### 6. `beige-minimal-light`
Quiet warm minimalism. Fewer elements, more space, no framing device.

```css
:root {
  --bg: #faf8f4;
  --surface: #ffffff;
  --line: rgba(30, 27, 22, 0.10);
  --ink: #1c1917;
  --ink-muted: #78716c;
  --accent: #1c1917;   /* accent is usually just ink — near-monochrome */
}
```

**Signature motif:** generous whitespace as the primary structural tool, one
type-scale jump larger than feels comfortable for headings, and hairline dividers
instead of cards. If it needs a card, it probably needs less content.

### 7. `editorial-grid`
Magazine composition + precision detailing. Asymmetry is mandatory.

```css
:root {
  --bg: #0e0e10;          /* works dark or light — swap ink/bg */
  --ink: #f5f5f4;
  --ink-muted: #a3a3a3;
  --line: rgba(255, 255, 255, 0.14);
  --accent: #eab308;
  --col: 12;
  --margin: clamp(24px, 5vw, 64px);
}
```

**Signature motif:** cinematic horizontal media bands that **cut across the grid** and
overlap adjacent columns in a controlled way. Centered hero blocks are forbidden —
oversized headline on one side, compact supporting copy offset from it.

Details that carry it: hover scale ≤ `1.02`, `cubic-bezier(.22,.61,.36,1)` easing,
45–70ms stagger, mono counters and chapter markers, fine grid traces.
Never make hover the *only* affordance.

### 8. `archival-book-serif`
Serif-led reading surface inside a darker catalog shell.

```css
:root {
  --shell: #17161c;
  --paper: #efe7d7;
  --paper-shade: #e2d8c4;
  --ink: #24211c;
  --ink-muted: #6d655a;
  --accent: #7c2d12;   /* oxblood; bronze/antique gold also valid */
  --leading-body: 1.75;
}
```

**Signature motif:** the two-zone book surface — a centered folio/spread with a
**center crease treatment**, paper gradients, edge shadows, and slight tonal
variation between pages, laid inside a dark interface frame. Mono sidebar index with
grouped chapter entries. Scholarly details earn their place here: drop caps,
marginalia, folio markers, citations.

### 9. `wireframe-diagnostic`
Deliberately unfinished, blueprint-like. Structure exposed on purpose.

```css
:root {
  --bg: #fbfbfa;
  --line: #d4d4d8;
  --line-active: #18181b;
  --ink: #18181b;
  --ink-muted: #71717a;
  --accent: #dc2626;
  --font-ui: ui-monospace, "SF Mono", Menlo, monospace;
}
```

**Signature motif:** visible measurement — dimension labels, crossed placeholder
boxes, dashed bounding lines, annotation callouts. Mono everywhere. Use when
communicating *structure* (specs, docs, architecture), never for a polished
marketing surface.

---

## Universal rules

These outrank the palette. A preset applied without these still looks generic.

**Surface ladder.** Never collapse background / card / popover / raised into one
color. Each level up gets *lighter* in dark mode and *more separated* in light mode.
Flat equals cheap. In dark mode give every neutral a faint tint toward the accent
hue (a 217° blue-charcoal under a blue accent) rather than pure gray.

**Contrast floor.** Muted text stops at the value given per preset. Dimmer "looks
more premium" in a design tool and fails in daylight and in WCAG. Body text ≥ 4.5:1,
large text ≥ 3:1.

**Accent discipline.** One accent. Three roles maximum (active state, focal figure,
primary CTA). A second accent needs an explicit semantic reason (success/danger).

**Depth is directional.** Light from above: brighter top edge, darker lower edge,
shadow below. Consistent across every component or the whole surface reads wrong.
Avoid pure-black shadows — tint them toward the surface hue.

**Motion is calm.** 160–240ms for controls, 400–760ms for masked reveals and section
entrances. Parallax capped under 5%. Never bouncy in a premium system.
Always honor reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Texture is felt, not seen.** Grain, diagonal patterning, and noise sit at very low
opacity. If you notice it as texture, halve it. Reduce or drop it on small controls.

**One material system.** Do not mix glass, skeuomorphic, neumorphic, and framed
treatments in one component or one screen.

## Related skills

- `beautiful-shadows` — exact layered elevation shadows (use instead of ad-hoc `box-shadow`)
- `container-lines` — the rails/corner-square motif, implemented in CSS
- `framed-grid-layout` — L-bracket frames via layered gradients
- `glass-dark-ui` — deeper implementation of the `dark-glass-workspace` preset
- `mesh-gradient-dark-blue-clean` — animated mesh background for the dark presets
- `skeuomorphic-ui` — tactile/pressed surfaces (a different material system)
- `css-border-gradient` — the 1px gradient-border wrapper technique

## Quick checks

- Can you name which preset this is from a screenshot? If not, the motif is missing.
- Is the surface ladder visible — at least three distinguishable levels?
- Is the accent in three places or twenty?
- Does muted text pass 4.5:1?
- Is there exactly one material system on screen?
