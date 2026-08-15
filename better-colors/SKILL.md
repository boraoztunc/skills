---
name: better-colors
description: Color systems for digital products, from building and naming a palette to applying it with meaning and verifying contrast. Use when creating or extending a color palette, naming color tokens, theming light and dark appearances, auditing the colors in a codebase, or reviewing frontend code for color. Triggers on color palette, palette generation, color scale, color ramp, brand color, accent color, neutral palette, gray palette, status colors, design tokens, semantic color tokens, token naming, theming, dark mode colors, contrast ratio, APCA, gamut, display p3, oklch, color conversion, gradients, color meaning, increased contrast.
---

# Colors

A color system is a small set of ramps, named by role, applied consistently, and verified against the backgrounds they actually render on. Almost every color problem is a system problem: a value picked in isolation, a token borrowed because it looked right, or a pair nobody measured. Contrast requirements belong to `better-accessibility`; surfaces, shadows, and icon color belong to `better-ui`.

## Quick Reference

| Category | When to use | Reference |
| --- | --- | --- |
| Structure | Which ramps a system needs, step roles, neutrals, status colors, auditing an existing palette | [palette-structure.md](palette-structure.md) |
| Generation | Building a ramp from a brand color, multi-hue systems, dark mode | [palette-generation.md](palette-generation.md) |
| Naming | Primitive and semantic tiers, role inventory, naming grammar, anti-patterns | [token-naming.md](token-naming.md) |
| Usage | One meaning per color, emphasis, gradients, culture, appearance variants | [color-usage.md](color-usage.md) |
| Contrast | APCA and WCAG checks, reporting failures, fixing on request | [contrast.md](contrast.md) |
| Formats | Choosing a notation, converting, gamut and P3 fallbacks | [color-formats.md](color-formats.md) |
| Review output format | Severity scale, findings table, verification, verdict | [review-output.md](review-output.md) |

## Core Principles

### 1. Match the Project's Color System

Reuse the project's existing tokens and notation. Introducing a second color representation to fix one value makes the palette harder to reason about, not easier — a consistent hex system beats a hex system with `oklch()` scattered through it. Notation is not a defect. For a genuinely new system, `oklch()` is the best default because its numbers behave the way the ramp rules below describe; everywhere else a color library produces the same ramp in whatever the project writes ([color-formats.md](color-formats.md)).

### 2. A System Is Ramps, Not Colors

One neutral ramp, one accent ramp, and only the status ramps the product actually renders. A `warning` ramp nothing imports is maintenance for zero pixels, and a second accent hue earns its place only when two things must be distinguishable at a glance.

### 3. Every Step Has a Job

A ramp is not a gradient to pick from by eye. Each step exists because a role needs it — page background, component hover, border, solid fill, body text — and a step no role consumes should not be generated. Both the Tailwind `50`–`950` and Radix `1`–`12` conventions map to those roles ([palette-structure.md](palette-structure.md)).

### 4. Name Primitives by Hue, Semantics by Role

Primitives name a value (`--blue-500`) and are never applied in a component. Semantic tokens name a job (`--color-text-secondary`), point at a primitive, and are the only tier components reference. That seam is what makes theming possible; without it, dark mode means auditing every usage to work out which ones meant "the accent" and which just wanted blue ([token-naming.md](token-naming.md)).

### 5. Use a Token Only in Its Role

Never borrow a token because its value is right today. A separator used as a text color works until borders get lighter, and then the text goes with them. If a role has no token, add the token.

### 6. Hold the Hue Across the Ramp

Steps step evenly in *perceived* lightness, hue stays constant end to end, vividness peaks mid-ramp and falls off at both ends, and steps sit denser at the light end than the dark. Both ends stop short of pure black and white, which cannot carry hue at all. Use a color library rather than eyeballing it ([palette-generation.md](palette-generation.md)).

### 7. One Color, One Meaning

Use a color for one purpose across the whole interface, treating anything within `15°` of hue as the same color. If the accent means interactive, that hue on static text tells users to click something that is not clickable — and an interactive element rendered neutral is just as misleading. Color is never the only carrier of meaning; `better-accessibility` owns that requirement.

### 8. Fill Exactly One Action per View

When filled color encodes primary emphasis, one primary action gets it and peer actions stay neutral. Put the color on the background rather than the label: a filled button reads as primary across the room, while accent-colored text on a neutral button reads as a link. Several colored backgrounds are fine when they encode distinct states or categories rather than competing as peers.

### 9. Measure the Rendered Pair, Then Report

Measure a foreground against the background it actually renders on, not the page background. When a pair fails, report it — the pair, its measured value, and the threshold it misses — and leave the colors alone. A project's colors are a design decision; change them only when asked, and remeasure after ([contrast.md](contrast.md)).

### 10. Pick a Gradient's Interpolation Space

The space is a look, not a correctness setting. `in oklab` is the best default — even brightness, no hue surprises. `in oklch` travels around the hue wheel rather than through the middle, staying vivid and sweeping through the hues between the stops: a distinct look, and the fix when a two-hue gradient goes gray in the middle. The sRGB default is the classic, and its darker, muted midpoint is the one most interfaces already look like ([color-usage.md](color-usage.md)).

## Common Mistakes

| Mistake | Fix |
| --- | --- |
| A raw value where the project has a token | Reuse or add the correct role token in the project's existing notation |
| An isolated `oklch()` value dropped into a hex codebase | Preserve the established notation unless a color-system migration is in scope |
| A primitive like `--blue-500` used directly in a component | Point a semantic token at it and use that |
| Token named for its appearance (`--color-blue-button`) or first use (`--color-sidebar-gray`) | Name it for its role: `--color-accent-solid`, `--color-bg-surface` |
| `--color-primary` meaning the brand and `--color-text-primary` meaning body text | Reserve `accent` for the brand; let `primary` mean "most prominent of its group" |
| Semantic token used outside its role (separator as text) | Add a token for the missing role; never borrow by value |
| Ramp built by varying HSL lightness | Rebuild against perceived lightness with a constant hue |
| Ramp spaced evenly across the full range | Tighten the light end; `50` and `100` must be distinguishable as two surfaces |
| Same saturation number reused across hues | Match the same proportion of each hue's own maximum, not the raw value |
| Status hue that collides with the accent hue | Move it until destructive and primary actions are distinguishable side by side |
| Dark mode made by mechanically reversing the light palette | Reverse as a starting point, then reduce vividness, widen the dark end, and recheck every pair |
| `prefers-color-scheme` setting some tokens and a `.dark` class setting others | Pick one switching mechanism and use it throughout |
| Failing contrast | Report the pair, its measured value, and the threshold missed; change colors only when asked |
| Contrast fixed by changing hue | Change lightness — it is the channel contrast responds to |
| P3 color with no sRGB fallback | Declare the sRGB value first, then override inside `@media (color-gamut: p3)` |
| Gradient between opposite hues going gray in the middle | Switch to a polar space (`in oklch`) or add a mid-stop at a hue between the two |
| Palette verified only in light mode | Recheck every foreground/background pair in both appearances |

## Reporting

A standalone color review is finished when every confirmed finding is reported in the format in [review-output.md](review-output.md), with verification and a verdict. Under `better-interface`, its format governs instead.
