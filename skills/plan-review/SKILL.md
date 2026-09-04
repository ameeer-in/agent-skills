---
name: plan-review
description: Review feature discovery against workspace instructions, linked sources, repositories, and tests before a plan is written. Use after grilling or when the user asks to validate planning assumptions without changing production code.
---

# Plan Review

Perform a skeptical, read-only review of `plans/<feature-slug>/DISCOVERY.md`. Writing
the review artifacts is allowed; do not modify production repositories.

When the harness supports delegation, prefer a reviewer that did not author the
discovery notes. Independence is more valuable here than continuity of phrasing.

## Review order

1. Read the workspace-root and repository-local `AGENTS.md` files when present. Follow
   relevant delegated instruction files, code paths, repositories, ADRs, runbooks, and
   examples referenced by them. Continue with repository evidence if none exists.
2. Read the complete feature folder and inspect git status, current branches, and the
   relevant base branches. Do not assume the checkout is current or clean.
3. Verify every important statement in `DISCOVERY.md` against code, tests, history, or
   authoritative documentation. Treat prior agent output and review comments as claims,
   not facts.
4. Trace cross-repository contracts end to end: producer, transport or persistence,
   consumer, failure behavior, and verification seam.
5. Check for missing scope, accidental scope growth, incompatible repository
   conventions, unproven assumptions, rollback gaps, and unsafe ordering.

## Verdicts

Classify each finding as:

- **Blocker** — the plan would be unsafe or materially wrong without resolution.
- **Should fix** — important incompleteness that should be corrected before planning.
- **Note** — useful context that does not block the next stage.
- **Rejected claim** — a suggested concern contradicted by repository evidence.

Do not invent findings to make the review look thorough. Include evidence and the
smallest corrective action for every blocker or should-fix item.

## Write `REVIEW.md`

```markdown
# <Feature> — Discovery Review

**Verdict:** ready for spec | ready with noted assumptions | blocked

## Scope reviewed
## Evidence checked
## Findings
## Rejected or already-handled concerns
## Required corrections
## Residual risks and verification gaps
## Recommended next step
```

Keep the review independent: do not rewrite `DISCOVERY.md`. Record proven corrections
under `Required corrections`; `to-spec` must use the review as the later authority.
Append a dated `Plan review` entry to `CHANGELOG.md` with the verdict and material
corrections.

Do not ask the user to reconfirm facts already resolved by evidence. Ask only if a
blocker is an actual product, ownership, risk, or rollout decision. If the verdict is
ready, recommend `to-spec`.
