---
type: proposal
id: 20261124-learning-dashboard
from: colt
date: 2026-11-24
touches:
  - 70-dashboard/
  - 45-tasks/ (new, proposed)
  - .hq/ (new, proposed)
decision: pending
---
Dad only: `INPUT[inlineSelect(option(pending), option(approved), option(declined)):decision]` (COLT never edits this field.)
# Approve building the HQ Dashboard (local, agent-first web app) as the v2 Command Center

## Change
- Approve the draft [[dashboard-product-spec]], [[dashboard-build-plan]] and [[dashboard-agent-contract]] in `70-dashboard/` (mockup: `70-dashboard/dashboard-mockup.html`, sample data). After approval, build the weekend MVP: a local app on Shiloh's PC (127.0.0.1 only) that reads and writes this vault, with the same tools for COLT and Grok Bot through MCP and CLI. Adds `45-tasks/` (one note per task) and a hidden `.hq/` event log and config. Agents can never set `verified` or `decision`. Verification from the app only in your unlocked parent session. Needs Node.js LTS installed (Toolshed). Six open questions are in spec §12.

## Why (max 3 lines)
Dad asked on 2026-11-24 (through DaD, the headmaster Grok Bot) for a dashboard where Shiloh picks a task, runs a timer, checks off with proof, and leaves notes, and that can be cloned for his younger brother. This revisits the 2026-11-22 call that the Command Center web app waits for v2. Drafted by DaD; `from: colt` follows the template's allowed values.
