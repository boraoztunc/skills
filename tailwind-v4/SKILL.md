---
name: tailwind-v4
description: Tailwind CSS v4 conventions for real projects — CSS-first configuration with @theme, automatic content detection, the v3-to-v4 migration diffs, and dynamic class-name safety. Use when writing Tailwind utilities, setting up or upgrading Tailwind, defining design tokens as Tailwind theme values, debugging classes that do not generate, or when unsure whether a project is on v3 or v4.
---

# Tailwind CSS v4

## Detect the version first

This is the highest-value step. v3 and v4 configure completely differently, and
guidance for one is actively wrong for the other.

```bash
# Check the installed major version
npm ls tailwindcss --depth=0 2>/dev/null || grep '"tailwindcss"' package.json
```

| Signal | Version |
|---|---|
| `@import "tailwindcss";` in CSS | v4 |
| `@tailwind base; @tailwind components; @tailwind utilities;` | v3 |
| `@theme { }` block in CSS | v4 |
| `tailwind.config.js` with a `content: [...]` array | v3 (or a v4 project using the compat layer) |
| `@config "./tailwind.config.js";` | v4 loading a legacy config |
| `@tailwindcss/postcss` or `@tailwindcss/vite` dependency | v4 |
| `autoprefixer` + `postcss-import` required in postcss config | v3 |

**Never write a `tailwind.config.js` for a v4 project by default.** v4 reads
configuration from CSS. A hand-added config file is silently ignored unless
explicitly loaded with `@config`.

## v4 setup

```css
/* app.css — the single entry point */
@import "tailwindcss";
```

That one line replaces the three `@tailwind` directives, and it also handles
`postcss-import` and `autoprefixer` internally — remove both from the PostCSS config.

Vite:
```js
// vite.config.js
import tailwindcss from "@tailwindcss/vite";
export default { plugins: [tailwindcss()] };
```

PostCSS:
```js
// postcss.config.mjs
export default { plugins: { "@tailwindcss/postcss": {} } };
```

## Configuration is CSS-first

Design tokens go in `@theme`. Every entry generates the matching utilities *and*
exposes a real CSS custom property.

```css
@import "tailwindcss";

@theme {
  --color-brand: oklch(0.62 0.19 250);
  --color-brand-muted: oklch(0.72 0.08 250);
  --font-display: "IBM Plex Sans", sans-serif;
  --radius-card: 14px;
  --spacing-gutter: 2.75rem;
  --ease-out-soft: cubic-bezier(0.22, 0.61, 0.36, 1);
}
```

`--color-brand` yields `bg-brand`, `text-brand`, `border-brand`, … and is readable
anywhere as `var(--color-brand)`. That dual nature is the main v4 win: tokens are no
longer trapped inside a JS config.

Namespaces map to utility families — `--color-*`, `--font-*`, `--text-*`,
`--spacing-*`, `--radius-*`, `--shadow-*`, `--ease-*`, `--animate-*`, `--breakpoint-*`.

Override a whole namespace, or everything:
```css
@theme {
  --color-*: initial;          /* drop the default palette */
  --color-ink: #18181b;
}
```

**No `content` array.** v4 detects source files automatically, honoring
`.gitignore` and skipping binaries. Point it at extra sources only when needed:

```css
@source "../packages/ui/src";           /* add a path outside the project root */
@source not "../legacy";                 /* exclude */
@source inline("bg-red-500 bg-red-600"); /* the v4 replacement for safelist */
```

## Migrating v3 → v4

Run the codemod first, then review the diff:
```bash
npx @tailwindcss/upgrade
```

The renames that break silently:

| v3 | v4 |
|---|---|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `blur-sm` | `blur-xs` |
| `outline-none` | `outline-hidden` |
| `bg-opacity-50` | `bg-black/50` (slash opacity only) |
| `flex-shrink-0` | `shrink-0` |

The bare `shadow` → `shadow-sm` and `rounded` → `rounded-sm` shifts are the dangerous
pair: the old class names still exist but now mean *one step smaller*, so a v3
codebase silently loses a step of elevation and radius everywhere rather than erroring.

Other behavior changes to expect:
- Default border color is now `currentColor`, not `gray-200`. `border` alone inherits
  text color — set the color explicitly.
- Default ring is `1px currentColor`, was `3px` blue. `ring` → `ring-3` to keep v3 sizing.
- Space-between uses a different selector; sibling-margin edge cases can shift.
- Hover only applies where the device actually supports hover.
- Variant stacking now reads left-to-right.

## Dynamic class names

The rule survives from v3, because the scanner still reads source text statically:

```jsx
// BROKEN — never generated
<div className={`text-${color}-500`} />

// CORRECT — complete class names, statically visible
const TONE = {
  danger: "text-red-500",
  success: "text-emerald-500",
};
<div className={TONE[tone]} />
```

v4 does support dynamic *values* on many utilities without config —
`grid-cols-15`, `w-17`, `mt-23` work arbitrarily. What cannot be assembled is the
class *name* string. For genuinely runtime-only values, use an inline style or a CSS
variable, not string concatenation:

```jsx
<div className="w-(--w)" style={{ "--w": `${pct}%` }} />
```

## Practical patterns

**Dark mode.** v4 defaults to `prefers-color-scheme`. For class-based toggling:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

**Component extraction order.** Prefer a real component over `@apply`. When you do
need shared CSS, v4 wants `@utility`:
```css
@utility card {
  border-radius: var(--radius-card);
  background: var(--color-surface);
}
```
Heavy `@apply` use forfeits the point of utilities and inflates CSS — reach for it
last, not first.

**Arbitrary values** stay available for one-offs: `top-[117px]`,
`bg-[oklch(0.7_0.1_200)]`, `grid-cols-[1fr_auto]`.

## Common failures

- Classes not generating → a dynamically-built class name, or a source file outside
  auto-detection (add `@source`).
- A `tailwind.config.js` having no effect → v4 project without `@config`.
- Build errors after upgrade → `postcss-import`/`autoprefixer` still in the PostCSS
  chain; v4 includes both.
- Borders/rings looking wrong post-migration → the `currentColor` and `ring-1`
  default changes above.
- Elevation subtly flattened post-migration → the `shadow`/`rounded` rename shift.

## Related skills

- `visual-style-presets` — pick a direction, then encode its tokens in `@theme`
- `beautiful-shadows` — exact layered shadows as arbitrary utilities
