---
name: explain-diff
description: Create a self-contained HTML explanation of a branch, commit range, pull request, or local diff. Use when the reader needs the surrounding system, core idea, behavioral changes, and review questions presented in learning order rather than file order.
---

# Explain Diff

Build a concise, self-contained HTML guide to the requested code change.

## Establish the change

1. Resolve the exact repository and comparison range. Inspect git status and refs; do
   not silently substitute a nearby branch or include unrelated local changes.
2. Read applicable `AGENTS.md` files and follow relevant instructions and linked code.
3. Inspect the changed code, surrounding callers, tests, and contracts. Verify claims
   against the diff instead of relying on a PR description or prior summary.
4. Identify the smallest useful narrative: previous behavior, reason for the change,
   new behavior, failure cases, and verification.

If the range is ambiguous and different choices produce different changes, ask before
writing. Otherwise resolve details from the repository.

## Organize for understanding

Use this order:

1. **Orientation** — what part of the system this is and why the reader should care.
2. **Before** — the prior behavior, with one concrete example.
3. **Core change** — the central idea in plain language.
4. **After** — trace the same example through the new behavior.
5. **Code walkthrough** — group changes by responsibility, not filename order.
6. **Verification and edge cases** — what tests prove and what remains uncertain.
7. **Check your understanding** — three to five useful questions, with answers hidden
   behind accessible `<details>` elements or interactive controls.

Use only the sections that help explain the change. Keep background collapsible when it
would otherwise dominate the page. Prefer one or two reusable diagrams over decoration.
Use realistic toy data, never copied production data.

## Produce the HTML

- Write one responsive HTML file with inline CSS and JavaScript and no network-loaded
  assets. Use semantic headings, a small table of contents, readable contrast, and
  keyboard-accessible controls.
- Save to the user-specified path. Otherwise use
  `/tmp/YYYY-MM-DD-explain-<change-slug>.html` so the artifact stays out of the repo.
- Use `<pre><code>` for code. Preserve whitespace with `white-space: pre` or
  `pre-wrap`, wrap long lines, and escape HTML characters from source snippets.
- Keep snippets short and connect each one to a behavior. Link or label repository
  paths and line numbers when available.
- Do not use ASCII art, ornamental dashboards, invented metrics, or unsupported claims.
- State the exact diff range and generation date in the page.

Before returning the path, open or render the file when tools allow it. Check that the
page loads without external dependencies, navigation works, code formatting is intact,
interactive answers are usable by keyboard, and every stated behavior is supported by
the inspected change.
