# Notice — minimal-zine-poster

`minimal-zine-poster` is adapted from **[LiamGvchi/gc-minimal-zine-poster](https://github.com/LiamGvchi/gc-minimal-zine-poster)**.

**Original license:** MIT — see [`LICENSE-liamgvchi`](LICENSE-liamgvchi)
**Copyright:** 2026 LiamGvchi

## What was adopted

The upstream repo publishes one standalone **Codex** skill: a prompt compiler that turns a
theme into a minimal Japanese/Korean zine-style editorial poster prompt, plus a generated
image. The compiler's substance was adopted largely intact — its value is that it isn't a
mood board. It carries real numeric constraints (negative space 70–90%, cluster 8–25%,
color anchor 0.8–2.5% of canvas), a banned-wording list that stops the model from
desaturating the accent, and a five-axis variation engine that prevents every output
collapsing into the same composition.

The six upstream example JPEGs were **not** vendored — they are the author's generated
outputs and aren't needed for the skill to function.

## Modifications made on adoption

**Ported from Codex to Claude Code:**

- Renamed `gc-minimal-zine-poster-v0-1` → `minimal-zine-poster`. The `gc-` prefix and the
  versioned slug are Codex conventions; this repo uses plain kebab nouns.
- Rewrote the `description` frontmatter as a Claude activation trigger. Codex invokes by
  explicit `$name`, so upstream's description could assume the user had already chosen the
  skill. Claude activates autonomously from the description, so it now enumerates the
  concrete phrasings that should fire it.
- Replaced "use the built-in image generation capability" with `scripts/generate.sh`.
  Claude Code has no built-in image generation, so following that instruction verbatim
  would have made the skill silently prompt-only — losing the generate → inspect →
  regenerate loop that is half its value.

**Removed as vestigial:**

- The entire "Standard Mode" framing. Upstream defines exactly one mode, opens its workflow
  with "Determine mode → Use Standard Mode", then qualifies ~30 rules with "In Standard
  Mode". About 15% of the file was a branch that never branches.
- The "Visual Rules Used by the Prompt Compiler" section. Its five Chinese rule-group
  headings (`风格总述`, `核心视觉规则`, `稳定共性`, `可替换变量`, `反向约束`) point at
  sections of a source document that was never published in the repo, so they resolved to
  nothing. The First-Principles Fields immediately below already carry that content.

**Changed:**

- Translated the output format from Chinese headings (`生成图` / `最终 Prompt` / `说明`) to
  English, and replaced the Chinese-only example requests. Upstream is trilingual
  (EN/zh-CN/ja READMEs); this is an audience change, not a correction.
- Added a short statement of the style's two failure modes — density creep and accent
  washout — at the top. Upstream's rules all guard against these but never name them, so
  the numeric thresholds read as arbitrary until you know what they're for.
- Capped the regenerate loop at one retry with an explicit instruction to report what's
  still wrong rather than continue. Upstream says "regenerate once" in two places without
  saying what to do if the second attempt also fails.
- Documented that a missing `GEMINI_API_KEY` yields a partial result to be described as
  such, rather than a silent prompt-only response.

## Aspect ratio deviation

The style specifies a 3:5 canvas. The Gemini image API does not offer `3:5` — supported
tall ratios are `2:3`, `3:4`, `4:5`, and `9:16`. The script defaults to `9:16` (0.5625) as
the nearest match to 3:5 (0.6); `4:5` (0.8) reads visibly too square for this poster style.
Override with `ZINE_ASPECT`. The SKILL.md instructs the compiler not to restate pixel
dimensions in the prompt, since the ratio is set through the API rather than the text.
