---
name: grilling
description: Research a feature in a multi-repository workspace, capture evidence in a feature plan folder, and ask only the unresolved decisions one at a time. Use when the user wants to explore, clarify, grill, or stress-test work before planning it.
---

# Grilling

Turn an initial request into evidence-backed discovery. The purpose is to remove
avoidable questions, expose real decisions, and give the next reviewer a durable
record outside the chat.

## Establish the feature workspace

Resolve the workspace root from the current directory. Prefer the nearest ancestor that
already contains `plans/` and multiple repository directories. Otherwise use the
current directory when it is clearly the shared parent of the repositories in scope.
Ask only if two plausible roots would place the feature in different workspaces.

Choose `<feature-slug>` from the issue key or feature name already in context. Prefer
an existing matching folder. Unless the user requested a read-only pass, create:

```text
plans/<feature-slug>/
  DISCOVERY.md
  CHANGELOG.md
```

Do not ask where to put these files when the workspace convention or an existing plan
folder answers the question.

## Research before asking

1. Read the workspace-root `AGENTS.md`, then every relevant repository's `AGENTS.md`,
   when present. Follow delegated instruction files such as `@CLAUDE.md` and inspect
   relevant code, repositories, ADRs, runbooks, examples, and documentation linked
   from those files. Absence of `AGENTS.md` is not a blocker.
2. Trace the current behavior through code and tests. Check branch and working-tree
   state before relying on a file. Use repository history when it explains intent.
3. Separate findings into:
   - **Proven facts** with file, symbol, command, or document evidence.
   - **Strong inferences** with the supporting evidence and uncertainty stated.
   - **Decisions** that genuinely require the user's preference or authority.
4. Never ask for a fact that can be resolved from the workspace. Do not repeat a
   question already answered in the conversation or artifacts.

## Ask only the decision frontier

Ask one unresolved decision at a time. Include:

- the decision and why it changes the solution;
- the evidence already established;
- a recommended answer and its trade-off.

If a safe, reversible choice follows repository precedent, record it as a recommended
assumption instead of interrupting the user. Ask only when different answers would
materially change scope, behavior, ownership, risk, or rollout.

Stop when the decision frontier is empty or the remaining items are explicitly marked
as blockers. Do not implement production changes during this skill.

## Write `DISCOVERY.md`

Keep it concise and use this structure:

```markdown
# <Feature> — Discovery

## Goal
## Current behavior and evidence
## Repositories and contracts involved
## Constraints from workspace instructions
## Decisions resolved
## Assumptions to verify
## Open blockers
## Proposed scope
## Explicitly out of scope
```

Use repository-relative paths where practical. Do not copy secrets, customer data, or
private URLs into the plan folder.

Append a dated `Discovery` entry to `CHANGELOG.md` containing what was investigated,
which decisions were resolved, and any blockers. Preserve earlier entries.

End by recommending `plan-review`; do not claim the work is ready for specification
until that evidence review is complete.
