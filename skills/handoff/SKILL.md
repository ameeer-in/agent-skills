---
name: handoff
description: Compact current work into a small handoff that points a fresh agent to the feature plan, ticket frontier, repositories, commits, evidence, and unresolved decisions.
---

# Handoff

Write the handoff inside the existing `plans/<feature-slug>/` folder. Resolve the folder
from the current conversation, assigned ticket, and workspace conventions; ask only if
multiple existing feature folders are equally plausible.

Read the feature artifacts and relevant git state before writing. Do not duplicate the
contents of `DISCOVERY.md`, `REVIEW.md`, `PLAN.md`, tickets, `PRS.md`, commits, or diffs.
Link to them with repository-relative paths.

Include:

```markdown
# <Feature> — Handoff

## Goal and current stage
## Source-of-truth artifacts
## Repository, branch, and commit state
## Completed work and verification
## Ready ticket frontier
## Blockers and unresolved decisions
## Exact next action
## Suggested skills
```

If arguments were passed, make the exact next action serve that next session. Record
whether anything was pushed or a PR exists; never infer either from a local branch.

Redact secrets, personal data, customer data, and private URLs. Append a concise dated
`Handoff` entry to the feature `CHANGELOG.md`.
