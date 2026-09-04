# Hooks

These hooks inspect `Bash` commands before execution.

- `block-dangerous-commands.js` checks 27 destructive patterns across critical, high,
  and strict tiers. It supports Claude Code and Codex through `PreToolUse`.
- `auto-approve-readonly.sh` skips Claude Code's prompt for a small exact allowlist.

They are guardrails, not a shell parser or sandbox. Commands outside the exact rules
continue through the agent's normal permission flow.

## Requirements

- macOS or Linux
- Bash
- Node.js 18 or newer
- `jq` on `PATH`

Make the scripts executable and run the regression checks:

```bash
chmod +x hooks/auto-approve-readonly.sh hooks/block-dangerous-commands.js hooks/test-hooks.js
node hooks/test-hooks.js
```

## Claude Code setup

Add both hooks to `~/.claude/settings.json` for user-wide use or
`.claude/settings.json` for one project. Replace the two example paths with absolute
paths on your machine.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/absolute/path/to/agent-skills/hooks/block-dangerous-commands.js"
          },
          {
            "type": "command",
            "command": "/absolute/path/to/agent-skills/hooks/auto-approve-readonly.sh"
          }
        ]
      }
    ]
  }
}
```

Claude Code can run matching hooks in parallel. The setup does not depend on order:
a deny decision takes precedence over an allow decision.

## Codex setup

Only install the dangerous-command blocker. Add it to `~/.codex/hooks.json` for
user-wide use or `.codex/hooks.json` for one project. Replace the example path with
the absolute path on your machine.

```json
{
  "description": "Block destructive shell commands before execution.",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "^Bash$",
        "hooks": [
          {
            "type": "command",
            "command": "node /absolute/path/to/agent-skills/hooks/block-dangerous-commands.js",
            "timeout": 5,
            "statusMessage": "Checking command safety"
          }
        ]
      }
    ]
  }
}
```

Start Codex and use `/hooks` to review and trust the hook definition. Codex records
trust against the current definition, so review it again after changing the command or
script. See the [Codex hooks documentation](https://learn.chatgpt.com/docs/hooks) for
configuration locations and trust behavior.
