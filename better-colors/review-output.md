# Review Output Format

The format for a standalone color review. When `better-interface` orchestrates, it owns the format, severity, consolidation, the cap, and the verdict; hand it domain evidence and findings instead.

Present the standalone review in two parts.

## Findings

Group all confirmed findings by principle. Use a markdown table with **Severity**, **Location**, **Before**, **After**, and **Why** columns. Never use separate "Before:" / "After:" lines.

- **Severity**: `HIGH` makes content unreadable or assigns a misleading semantic color; `MEDIUM` creates a noticeable theme, token, or gamut failure; `LOW` is isolated polish.
- **Location**: cite `path/to/file:line`. If the artifact has no source files, cite the exact screen and component instead.
- **Before / After**: show the current value or token and the exact replacement. For a failing contrast pair, the replacement is a recommendation — report it, do not apply it unasked.
- **Why**: name the violated principle and include the measured contrast, gamut, or step evidence when relevant.

Consolidate a repeated systemic issue into one row and list every affected location. Omit principles with no findings.

### Example

#### Name primitives by hue, semantics by role
| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `src/Card.tsx:12` | `bg-blue-500` applied in the component | `bg-accent-solid`, pointing at `--blue-500` | A primitive used directly leaves no seam to theme through |
| LOW | `src/theme.css:24` | `--color-sidebar-gray` | `--color-bg-surface` | A token named for its first use stops making sense at its second |

#### Measure the rendered pair, then report
| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| HIGH | `src/Banner.tsx:31` | `--color-text-secondary` on `--color-accent-solid`, Lc 38 | Report the pair; body text needs Lc 75 | Measured against the card background, not the accent fill it renders on |
| MEDIUM | `src/theme.css:52` | P3 color with no fallback | Declare the sRGB value first, then override in `@media (color-gamut: p3)` | The color fails outright on non-P3 displays rather than degrading |

## Verification and Verdict

After the findings:

1. **Verification**: list the exact checks run and their observed results, including contrast measurements against the rendered background, gamut checks, and both light and dark appearances. If a check was not run, state what still needs verification.
2. **Verdict**: `Block` if any `HIGH` finding remains, `Needs changes` if only `MEDIUM` or `LOW` findings remain, and `Approve` only when no actionable findings remain.

When there are no findings, omit the tables, state "No actionable color findings", report verification, and end with `Approve`.
