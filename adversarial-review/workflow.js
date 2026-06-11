// Adversarial-review Workflow template — discover → per-domain skeptics →
// adversarial verify → synthesis. Generalized so it runs on any project.
//
// HOW TO USE
//  1. Stabilize the target first (snapshot the working tree onto a branch, or
//     pick a PR), so `RANGE` below points at a stable diff.
//  2. Replace the two placeholders that depend on the project:
//       - INVARIANTS: the project's actual rules. DISCOVER them — read
//         CLAUDE.md / AGENTS.md / docs / tests / recent commits. Do NOT ship the
//         generic stub below; a diff that violates a real documented invariant is
//         the highest-value finding, and generic rules won't catch it.
//       - DOMAINS: the independent failure domains in THIS diff (see the inline
//         scout step — derive them from `git diff --stat`, don't hardcode).
//  3. Run it via the Workflow tool (requires the user to have opted into
//     multi-agent orchestration). Read the returned report; it is the synthesis
//     of only the findings that survived adversarial verification.
//
// This requires the Workflow runtime (agent/pipeline/parallel/phase/log globals).
// Without multi-agent opt-in, follow SKILL.md's inline path instead.

export const meta = {
  name: 'adversarial-review',
  description:
    'Per-domain adversarial review of a diff — each finding refuted before it survives, then synthesized',
  phases: [
    { title: 'Review', detail: 'one skeptic per failure domain' },
    { title: 'Verify', detail: 'independently refute each finding' },
    { title: 'Synthesize', detail: 'rank the survivors into a report' },
  ],
}

// The diff under review. Set to a PR range (`git diff base...head`) or a branch
// snapshot. Three-dot for PRs (changes the branch introduces).
const RANGE = args?.range || 'git diff main..HEAD'

// ── PROJECT-SPECIFIC: replace with the DISCOVERED invariants ──────────────────
// A diff that violates one of these is a bug even if it compiles + tests pass.
// Read the project's CLAUDE.md/AGENTS.md/docs/tests and list its real rules here.
const INVARIANTS =
  args?.invariants ||
  `
Replace this with the project's actual, discovered invariants — e.g.:
- Idempotency: re-running the importer/migration must never duplicate rows.
- Resource lifecycle: spawned child processes are killed on exit, not dropped.
- SSRF: every outbound fetch guards the host AND re-checks each redirect hop.
- Schema/contract: a column change bumps the version in the same commit.
- (etc. — derive from CLAUDE.md / docs / "this was the bug, keep it" notes.)
`

const STANCE = `You are an ADVERSARIAL reviewer. Do not praise, summarize, or confirm intent. Assume the code is broken until you prove otherwise. Distrust tests (passing => tested paths work, not that the change is correct — ask what ISN'T tested, and whether an assertion would pass even if the code were wrong). Distrust comments and commit messages — review what the code DOES. For every finding give a concrete failure scenario (inputs/sequence -> bad outcome) and file:line. "Could be cleaner" is not a finding. Lead with correctness (data loss, crash, regression, security, races) over quality.`

const FINDINGS_SCHEMA = {
  type: 'object',
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['title', 'severity', 'file', 'line', 'scenario', 'invariant_or_reason', 'fix'],
        properties: {
          title: { type: 'string' },
          severity: { type: 'string', enum: ['Critical', 'High', 'Medium', 'Low'] },
          file: { type: 'string' },
          line: { type: 'string', description: 'line or range, e.g. 142 or 142-150' },
          scenario: { type: 'string', description: 'concrete inputs/sequence -> observed bad outcome' },
          invariant_or_reason: { type: 'string', description: 'the violated invariant or expectation' },
          fix: { type: 'string', description: 'one-line fix direction' },
        },
      },
    },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['isReal', 'confidence', 'reasoning'],
  properties: {
    isReal: { type: 'boolean', description: 'true only if you could NOT refute it' },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    reasoning: { type: 'string', description: 'what you checked; why it survives or is refuted' },
  },
}

