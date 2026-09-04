#!/usr/bin/env node
/**
 * Block Dangerous Commands - PreToolUse Hook for Bash
 * Blocks dangerous patterns before execution. Logs to: ~/.agent-skills/hooks-logs/
 *
 * SAFETY_LEVEL: 'critical' | 'high' | 'strict'
 *   critical - Only catastrophic: rm -rf ~, dd to disk, fork bombs
 *   high     - + risky: force push main, secrets exposure, git reset --hard
 *   strict   - + cautionary: any force push, sudo rm, docker prune
 *
 * Supports Claude Code and Codex. See hooks/README.md for setup.
 */

const fs = require('fs');
const path = require('path');

const SAFETY_LEVEL = 'strict';

const PATTERNS = [
  // CRITICAL - Catastrophic, unrecoverable
  { level: 'critical', id: 'rm-home',          regex: /\brm\b(?:\s+-[^\s]+)*\s+(?:--\s+)?["']?(?:~|\$HOME|\$\{HOME\})(?:\/(?:\*|\.\*)?)?["']?(?=\s|$|[;&|])/, reason: 'rm targeting the home directory' },
  { level: 'critical', id: 'rm-root',          regex: /\brm\s+(-.+\s+)*\/(\*|\s|$|[;&|])/,                                 reason: 'rm targeting root filesystem' },
  { level: 'critical', id: 'rm-system',        regex: /\brm\s+(-.+\s+)*\/(etc|usr|var|bin|sbin|lib|boot|dev|proc|sys)(\/|\s|$)/, reason: 'rm targeting system directory' },
  { level: 'critical', id: 'rm-cwd',           regex: /\brm\s+(-.+\s+)*(\.\/?|\*|\.\/\*)(\s|$|[;&|])/,                     reason: 'rm deleting current directory contents' },
  { level: 'critical', id: 'dd-disk',          regex: /\bdd\b[\s\S]*\bof=["']?\/dev\/(?:r?disk\d+|sd[a-z]\d*|nvme\d+n\d+(?:p\d+)?|hd[a-z]\d*|vd[a-z]\d*|xvd[a-z]\d*)\b/, reason: 'dd writing to a disk device' },
  { level: 'critical', id: 'mkfs',             regex: /\bmkfs(?:\.\w+)?\b[\s\S]*\/dev\/(?:r?disk\d+|sd[a-z]\d*|nvme\d+n\d+(?:p\d+)?|hd[a-z]\d*|vd[a-z]\d*|xvd[a-z]\d*)\b/, reason: 'mkfs formatting a disk device' },
  { level: 'critical', id: 'diskutil-erase',   regex: /\bdiskutil\s+(?:eraseDisk|eraseVolume|partitionDisk|zeroDisk|randomDisk|secureErase)\b/i, reason: 'diskutil destructive disk operation' },
  { level: 'critical', id: 'fork-bomb',        regex: /:\(\)\s*\{.*:\s*\|\s*:.*&/,                                         reason: 'fork bomb detected' },

  // HIGH - Significant risk, data loss, security
  { level: 'high', id: 'url-pipe-shell',  regex: /\b(?:curl|wget)\b[\s\S]*\|\s*(?:sudo\s+)?(?:(?:\/usr\/bin\/)?env\s+)?(?:\/(?:usr\/)?bin\/)?(?:bash|sh|zsh|dash|ksh|fish)\b/i, reason: 'piping a URL to a shell' },
  { level: 'high', id: 'git-force-main', regex: /\bgit\s+push\b(?=[\s\S]*(?:--force(?:=true)?|-f)(?:\s|$))(?=[\s\S]*(?:\b(?:main|master)\b|refs\/heads\/(?:main|master)\b))/, reason: 'force push to main/master' },
  { level: 'high', id: 'git-force-refspec-main', regex: /\bgit\s+push\b[\s\S]*\+(?:[^\s:]+:)?(?:refs\/heads\/)?(?:main|master)\b/, reason: 'force refspec targeting main/master' },
  { level: 'high', id: 'git-delete-main', regex: /\bgit\s+push\b(?=[\s\S]*(?:--delete\b|:\s*(?:refs\/heads\/)?(?:main|master)\b))(?=[\s\S]*(?:\b(?:main|master)\b|refs\/heads\/(?:main|master)\b))/, reason: 'deleting main/master on a remote' },
  { level: 'high', id: 'git-push-mirror', regex: /\bgit\s+push\b[\s\S]*--mirror\b/, reason: 'mirroring all refs to a remote' },
  { level: 'high', id: 'git-reset-hard', regex: /\bgit\s+reset\s+--hard/,                                                 reason: 'git reset --hard loses uncommitted work' },
  { level: 'high', id: 'git-clean-f',    regex: /\bgit\s+clean\s+(-\w*f|-f)/,                                             reason: 'git clean -f deletes untracked files' },
  { level: 'high', id: 'chmod-777',      regex: /\bchmod\b.+\b777\b/,                                                     reason: 'chmod 777 is a security risk' },
  { level: 'high', id: 'cat-env',        regex: /\b(cat|less|head|tail|more)\s+\.env\b/,                                  reason: 'reading .env file exposes secrets' },
  { level: 'high', id: 'cat-secrets',    regex: /\b(cat|less|head|tail|more)\b.+(credentials|secrets?|\.pem|\.key|id_rsa|id_ed25519)/i, reason: 'reading secrets file' },
  { level: 'high', id: 'env-dump',       regex: /\b(printenv|^env)\s*([;&|]|$)/,                                          reason: 'env dump may expose secrets' },
  { level: 'high', id: 'echo-secret',    regex: /\becho\b.+\$\w*(SECRET|KEY|TOKEN|PASSWORD|API_|PRIVATE)/i,               reason: 'echoing secret variable' },
  { level: 'high', id: 'docker-vol-rm',  regex: /\bdocker\s+volume\s+(rm|prune)/,                                         reason: 'docker volume deletion loses data' },
  { level: 'high', id: 'rm-ssh',         regex: /\brm\b.+\.ssh\/(id_|authorized_keys|known_hosts)/,                       reason: 'deleting SSH keys' },

  // STRICT - Cautionary, context-dependent
  { level: 'strict', id: 'git-force-any',    regex: /\bgit\s+push\b(?!.+--force-with-lease).+(--force|-f)\b/,              reason: 'force push (use --force-with-lease)' },
  { level: 'strict', id: 'git-checkout-dot', regex: /\bgit\s+checkout\s+\./,                                               reason: 'git checkout . discards changes' },
  { level: 'strict', id: 'sudo-rm',          regex: /\bsudo\s+rm\b/,                                                       reason: 'sudo rm has elevated privileges' },
  { level: 'strict', id: 'docker-prune',     regex: /\bdocker\s+(system|image)\s+prune/,                                   reason: 'docker prune removes images' },
  { level: 'strict', id: 'crontab-r',        regex: /\bcrontab\s+-r/,                                                      reason: 'removes all cron jobs' },
];

const LEVELS = { critical: 1, high: 2, strict: 3 };
const LOG_DIR = path.join(process.env.HOME, '.agent-skills', 'hooks-logs');

function log(data) {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
    const file = path.join(LOG_DIR, `${new Date().toISOString().slice(0, 10)}.jsonl`);
    fs.appendFileSync(file, JSON.stringify({ ts: new Date().toISOString(), ...data }) + '\n');
  } catch {}
}

function checkCommand(cmd, safetyLevel = SAFETY_LEVEL) {
  const threshold = LEVELS[safetyLevel] || 2;
  for (const p of PATTERNS) {
    if (LEVELS[p.level] <= threshold && p.regex.test(cmd)) {
      return { blocked: true, pattern: p };
    }
  }
  return { blocked: false, pattern: null };
}

async function main() {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;

  try {
    const data = JSON.parse(input);
    const { tool_name, tool_input, session_id, cwd, permission_mode } = data;
    if (tool_name !== 'Bash') return console.log('{}');

    const cmd = tool_input?.command || '';
    const result = checkCommand(cmd);

    if (result.blocked) {
      const p = result.pattern;
      log({ level: 'BLOCKED', id: p.id, priority: p.level, commandLength: cmd.length, session_id, cwd, permission_mode });
      return console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: `[${p.id}] ${p.reason}`
        }
      }));
    }
    console.log('{}');
  } catch (e) {
    log({ level: 'ERROR', error: e.message });
    console.log('{}');
  }
}

if (require.main === module) {
  main();
} else {
  module.exports = { PATTERNS, LEVELS, SAFETY_LEVEL, checkCommand };
}
