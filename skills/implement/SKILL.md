---
name: implement
description: Implement one approved local story with repository instructions, isolated scope, verification, review, a local commit, and delivery-ledger evidence. Use when an agent or subagent is assigned a ticket from a feature plan folder.
---

# Implement

Implement the assigned file from `plans/<feature-slug>/tickets/`. The ticket and
approved `PLAN.md` define the boundary; chat history does not expand it.

## Before editing

1. Read the full feature folder and any workspace-root or relevant repository
   `AGENTS.md` files. Follow relevant delegated instruction files, code paths, ADRs,
   runbooks, and examples referenced by those instructions. Continue with repository
   evidence when no `AGENTS.md` exists.
2. Verify the story is on the ready frontier and its blockers are complete.
3. Inspect repository status, base branch, work branch, and existing user changes.
   Preserve unrelated work. Use an isolated branch or worktree for parallel stories;
   never let concurrent agents edit the same checkout.
4. Trace the existing behavior and tests before changing it. Prefer established
   patterns over introducing a new abstraction.

If the story cannot be completed without changing its declared scope or another
repository, stop with evidence and return it to planning. Do not quietly widen the work.

## Build and verify

- Make the smallest coherent change that satisfies the acceptance criteria.
- Use test-first development where practical at the verification seams in `PLAN.md`.
- Run focused tests and static checks during implementation, then the relevant broader
  checks at the end. Report anything that could not be run and why.
- Review the final diff against the base branch, repository instructions, the ticket,
  and `PLAN.md`. Treat review suggestions as claims and validate them against code.
- Prefer a reviewer or subagent that did not author the change when one is available;
  give it the base, exact diff range, plan, ticket, and applicable instructions.
- Correct documentation and tests required by the behavior, but avoid unrelated cleanup.

## Commit locally; do not publish

Commit the completed changes on their work branches with concise messages. For a story that
touches multiple repositories, use one local branch and commit sequence per repository
and report every SHA. The default finish line is local commits only.

Do not push, force-push, open or update a PR, merge, deploy, or publish an issue unless
the user separately and explicitly requests that action. Permission to implement is not
permission to publish.

## Record completion

Use this state sequence: `ready` -> `in progress` -> `implemented` after local commits
and author checks -> `verified` after independent review accepts the evidence. Use
`blocked` with a reason whenever the next transition cannot be completed.

Update the story status and acceptance checkboxes with actual evidence. Record:

- each repository, branch, and local commit SHA;
- tests and checks run with results;
- review result and remaining risks;
- changed scope, if planning explicitly approved any.

If working alone as both implementer and coordinator, update each story/repository row
in `PRS.md` and append a dated `Implementation` entry to `CHANGELOG.md`. Keep `PR` as
`not opened` until a real PR exists.

When several subagents work in parallel, a worker may update only its assigned ticket
file. It must return the exact ticket, all commits, verification, and proposed ledger
and changelog entries. A single coordinator reviews the result, marks it `verified`,
and applies updates to shared `PRS.md` and `CHANGELOG.md`; parallel agents must not edit
those shared files.

End with all local commit SHAs, verification summary, review verdict, files updated in
the feature folder, and the next unblocked story. State explicitly that nothing was
pushed.
