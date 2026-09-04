#!/bin/bash

CMD=$(jq -er 'select(.tool_name == "Bash") | .tool_input.command | strings' 2>/dev/null < /dev/stdin) || exit 0

# A read-only prefix can still be followed by a write. Leave composed shell commands
# to the normal permission flow instead of trying to parse shell syntax here.
case "$CMD" in
  *";"*|*"&"*|*"|"*|*"<"*|*">"*|*'`'*|*'$('*|*$'\n'*|*$'\r'*)
    exit 0
    ;;
esac

case "$CMD" in
  pwd|whoami|date|\
  "git status"|"git status --short"|"git status --short --branch"|\
  "git status --porcelain"|"git status --porcelain=v1"|"git status --porcelain=v2"|\
  "git branch --show-current"|"git diff --check"|"git diff --stat"|\
  "git diff --name-only"|"git log --oneline"|"git log -1 --oneline --decorate")
    echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow","permissionDecisionReason":"Recognized read-only command"}}'
    ;;
esac
