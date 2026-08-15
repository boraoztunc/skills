# Palette Generation

Producing the values once the structure is decided. For which ramps to build and what each step is for, see [palette-structure.md](palette-structure.md).

## Start from the brand color

A brand color arrives as a single value, usually a hex. Two decisions come before any ramp exists:

**Which step does it occupy?** A brand color meant for buttons and links belongs on the solid-fill step — `500` in a Tailwind ramp, `9` in a Radix one. Placing it there means `bg-brand-500` renders the actual brand color rather than an approximation of it.

**Is it pinned or snapped?** If the brand color is contractually fixed, pin it: it stays exact and the ramp is built outward from it, accepting slightly uneven spacing at that step. Otherwise snap it — nudge it onto the ramp so every step is evenly spaced, which is almost always the better-looking result and is invisible to everyone who has not held a swatch against the screen.

If the brand color fails contrast as a fill behind white text, it is still the brand color; it is just not the solid-fill step. Put it where it lands and use a darker step for interactive fills. Do not quietly darken the brand.

## What a correct ramp looks like

These are properties of the finished ramp, checkable against any output, in any notation:

- **Steps are evenly spaced in perceived lightness.** Not in the number your format happens to call "lightness" — HSL's lightness is not perceptual, and evenly spaced HSL values produce a ramp that bunches at one end.
- **Hue is constant end to end.** Every step is recognisably the same color. A ramp whose hue wanders reads as two colors blended, and it will not sit correctly against a neutral built on a different hue.
- **Vividness peaks in the middle and falls off at both ends.** The lightest and darkest steps are nearly neutral; the middle steps carry the color. A ramp that holds full vividness into the extremes produces a `50` that glows and a `950` that looks like ink spilled on the brand.
- **Steps are denser at the light end.** Light backgrounds need finer distinctions than dark ones — `50` to `200` should be close together, `800` to `950` further apart. Evenly spaced lightness across the whole range makes the pale end unusable, because `50` and `100` will not be distinguishable as two different surfaces.
- **No two adjacent steps are indistinguishable.** If `200` and `300` look identical on a calibrated screen, the ramp has more steps than it has decisions. Drop one.
- **Both ends stop short of pure black and white.** Pure black and pure white cannot carry any hue, so a ramp that reaches them loses its identity exactly where the page background lives.

## Use a color library

Do not compute these by hand or by eye. `culori`, `colorjs.io`, and `chroma.js` all convert between every notation, measure perceived lightness, and interpolate perceptually. Read the brand color in whatever format it arrives, do the math in a perceptual space, and emit the notation the project already uses:

```js
import { formatHex, interpolate, samples } from 'culori'

// Perceptual interpolation, hex in and hex out.
const ramp = interpolate(['#eff6ff', '#3b82f6', '#172554'], 'lab')
const steps = samples(11).map((t) => formatHex(ramp(t)))
```

The output format is the project's choice; for a ramp the interpolation space is not, because the steps have to land evenly in perceived lightness and sRGB interpolation is what produces muddy mid-steps. Decorative gradients are the opposite case, where the space is a deliberate look ([color-usage.md](color-usage.md)).

```css
:root {
  --brand-50: #eff6ff;
  --brand-100: #dbeafe;
  --brand-200: #bfdbfe;
  --brand-300: #93c5fd;
  --brand-400: #60a5fa;
  --brand-500: #3b82f6;
  --brand-600: #2563eb;
  --brand-700: #1d4ed8;
  --brand-800: #1e40af;
  --brand-900: #1e3a8a;
  --brand-950: #172554;
}
```

## Several hues at once

When a system has an accent plus status ramps, the ramps must agree step for step: `danger-500` and `brand-500` should read as equally bright and equally vivid, or a red button will look heavier than a blue one at the same step.

- **Match perceived lightness exactly.** Same step, same brightness, across every hue.
- **Match vividness relatively, not absolutely.** Hues do not have the same maximum vividness — a saturated yellow and a saturated blue are not equally far from gray, and no format makes them so. Set each ramp to the same *proportion* of what its own hue can reach. Copying one ramp's saturation number onto another hue makes one of them look washed out.

Yellows and cyans are the usual casualties: both peak much lower than reds and blues, so a status ramp built by copying numbers will have a warning color that looks weak next to the danger color.

## Dark mode

A dark palette is not the light palette reversed. Reversal is the starting point, not the output.

Swap the semantic roles first, then tune the values:

```css
:root {
  --color-bg: var(--brand-50);
  --color-text: var(--brand-950);
}

.dark {
  --color-bg: var(--brand-950);
  --color-text: var(--brand-50);
}
```

Three things almost always need hand-tuning after the swap:

- **Vividness comes down.** A saturated color that reads as confident on white reads as neon on near-black. Dark appearances generally need the accent a step or two less vivid.
- **The dark end needs more separation.** Steps that were distinguishable as pale backgrounds collapse into each other as dark surfaces.
- **Contrast does not survive the mirror.** A pair passing in light mode can fail reversed, because contrast is not symmetric. Recheck every foreground against its actual background in both appearances — see [contrast.md](contrast.md).

### Choosing the switching mechanism

Pick one and use it throughout:

- **`prefers-color-scheme` alone** — correct when the product has no theme toggle. Nothing to persist, nothing to hydrate.
- **A `.dark` class** — required as soon as users can override the system setting. The media query then only sets the initial value.
- **`light-dark()`** — collapses both values into one declaration and is the least code when the project also sets `color-scheme`. It reads the `color-scheme` property, not a class, so a class-based toggle must set `color-scheme` too.

```css
:root {
  color-scheme: light dark;
  --color-bg: light-dark(#ffffff, #172554);
}
```

Mixing mechanisms is the common failure: a media query setting some tokens and a class setting others gives a half-themed interface the moment a user overrides their system preference.
