# NOTICE — jakubkrehel/skills

The following skills are vendored from [jakubkrehel/skills](https://github.com/jakubkrehel/skills)
by Jakub Krehel ([jakub.kr/skills](https://jakub.kr/skills), [interfaces.dev](https://interfaces.dev)):

- `better-accessibility/`
- `better-colors/`
- `better-interface/`
- `better-layout/`
- `better-typography/`
- `better-ui/`
- `better-writing/`
- `interface-review/`

Licensed under the terms in `LICENSE-jakubkrehel`.

## Local modifications

- Skills are vendored **flat at the repository root** rather than nested under
  `skills/`, to match this repository's existing layout.
- The `agents/openai.yaml` adapter files were removed from each skill. They
  target Opencode/Codex; this repository consumes skills through Claude Code
  only.

No changes were made to any `SKILL.md` or reference file content.

## Relationship to `make-interfaces-feel-better`

`better-ui` is the maintained descendant of the earlier
`make-interfaces-feel-better` skill (shared `surfaces.md`, `animations.md`, and
`performance.md` lineage). That skill was removed from this repository when
`better-ui` was installed — keeping both would have put two near-identical
skills in competition for the same triggers, which degrades routing.

## Upstream sync

Upstream ships a Claude Code plugin marketplace. This repository deliberately
vendors instead, so the skills travel with it. To refresh:

```bash
git clone --depth 1 https://github.com/jakubkrehel/skills /tmp/jk
for s in better-accessibility better-colors better-interface better-layout \
         better-typography better-ui better-writing interface-review; do
  rm -rf "$s" && cp -R "/tmp/jk/skills/$s" "$s" && rm -rf "$s/agents"
done
```
