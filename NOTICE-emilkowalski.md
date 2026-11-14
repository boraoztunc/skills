# NOTICE — emilkowalski/skills

Vendored from [emilkowalski/skills](https://github.com/emilkowalski/skills)
(upstream commit `0f2e23b`, 2026-11-13) by Emil Kowalski. Licensed under the
terms in `LICENSE-emilkowalski` (MIT).

Skills: `animate`, `animate-expo`, `animation-performance`,
`animation-vocabulary`, `apple-design`, `ask-sonner`, `break-ui`,
`choreograph`, `emil-design-eng`, `find-animation-opportunities`, `gestures`,
`improve-animations`, `learn-taste`, `mobile-native`, `pick-ui-library`,
`prototype`, `remove-animations`, `review-animations`.

`apple-design` and `emil-design-eng` replace older copies (apple-design was
vendored 2026-07-09; emil-design-eng came from `npx skills` into
`~/.agents/skills`). The update carries upstream corrections, e.g. Motion
springs default to `bounce: 0` (Motion's `damping` is a physics coefficient,
not Apple's damping ratio) and `will-change` only after measuring.

## Not vendored

- `write-swift` — sound, but no project here has meaningful Swift (one
  320-line Tauri sidecar). Add it if that changes.

## Local modifications

- Flat at the repository root, not under `skills/`, to match this layout.
  Cross-references (`../animation-performance/SKILL.md`) still resolve because
  the siblings sit side by side.
- `improve-animations` description: removed the `"make this app feel better"`
  trigger. `better-ui` owns "make it feel better"; routing that phrase to a
  full read-only motion audit would be the wrong default.

Upstream "Initial Response" greeting blocks are kept as-is (they only fire on a
bare `/skill` invocation with no question).

## Upstream sync

```bash
git clone --depth 1 https://github.com/emilkowalski/skills /tmp/ek
for s in animate animate-expo animation-performance animation-vocabulary \
         apple-design ask-sonner break-ui choreograph emil-design-eng \
         find-animation-opportunities gestures improve-animations learn-taste \
         mobile-native pick-ui-library prototype remove-animations review-animations; do
  rm -rf "$s" && cp -R "/tmp/ek/skills/$s" "$s"
done
# re-apply the improve-animations description edit above
```

Impeccable refresh: `cp -R <impeccable>/.claude/skills/impeccable/. impeccable/`
after clearing the folder, plus `.claude/agents/*.md` → `impeccable/agents/`
(keep `LICENSE` and `NOTICE.md`).
