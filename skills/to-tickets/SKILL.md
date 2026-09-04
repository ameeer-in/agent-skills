---
name: to-tickets
description: Split an approved PLAN.md into bounded local story files with explicit dependencies, scope, ownership, and verification. Use when implementation should be delegated without publishing anything to an external tracker.
---

# To Tickets

Convert `plans/<feature-slug>/PLAN.md` into agent-sized implementation stories under
`plans/<feature-slug>/tickets/`. Local files are the default and source of truth.
Creating or changing issues in an external tracker requires a separate explicit request.

## Ground the split

Read the complete feature folder, workspace and repository `AGENTS.md` files when
present, and the relevant paths and delegated instructions they reference. Verify that
`PLAN.md` is approved and that `REVIEW.md` has no open blocker. Resolve factual details
from code; do not quiz the user again about settled decisions.

If the user explicitly approved the plan in the current conversation but the document
still says `draft`, update its status to `approved` and record that transition in the
changelog. Otherwise stop before creating tickets.

If the plan contains a material ambiguity, record it as a blocker instead of silently
choosing a different design. Ask only when the ambiguity cannot be resolved from the
workspace and changes story boundaries or behavior.

## Slice the work

Each story must:

- deliver one independently verifiable behavior or one necessary enabling change;
- fit in a single fresh agent context;
- name the repository or repositories it may modify;
- declare blockers and the evidence that makes it complete;
- preserve a green build where practical;
- exclude cleanup or refactoring not required by the approved plan.

Prefer vertical slices. Use expand-migrate-contract for a wide mechanical change that
cannot land safely as vertical slices. Independent stories form the implementation
frontier and may be delegated in parallel; dependent stories wait.

Review the proposed graph yourself against `PLAN.md`. Present a short summary to the
user only when approval is required or the split exposes a new decision. Do not ask
generic questions such as whether the granularity feels right when every slice already
meets the constraints above.

## Write one file per story

Name files `tickets/<NN>-<slug>.md` in dependency order:

```markdown
# <NN> — <Story title>

**Status:** ready | blocked | in progress | implemented | verified
**Blocked by:** None | <story numbers>

| Repository | Base | Allowed paths or contracts |
| --- | --- | --- |
| <repository> | <verified base branch> | <scope boundary> |

## Outcome
## Scope
## Out of scope
## Contracts and constraints
## Acceptance criteria
- [ ] Observable criterion
## Verification
## Implementation handoff
```

The handoff must point to `PLAN.md`, relevant instructions, and precise code locations;
it must not duplicate the entire plan. Acceptance criteria describe behavior and
evidence, not vague activities such as “update code” or “add tests.”

Use one table row per repository. Never collapse different repository base branches or
scope boundaries into a single value.

## Update shared artifacts

Add or refresh one row per story and repository in `PRS.md`. A cross-repository story
must have a separate row for each repository because it will have separate branches and
commits. Set truthful initial values such as `not started`, `not committed`, and
`not opened`; never fabricate branch names, commits, review results, or PR URLs.

Append a dated `Ticket breakdown` entry to `CHANGELOG.md` with created or changed story
files, the dependency frontier, and any blockers. This update is required even though
no production code changed.

End with the ready frontier and the exact ticket paths an implementation agent can take.