// ── PROJECT-SPECIFIC: replace with the DISCOVERED domains for this diff ────────
// Each domain is an independent failure surface. Scope each skeptic to the files
// it owns and the failure modes that surface is prone to. A brand-new module with
// no test history deserves its own first-class skeptic. Keep one cross-cutting
// skeptic for the API/IPC/contract boundaries no single-file reviewer catches.
const DOMAINS = args?.domains || [
  {
    key: 'backend',
    label: 'backend-skeptic',
    focus:
      'Server/native changes. Hunt: leaked resources, per-request clients, work that ignores cancellation, O(n^2) loops, locks held across I/O, idempotency breaks, panics/unwraps on bad input, missing SSRF/size/time caps, unsanitized input reaching a query.',
    files: '<paths>',
  },
  {
    key: 'new-code',
    label: 'new-module-skeptic',
    focus:
      'Any BRAND-NEW module/parser/importer — fresh ground with no test history. Hunt: malformed/huge/empty/Unicode input crashing it, idempotency/dedup not honored, partial writes on error, offsets computed on one buffer applied to another.',
    files: '<paths>',
  },
  {
    key: 'frontend',
    label: 'frontend-skeptic',
    focus:
      'UI/client changes. Hunt: stale closures, missing effect deps, unstable props feeding memoized lists, heavy work not gated on visibility, optimistic state desyncing from the persisted write, double-invocation under StrictMode, error paths swallowed silently.',
    files: '<paths>',
  },
  {
    key: 'integration',
    label: 'cross-cutting-skeptic',
    focus:
      'Cross-cutting boundaries no single-file reviewer catches. Read the FULL diff. Hunt: a signature/return-shape changed on one side of an API/IPC boundary but not the other; a new command/route not registered; a missing capability/permission; a migration without a version bump; docs claiming behavior the code lacks; tests weakened to pass.',
    files: 'full diff',
  },
]

function reviewPrompt(d) {
  const scope =
    d.files && d.files !== 'full diff'
      ? `Run: \`${RANGE} -- ${d.files}\` and read those files in full plus enough surrounding code to know the invariant each hunk touches.`
      : `Read the FULL diff: \`${RANGE}\`.`
  return `${STANCE}\n\nProject invariants (a diff that violates one is a BUG even if it compiles and tests pass):\n${INVARIANTS}\n\nFOCUS: ${d.focus}\n\n${scope}\n\nReturn every finding via the structured tool. An empty list is acceptable ONLY if you genuinely tried to break it and failed — say what you tried.`
}

function verifyPrompt(f) {
  return `${STANCE}\n\nA reviewer claims this finding in the diff (${RANGE}). Your job is to REFUTE it. Default to isReal=false unless you can confirm the exact failure path in the actual code.\n\nFinding: ${f.title}\nSeverity claimed: ${f.severity}\nLocation: ${f.file}:${f.line}\nScenario: ${f.scenario}\nViolated invariant/reason: ${f.invariant_or_reason}\n\nRead the cited code and enough context to judge. Check: does the failure actually reproduce? Is there an existing guard the reviewer missed? Is the cited line even reachable? Is the severity inflated? Only isReal=true if it genuinely survives scrutiny.`
}

phase('Review')
log(`Adversarial review of ${RANGE} — ${DOMAINS.length} domain skeptics, each finding refuted before it survives`)

// Pipeline (no barrier): each domain's findings start verifying the moment that
// domain's review returns — a slow domain doesn't hold up the others.
const reviewed = await pipeline(
  DOMAINS,
  (d) =>
    agent(reviewPrompt(d), { label: d.label, phase: 'Review', schema: FINDINGS_SCHEMA }).then((r) => ({
      domain: d,
      findings: (r && r.findings) || [],
    })),
  ({ domain, findings }) =>
    parallel(
      findings.map((f) => () =>
        agent(verifyPrompt(f), {
          label: `verify:${domain.key}:${(f.file || '').split('/').pop()}`,
          phase: 'Verify',
          schema: VERDICT_SCHEMA,
        }).then((v) => ({
          ...f,
          domain: domain.key,
          verdict: v || { isReal: false, confidence: 'low', reasoning: 'verifier died' },
        })),
      ),
    ),
)

const confirmed = reviewed
  .flat()
  .filter(Boolean)
  .filter((f) => f.verdict && f.verdict.isReal)

log(`${confirmed.length} findings survived adversarial verification`)

phase('Synthesize')
const report = await agent(
  `You are writing the final adversarial review report for the diff ${RANGE}.\n\nThese findings SURVIVED adversarial verification (refuted ones were dropped):\n\n${JSON.stringify(
    confirmed,
    null,
    2,
  )}\n\nWrite a tight markdown report:\n1. One-line verdict on the diff's overall risk.\n2. Findings grouped by severity (Critical -> Low): title, file:line, the concrete failure scenario, the violated invariant, and a one-line fix. Flag 'low'-confidence survivors as "needs a human check".\n3. "Single most likely thing to break in production" — the one that fires on the most common path.\n4. "What could not be verified" — be honest about coverage gaps (paths not reproduced, anything needing the app running, cited lines unconfirmed, areas out of scope). Never imply coverage you didn't achieve.\n\nIf the confirmed list is empty, say so plainly and note what was probed.`,
  { label: 'synthesis', phase: 'Synthesize' },
)

return { confirmedCount: confirmed.length, confirmed, report }
