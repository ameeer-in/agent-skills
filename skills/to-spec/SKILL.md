---
name: to-spec
description: Turn reviewed feature discovery into a repository-grounded PLAN.md inside the workspace plans folder. Use after plan-review when the user wants an implementation contract, not more interviews or issue publication.
---

# To Spec

Produce the implementation contract at `plans/<feature-slug>/PLAN.md`. Do not publish
issues, modify production code, or restart discovery as an interview.

## Preconditions

Read, in order:

1. workspace-root and relevant repository `AGENTS.md` files when present, including
   relevant paths and delegated instruction files they reference;
2. all existing artifacts in the feature folder;
3. the current code and tests at the contracts named by `DISCOVERY.md` and `REVIEW.md`.

If `REVIEW.md` has unresolved blockers, stop and report them. Otherwise resolve small
factual gaps from the repositories yourself. Ask the user only when an unmade decision
would materially change the contract.

When discovery and review disagree, an evidence-backed correction in `REVIEW.md`
overrides the earlier discovery claim. Carry both the correction and its evidence into
the plan; do not silently preserve the contradicted statement.

## Write the plan

Use concrete repository-relative paths and existing symbols where that makes the plan
executable. Unlike long-lived product requirements, this document is an engineering
contract for the current checkout; precise locations are useful when verified.

```markdown
# <Feature> — Implementation Plan

**Status:** draft | approved | blocked
**Updated:** YYYY-MM-DD

## Objective and observable outcome
## Current behavior and evidence
## Scope
## Out of scope
## Repository impact and ownership
| Repository | Contract owned | Required change | Dependency | Verification |
## Functional and technical decisions
## Interfaces, data, and compatibility
## Failure behavior and safety constraints
## Verification strategy
## Delivery order and review gates
## Rollout and rollback
## Risks and remaining assumptions
## Completion conditions
```

The plan must distinguish proven behavior, chosen decisions, and remaining assumptions.
Prefer existing test seams and repository conventions. Include exact commands only when
verified; otherwise describe the verification outcome required.

Do not split the plan into tickets here. The delivery order may identify candidate
slices, but `to-tickets` owns their final boundaries and dependency graph.

## Maintain the feature ledger

Create `PRS.md` if absent:

```markdown
# <Feature> — Delivery Ledger

| Story | Owner | Repository | Base | Work branch | Local commits | Review | PR | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
```

Use one row per story and repository. A story that crosses three repositories has three
rows because its branches, commits, reviews, and eventual PRs can move independently.
Use `not started`, `not committed`, and `not opened` rather than blanks. A PR URL must
never be implied before one exists.

Append a dated `Specification` entry to `CHANGELOG.md` with the plan status, major
scope decisions, and files changed in the feature folder. Preserve previous history.

End with the exact plan path and whether it is ready for user approval. Do not invoke
`to-tickets` until the plan is approved.
