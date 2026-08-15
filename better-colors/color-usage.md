# Color Usage

How to deploy color once the system exists: meaning, emphasis, gradients, and appearance variants. For picking the values, see [palette-generation.md](palette-generation.md); for naming them, see [token-naming.md](token-naming.md); for checking pairs, see [contrast.md](contrast.md).

## One color, one meaning

Use a color for one purpose — interactive, destructive, featured — across the whole interface. If the accent signals that text is interactive, that hue on non-interactive text tells users to click something that is not clickable. Treat anything within about 15° of hue as the same color for this purpose; users do not perceive a near-miss as a different color, only as a slightly different shade of the same one.

```css
/* Bad: the accent means both "link" and "decorative heading" */
a { color: #3b82f6; }
.section-title { color: #4f8ef7; }

/* Good: interactive elements own the accent; headings stay neutral */
a { color: var(--color-accent-text); }
.section-title { color: var(--color-text-primary); }
```

The rule runs in both directions. A color that means one thing must also not be *absent* where that thing occurs: if the accent means interactive, an interactive element rendered in neutral is just as misleading.

Color is never the only carrier of meaning — pair it with an icon, a label, or a shape. `better-accessibility` owns that requirement.

## Use tokens in their role

Apply a semantic token only for the role it names. `--color-text-secondary` is muted foreground text; using it as a background breaks every future theme change that assumes the role, because the value that happened to work as both will stop working as both.

```css
/* Bad: separator token repurposed as a text color because it looked right */
.caption { color: var(--color-border); }

/* Bad: text token repurposed as a background */
.tag { background: var(--color-text-secondary); }
```

If a role has no token yet, add the token. Never borrow one by value — the role inventory in [token-naming.md](token-naming.md) is the list of roles a system needs.

## One colored action per view

When the product uses a filled color to encode primary emphasis, give that treatment to one primary action in the current decision context and leave peer actions neutral. Multiple colored backgrounds are fine when they encode distinct states or categories rather than competing as peer actions. Preserve an established component hierarchy that communicates emphasis another way; do not recolor controls merely to impose this recipe.

```html
<!-- Good: one filled primary action, neutral secondaries -->
<button class="bg-accent-solid text-white">Save</button>
<button class="text-neutral-700">Cancel</button>

<!-- Bad: every action colored, so nothing is primary -->
<button class="bg-accent-solid text-white">Save</button>
<button class="bg-accent-solid text-white">Duplicate</button>
<button class="bg-accent-solid text-white">Export</button>
```

Put the color on the background, not the label: a filled button reads as primary from across the room, while accent-colored label text on a neutral button reads as a link. Selected states — an active tab, a checked segment — may use the accent on the glyph and label; that is state, not emphasis.

## Gradients

**The interpolation space is a look, not a correctness setting.** Three are worth knowing, and the difference between them is most visible in the middle of the gradient:

```css
/* sRGB — the default and the classic. Midpoint darkens and mutes. */
background: linear-gradient(#3b82f6, #ec4899);

/* oklab — even brightness across the transition. The best default. */
background: linear-gradient(in oklab, #3b82f6, #ec4899);

/* oklch — travels around the hue wheel, staying vivid throughout. */
background: linear-gradient(in oklch, #3b82f6, #ec4899);
```

`oklab` and sRGB are **rectangular**: they interpolate in a straight line through the color space. `oklch` is **polar**: it interpolates the hue angle, so it arcs around the wheel and passes through every hue between the two stops. That is why it stays saturated, and also why it can produce hues nobody asked for — a blue-to-pink gradient routes through purple, which may be exactly the look or may be a surprise.

**The gray dead zone is a rectangular-space problem.** Two hues on opposite sides of the wheel sit on either side of the neutral axis, so a straight line between them passes near gray and the middle goes lifeless. Two fixes: switch to a polar space, which routes around the axis instead of through it, or add a third stop at a hue between the two and keep the space you have.

With a polar space you also control which way it goes around:

```css
/* The short way round — usually what you want */
background: linear-gradient(in oklch shorter hue, #3b82f6, #ec4899);

/* The long way — sweeps most of the spectrum */
background: linear-gradient(in oklch longer hue, #3b82f6, #ec4899);
```

**Banding shows up on large areas.** A gradient spanning a hero section with little contrast between its stops will step visibly on 8-bit displays. Widen the contrast between stops, shrink the area, or overlay a subtle noise texture.

**Keep text off gradients where you can.** Contrast varies continuously across a gradient, so a single measurement does not describe it. If text must sit on one, measure against the worst region rather than the average, or put a scrim behind it.

## Color across cultures

Color meaning is not universal. If a color is load-bearing — finance, status, alerts — verify the meaning holds in every locale you ship to.

| Color | Common Western reading | Elsewhere |
| --- | --- | --- |
| Red | Danger, loss, errors | Luck, prosperity; **gains** in Chinese financial UIs |
| Green | Success, gains, go | Losses in Chinese financial UIs |
| White | Purity, cleanliness | Mourning in parts of East Asia |
| Gold | Premium, luxury | Religious significance in some regions |

The classic case: stock tickers show gains in green for English locales and in red for Chinese ones. If the product localizes into such markets, make gain and loss per-locale tokens rather than hardcoded values.

## Light, dark, and increased contrast

Every custom color needs a light and a dark variant; deriving the dark appearance is covered in [palette-generation.md](palette-generation.md). Beyond that, users who enable increased contrast expect visibly stronger differentiation:

```css
:root {
  --color-accent-solid: #3b82f6;
}

@media (prefers-color-scheme: dark) {
  :root { --color-accent-solid: #60a5fa; }
}

@media (prefers-contrast: more) {
  :root { --color-accent-solid: #1d4ed8; }
}
```

The increased-contrast variant widens the foreground/background gap by at least 15 points of perceived lightness over the default, then gets re-verified against APCA's preferred thresholds (Lc 90 body, Lc 75 non-body). Widening the gap without remeasuring is not the same as fixing it.
