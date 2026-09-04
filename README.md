# agent-skills

The reusable skills and safety hooks from my day-to-day AI-assisted engineering workflow.

The main workflow is built for a workspace that contains several repositories and a
shared `plans/` directory. It keeps discovery, decisions, implementation slices, and
delivery evidence outside chat history so a fresh agent can continue without guessing.

Written up in [The workflow I built to ship with a herd of AI agents](https://ameeer.in/posts/workflow-herd-of-agents/).

## The workflow

```text
request
  -> grilling       -> plans/<feature>/DISCOVERY.md
  -> plan-review    -> plans/<feature>/REVIEW.md
  -> to-spec        -> plans/<feature>/PLAN.md
  -> to-tickets     -> plans/<feature>/tickets/*.md
  -> implement      -> local commits + verified evidence
```

Every stage appends a concise entry to `plans/<feature>/CHANGELOG.md`. `PRS.md` is the
small delivery ledger: repositories, base and work branches, ticket ownership, local
commit, review state, and PR state. Planning creates it; implementation keeps it current.

This is the working discipline behind the files:

1. Read workspace and repository instructions when present. Follow relevant paths and
   links referenced from `AGENTS.md` (including delegated instruction files), rather
   than treating the prompt as the whole source of truth.
2. Resolve facts from repositories, history, tests, ADRs, and linked documentation.
   Ask the user only for a decision that cannot be established from evidence.
3. Review the gathered evidence before turning it into a contract.
4. Split the approved plan into bounded, dependency-aware stories. Each story should
   fit in one fresh agent context and name its verification boundary.
5. Let implementation agents work only assigned stories, preferably on isolated
   branches or worktrees. Commit verified work locally. Do not push, open a PR, or
   merge unless the user gives that separate instruction.
6. Keep shared ledgers readable. When agents run in parallel, one coordinator owns
   `PRS.md` and `CHANGELOG.md` to prevent conflicting edits.

The filenames are deliberately boring and stable. Use uppercase `PLAN.md`, `PRS.md`,
and `CHANGELOG.md` even if a prompt uses different casing.

## Quick start

From the root of a multi-repository workspace:

1. Invoke `grilling` with a feature name or ticket reference. It creates
   `plans/<feature-slug>/` and researches the workspace before asking anything.
2. Invoke `plan-review` for an evidence check of the discovery notes.
3. Invoke `to-spec` to produce the implementation contract in `PLAN.md`.
4. After approving the plan, invoke `to-tickets` to create one file per story.
5. Give an implementation agent one ready ticket and invoke `implement`.

Each stage can be invoked directly when its input artifacts already exist. Keeping the
complete feature folder intact gives a new agent enough context to resume safely.

## Hooks

Two hooks doing opposite jobs. They are narrow guardrails for trusted local environments,
not a replacement for normal permissions or sandboxing.

- **`hooks/auto-approve-readonly.sh`** approves read-only commands so you stop
  confirming `git status` twenty times a day.
- **`hooks/block-dangerous-commands.js`** checks 27 destructive command patterns across
  critical, high, and strict tiers before they run. These cover filesystem and disk
  destruction, risky Git operations, secret exposure, and destructive Docker commands.

Read both before installing them, then follow the setup and test instructions in
[`hooks/README.md`](hooks/README.md).

## Skills

- **`grilling`** creates evidence-backed discovery notes and asks only unresolved
  decision questions, one at a time.
- **`plan-review`** checks discovery claims, scope, and assumptions against the actual
  workspace before specification.
- **`to-spec`** turns reviewed discovery into `PLAN.md`, including repository impact,
  constraints, verification, rollout, and scope boundaries.
- **`to-tickets`** cuts the approved plan into small stories with explicit dependencies
  and acceptance evidence.
- **`implement`** executes an assigned story, reviews and verifies it, then leaves a
  local commit without publishing it.
- **`handoff`** gives the next agent a small index into the feature folder, code state,
  and remaining frontier.
- **`zoom-out`** pulls back when a session has descended into detail and lost the shape
  of the problem.
- **`explain-diff`** explains a change in the order a person would learn it, which is
  almost never file order.
- **`developer-growth-analysis`** reviews a stretch of work and looks for patterns.

## Installing

Copy the folders you want into your agent's skills directory, such as
`~/.claude/skills/` or `~/.codex/skills/`. Each installable skill contains a `SKILL.md`;
the optional `agents/openai.yaml` supplies Codex UI metadata. Install the five planning
and implementation skills together if you want the complete feature-folder workflow.

Both hooks support Claude Code. The dangerous-command blocker also supports Codex
through `PreToolUse`; the read-only auto-approval hook remains Claude Code-specific.
Read the scripts first, then follow the platform-specific configuration in
[`hooks/README.md`](hooks/README.md).

Or point your agent at this repository and ask it to set them up for you. Review the
files before enabling hooks or granting tools access.

Released under the [MIT License](LICENSE).

## Adapt it

Treat each skill as a maintained working agreement. Change path conventions and tool
names to fit your environment, but keep the evidence, scope, and approval boundaries
explicit.
