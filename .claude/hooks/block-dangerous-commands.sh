#!/usr/bin/env bash
# PreToolUse hook (Bash matcher). Blocks obviously destructive commands
# before they run. Exit 2 blocks the command and sends stderr back to Claude.
# Stack-agnostic — reusable as-is in any new venture.
input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -z "$cmd" ] && exit 0

deny_patterns=(
  'rm[[:space:]]+-rf[[:space:]]+(/|~)([[:space:]]|$)'
  'rm[[:space:]]+-rf[[:space:]]+\*'
  'git[[:space:]]+push.*(--force|-f[[:space:]])'
  'git[[:space:]]+reset[[:space:]]+--hard'
  'DROP[[:space:]]+(TABLE|DATABASE)'
)

for pattern in "${deny_patterns[@]}"; do
  if printf '%s' "$cmd" | grep -qiE "$pattern"; then
    echo "Blocked: command matches a protected pattern. If this is intentional, run it manually outside Claude Code, not through this session." >&2
    exit 2
  fi
done
exit 0
