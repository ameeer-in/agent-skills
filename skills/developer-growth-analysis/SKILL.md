---
name: developer-growth-analysis
description: Review recent coding-agent conversations to find evidence-backed strengths, recurring friction, and a small set of useful learning experiments. Use when a developer wants a private retrospective grounded in their own work rather than generic career advice.
---

# Developer Growth Analysis

Create a private, evidence-backed retrospective from the user's recent coding-agent
history. Diagnose patterns in how work is approached; do not grade the person or turn
one difficult task into a claimed skill gap.

## Choose the evidence window

Use the period requested by the user. If none is given, use the most recent seven days
with meaningful development activity.

Locate history through the current harness or its documented local storage. Inspect the
format before parsing it; do not assume field names or that every entry belongs to the
current workspace. Include only user-authored requests and the minimum agent context
needed to understand results.

Ask for a path only when history cannot be discovered safely. Do not read unrelated
personal files, secrets, pasted credentials, or message content outside the requested
development history.

## Analyze patterns, not anecdotes

Group evidence across tasks. Look for:

- repeated kinds of work, decisions, or failure modes;
- places where repository evidence replaced an initial assumption;
- review findings that recur after implementation;
- strong habits worth preserving;
- friction caused by missing knowledge, weak process, tooling, or environment.

Keep those causes separate. A flaky build, unclear requirement, or agent mistake is not
evidence that the developer lacks a skill.

For every proposed growth area, cite at least two concrete examples from the selected
period. If there is only one example, label it an observation rather than a pattern.
Do not expose repository names, private URLs, ticket text, or pasted business data in
the report; describe the evidence at the level needed to make it useful.

## Write the retrospective

Keep the report short enough to use. Prefer two or three strong themes over a long list.

```markdown
# Developer Retrospective

**Period:** <date range>
**Evidence reviewed:** <conversation count or sessions, if known>

## Work shape
## Strengths to keep
## Recurring friction
### <Theme>
- Evidence
- Likely cause
- One experiment for the next week
- How to tell whether it helped
## Observations that need more evidence
## Next review
```

Recommendations must be small and testable in real work. Do not invent learning-time
estimates, proficiency scores, quotations, article titles, dates, or links.

## Optional learning resources

Search only when the user asks for resources or current research would materially help.
Use primary documentation and original technical writing where possible. Open each
source, verify that it supports the recommendation, and include at most two resources
per theme with a one-sentence reason to read each.

Present the report in the current conversation by default. Saving it, sending it to a
messaging service, or publishing it requires a separate explicit request.
