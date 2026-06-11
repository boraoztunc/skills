---
name: adversarial-review
description: Adversarially review a code change — assume it's broken, try to break it, and only report findings that survive an independent refutation pass. Use when the user wants a deep, skeptical review of a diff, PR, or branch ("adversarial review", "try to break this", "find what's wrong before I ship", "review this like a skeptic", "what will break in production"). Scales from a single inline pass to a multi-agent fan-out (one skeptic per domain → adversarial verify → synthesis). Distinct from a normal code review: it leads with concrete failure scenarios over style, distrusts the tests, and is honest about what it could not verify.
---

# Adversarial Review

A normal review confirms a change looks right. An **adversarial** review assumes it is
broken and tries to prove it — then refuses to trust its own findings until each one
survives an independent attempt to refute it. The output is not "looks good" or a list
of nitpicks; it is a ranked set of *concrete failure scenarios that withstood scrutiny*,
plus an honest account of what could not be checked.

Use this when the cost of a missed bug is high: before shipping, on a large or
half-finished diff, on a new code path with no test history, or any time the user says
"try to break this."

## The stance (this is the whole skill)

Adopt these as hard rules for the duration of the review:

1. **Assume it's broken until proven otherwise.** A review that finds nothing is a
   *failed* review unless you can show you tried hard to break it. Your job is to find
   the input that crashes it, the sequence that corrupts data, the change that silently
   regresses a fixed bug.
2. **Distrust the tests.** Passing tests prove the *tested paths* work — not that the
   change is correct. Ask what *isn't* tested. Look for assertions that would still pass
   if the code were wrong, or tests weakened to make the diff go green.
3. **Distrust comments and commit messages.** Review what the code *does*, not what it
   claims. If a comment says "killed on exit," verify the kill actually fires.
4. **Every finding is a failure scenario, not an opinion.** "This could be cleaner" is
   not a finding. "This panics on a 0-byte file because `extractMeta` unwraps the page
   count" is. Each finding needs: concrete inputs/sequence → observed bad outcome, and a
   `file:line`.
5. **Lead with correctness.** Data loss, crashes, regressions, security, race conditions
   first. Quality/clarity findings are a separate, lower section.
