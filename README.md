# agent-skills

The generic skills and hooks from my AI workflow, pulled out so they can be reused.

Nothing here is tied to a particular codebase or company. These are the pieces that
transferred cleanly between projects, which is roughly the test for whether something
belonged in this repo at all.

Written up in [The workflow I built to ship with a herd of AI agents](https://ameeer.in/posts/workflow-herd-of-agents/).

## Hooks

Two hooks doing opposite jobs.

- **`hooks/auto-approve-readonly.sh`** approves read-only commands so you stop
  confirming `git status` twenty times a day.
- **`hooks/block-dangerous-commands.js`** denies a small list of patterns before they
  run: deleting a home directory, piping a URL into a shell, force-pushing to master,
  hard-resetting uncommitted work.

Read both before you install them. They are short, and letting something else decide
what runs on your machine is worth one minute of your attention.

## Skills

Planning, in the order I use them:

- **`grilling`** interrogates an idea one question at a time until the decisions are
  explicit. Good at surfacing the question you were avoiding.
- **`to-spec`** turns that conversation into a written contract: problem, solution,
  stories, decisions, tests, and an explicit scope boundary.
- **`to-tickets`** cuts the spec into vertical slices where each slice declares what
  blocks it.
- **`implement`** works a slice against the plan rather than against a chat history.

Everything else:

- **`handoff`** compresses a session into the goal, what was checked, what is still
  open, and where the evidence lives.
- **`zoom-out`** pulls back when a session has descended into detail and lost the shape
  of the problem.
- **`explain-diff`** explains a change in the order a person would learn it, which is
  almost never file order.
- **`developer-growth-analysis`** reviews a stretch of work and looks for patterns.

## Installing

Copy the folders you want into your agent's skills directory, `~/.claude/skills/` or
`~/.codex/skills/`, and put the hooks wherever your harness reads hooks from.

Or point your agent at this repo and ask it to set them up for you. That is a
reasonable first test of whether you trust it yet.

## A note on these

A skill is not magic. It is a checklist that stops you rediscovering the same thing
twice. Fork them, cut the parts that do not fit how you work, and treat the wording as
a starting point rather than a spec.