6. **Be honest about coverage.** Never imply you checked more than you did. End every
   review with what you could *not* verify (paths you couldn't reproduce, anything that
   needs the app running, cited lines you couldn't confirm).

## Method

### 1. Stabilize the target

Pin down exactly what you're reviewing so findings cite a stable state and the user can
revert cleanly.

- **Working-tree changes:** snapshot them onto a branch (`git checkout -b
  review/<topic> && git add -A && git commit`), or note the exact `git diff` range. This
  prevents findings from drifting as the tree changes and lets the user restore easily.
- **A PR:** review `git diff <base>...<head>` (three-dot — the changes the PR introduces).
- Read the **full diff** plus enough surrounding code to know the invariant each hunk
  touches. Never review a hunk in isolation.

### 2. Discover the invariants

The highest-value bugs violate a rule the codebase already established. Before reviewing,
spend a few minutes learning the project's rules — do **not** invent generic ones:

- Read `CLAUDE.md` / `AGENTS.md` / `README` / `docs/` for documented invariants,
  "this was the bug, keep it" notes, architecture rules, and gotchas.
- Skim recent commit messages and the tests for behavior the project treats as
  load-bearing.
- A diff that violates a documented invariant is a **bug**, even if it compiles and
  tests pass. Cite the invariant in the finding.

### 3. Discover the domains

Split the diff into independent failure domains so each gets focused, deep attention
instead of one shallow context-switching pass. Derive the split from *this* diff — common
cuts:

- By **language / layer** (backend vs frontend vs schema/migration).
- By **brand-new code** (a fresh module/importer/parser with no test history is its own
  domain — it's where invariants are most likely unhonored).
- By **cross-cutting boundary** (API/IPC contracts: a signature changed on one side but
  not the other — compiles in each language, breaks at the boundary; a new command not
  registered; a missing capability/permission; docs claiming behavior the code lacks).

For each domain, hunt for the failure modes that domain is prone to. A starting
checklist (extend per project):

- **Data integrity:** idempotency (re-run duplicates rows?), dedup keys that don't
  compose, partial writes on error, schema/contract drift, nullable fields assumed
  non-null.
- **Resource & lifecycle:** leaked processes/handles/listeners, per-request clients that
  should be shared, work that should stop on cancel/unmount but doesn't, O(n²) hidden in
  a loop, locks held across I/O or parsing.
- **Network & trust:** SSRF (guard the initial host *and every redirect hop*), missing
  size/time caps, unvalidated input reaching a query (injection), secrets cleared on a
  transient failure when they should be kept.
- **Concurrency / state:** stale closures, missing effect deps, optimistic UI desyncing
  from the persisted write, double-invocation under StrictMode, races between batches.
- **Input robustness:** empty / huge / malformed / Unicode / multibyte input; offsets
  computed on one string and applied to another; unwraps/panics on bad input.

### 4. Verify before you believe (the adversarial pass)

This is what separates an adversarial review from a thorough one. **Do not report a
finding until you've tried to refute it.** For each candidate finding, take the opposite
side: read the cited code and surrounding context and ask —

- Does the failure actually reproduce? Construct the concrete repro if you can.
- Is there an existing guard the first pass missed? Is the cited line even reachable?
- Is the severity inflated?

Default to **refuted** unless you can confirm the exact failure path. When the domains
are large or correctness matters a lot, give each finding to a *fresh* perspective (a
separate agent, or a deliberate second pass) prompted to *refute* it — independence
catches the plausible-but-wrong findings that confirmation bias keeps. For findings that
can fail in more than one way, verify along distinct lenses (does-it-reproduce /
security / does-the-guard-hold) rather than re-checking the same way N times.

Only findings that *survive* refutation go in the report. Track refuted ones too — "I
checked X and it's actually guarded at line N" is useful signal.

### 5. Synthesize honestly

Produce a tight report:

1. **One-line verdict** on the change's overall risk.
2. **Findings by severity** (Critical → Low). Each: title, `file:line`, the concrete
   failure scenario, the violated invariant/expectation, and a one-line fix direction.
   Flag low-confidence survivors as "needs a human check."
3. **Single most likely thing to break in production** — the one finding that fires on
   the most common path, even if it's not the most severe.
4. **What could not be verified** — paths you couldn't reproduce, anything needing the
   app running, cited lines you couldn't confirm, areas out of scope. Be specific; never
   imply coverage you didn't achieve.

## Scaling

Match effort to the request and the stakes:

- **Quick / small diff:** one inline adversarial pass — find, then a deliberate refute
  pass on each candidate, then synthesize. No orchestration needed.
- **Larger diff or "be thorough / audit this":** spawn one skeptic agent per discovered
  domain (use the Agent tool, or a Workflow if the user has opted into multi-agent
  orchestration), each loaded with the discovered invariants; verify each finding with an
  independent refuter; synthesize the survivors. A parameterized Workflow template that
  encodes exactly this — discover → per-domain skeptics → adversarial verify →
  synthesis — is in [`workflow.js`](workflow.js). Treat it as a starting point:
  fill in the discovered domains and invariants, don't ship the placeholders.

Note: the Workflow path requires the user to have opted into multi-agent orchestration
(e.g. "ultracode", "use a workflow", or an explicit ask). Without that, run the inline
path or a handful of Agent calls — never silently fan out dozens of agents.

## Anti-patterns (don't do these)

- Reporting a finding you didn't try to refute.
- Padding the report with style nits to look thorough — they bury the real bugs.
- "Looks good to me" with no account of what you actually probed.
- Trusting a green test suite as proof of correctness.
- Inventing generic invariants instead of reading the project's actual rules.
- Claiming coverage of areas you never opened.
