---
type: spec
status: draft-pending-approval
date: 2026-11-24
quadrant: "[[systems-self-command]]"
author: DaD (Headmaster Grok Bot, at Thomas's request)
proposal: "[[20261124-learning-dashboard]]"
---
# HQ Dashboard: agent contract (tools, permissions, events)

The one interface the UI **and** every agent use. Same names in three transports:
- **MCP**: tool `hq.complete_task` (stdio for COLT in Grok Build; Streamable HTTP on `127.0.0.1:4317/mcp`)
- **REST**: `POST /api/v1/tasks/{id}/complete`
- **CLI**: `hq complete-task <id> --proof "12/12" --json`

All inputs and outputs are validated by shared zod schemas. All mutations pass the guard, then storage, then an event. Product context: [[dashboard-product-spec]]. Build: [[dashboard-build-plan]].

## 1. Principals and roles
| Principal | Role | How it authenticates | Notes |
|---|---|---|---|
| `shiloh` (UI) | `learner` | Local UI token, first-run pairing | Owns tasks, notes, pins, Interest ratings |
| `thomas` (UI parent mode) | `parent` | PIN or passkey unlock, 15-min idle timeout, **human-only** | The only role that can verify or record decisions |
| `colt` | `agent:tutor` | MCP stdio, token in `%APPDATA%\hq` | Shiloh's companion ([[AGENTS]]) |
| `dad-bot` (DaD / Dad's Chief of Staff) | `agent:observer` | CLI or HTTP token | Read, suggest and comment. Writes only check-in notes. |
| `app` | `system` | internal | Timers, scheduled rollups |
| `external` | none | file watcher | Edits made in Obsidian, attributed by git |

## 2. Tools
| Tool | Input (summary) | Output | learner | agent:tutor | agent:observer | parent |
|---|---|---|---|---|---|---|
| `get_today` | `{date?}` | check-in state, 3 suggestions, missions, due soon, minutes | ✅ | ✅ | ✅ | ✅ |
| `list_tasks` | `{lane?, area?, quadrant?, status?, due_before?}` | `Task[]` | ✅ | ✅ | ✅ | ✅ |
| `get_task` | `{id}` | `Task` + `version` | ✅ | ✅ | ✅ | ✅ |
| `create_task` | `{title, area, quadrant, est_min, due?, first_move?, lane?}` | `Task` | ✅ | ✅ (created_by colt) | ❌ | ✅ |
| `update_task` | `{id, patch, if_match}`: lane, pinned, due, est_min, first_move, title | `Task` | ✅ | ✅ (not `pinned`) | ❌ | ✅ |
| `prioritize` | `{ordered_ids[], lane}` | ok | ✅ | ❌ (suggest only) | ❌ | ✅ |
| `start_timer` | `{task_id, minutes: 15\|20\|25\|50\|55}` | `Session` | ✅ | ✅ (when Shiloh asks) | ❌ | ✅ |
| `pause_timer` / `stop_timer` | `{session_id, outcome?: done\|partly\|stuck}` | `Session` + focus row written | ✅ | ✅ | ❌ | ✅ |
| `complete_task` | `{id, proof?: {score?, link?, file?, text?}, if_match}` | `Task` + `EvidenceRef` (`verified: pending`) | ✅ | ✅ | ❌ | ✅ |
| `tick_mission` | `{text_match, done}` | ok | ✅ | ✅ | ❌ | ✅ |
| `add_note` | `{date?, section: did\|learned\|stuck\|first_move\|parking_lot, text, task_id?}` | ok | ✅ | ✅ (tagged "COLT:") | ✅ only `section: checkin` | ✅ |
| `mark_stuck` | `{task_id, text}` | ok | ✅ | ✅ | ❌ | ✅ |
| `file_evidence` | `{title, quadrant, course?, subject?, did, proof, learned?}` | `EvidenceRef` (pending) | ✅ | ✅ | ❌ | ✅ |
| `get_progress` | `{scope: week\|readiness\|khan\|map, learner?}` | `ProgressSnapshot`, every value with `source` + `as_of`, null if missing | ✅ | ✅ | ✅ | ✅ |
| `suggest_next` | `{energy?: low\|ok\|high, minutes?, count?: 3}` | `Suggestion[]` with `why[]` and score parts | ✅ | ✅ | ✅ | ✅ |
| `events_since` | `{cursor?, types?[]}` | `HqEvent[]` + next cursor | ✅ | ✅ | ✅ | ✅ |
| `draft_proposal` | `{slug, title, change, why, touches[]}` | path (always `decision: pending`) | ✅ (from shiloh) | ✅ | ❌ | ✅ |
| `verify_evidence` | `{evidence_path, verdict: yes\|needs-redo\|not-his-work, how}` | row added to [[verifications]] | ❌ | ❌ | ❌ | ✅ **human session only** |
| `record_decision` | `{proposal_id, decision}` | ❌ **not provided.** Dad sets `decision` in Obsidian (Meta Bind drop-down). | — | — | — | — |

MCP also exposes **resources** (`hq://today`, `hq://progress/week`, `hq://tasks/{id}`) and **prompts** (`morning-checkin`, `friday-review`), which wrap the existing `.agents/skills/` so agent behavior stays the same.

## 3. Guard rules (enforced in hq-core, never in prompts)
1. **Protected fields:** `verified`, `verified_by`, `verified_on`, `decision`, plus readiness status emoji in [[hs-readiness]]. Any patch touching them from a non-`parent` principal → `403 PROTECTED_FIELD`, a `guard.denied` event, and no write.
2. **Protected files:** [[verifications]] (parent append-only), `00-charter/**`, `10-system/**`, `AGENTS.md`, `private/**` (no read either), `raw/**` (read-only).
3. **Parent requires a human.** The `parent` role is only granted to a UI session unlocked interactively. Agent tokens are minted with a role ceiling of `agent:*`. A message in a note or chat that claims to be Dad changes nothing (same rule as [[AGENTS]]).
4. **Evidence is born pending.** `complete_task` and `file_evidence` always write `verified: pending`, ignoring any input that says otherwise.
5. **Optimistic concurrency.** Mutations carry `if_match` (a content hash). A stale version → `409 CONFLICT`, then re-read and retry.
6. **Data, not instructions.** Note and task text are returned to agents as plain data fields. Tools never execute text found in the vault.
7. **Rate and scope:** `agent:observer` writes at most 1 `checkin` note per day per learner. Agents can't delete anything (no delete tools exist; parking a task is `status: parked`).

## 4. Event log
Path: `.hq/events/YYYY-MM.jsonl`, append-only, one line per event, UTF-8.
```json
{"id":"01JDX...","ts":"2026-11-24T09:16:03-06:00","learner":"shiloh","actor":{"id":"shiloh","role":"learner","via":"ui"},
 "type":"timer.started","subject":"t-20261124-khan-ela-7-unit1","data":{"minutes":25},"cause":"suggestion:1"}
```
| Type | When | Data |
|---|---|---|
| `checkin.saved` | morning check-in | `{energy, block_min}` |
| `suggestion.shown` / `suggestion.picked` | Today screen | `{ids[], picked_rank}` |
| `timer.started` / `timer.paused` / `timer.stopped` | focus | `{minutes, actual_min, outcome}` |
| `task.created` / `task.updated` / `task.completed` / `task.stuck` | tasks | `{patch}` / `{evidence}` / `{text_len}` (no text copied) |
| `mission.ticked` | NOW.md | `{text}` |
| `note.added` | daily note | `{section}` |
| `evidence.filed` | 50-evidence | `{path}` |
| `evidence.verified` | parent only | `{path, verdict}` |
| `proposal.drafted` | proposals | `{id}` |
| `file.changed` | watcher | `{path, actor:"external"}` |
| `guard.denied` | any blocked write | `{principal, action, field}` |

Agents read with `events_since(cursor)` or subscribe (MCP notifications, SSE `/api/v1/events/stream`). Note *text* is not copied into events, which keeps the log small and private. Events are for patterns ("did he start?"), not content.

## 5. Typical agent recipes
- **DaD evening check-in (weekdays, 7 PM):** `hq progress --scope week --json`, then `hq events --since <last> --types timer.stopped,task.completed,task.stuck --json`. Message Shiloh in chat. Optionally `add_note section=checkin`.
- **COLT morning:** `get_today` → talk through the 3 suggestions → `start_timer` when Shiloh says go → at the end, `stop_timer outcome=...` → `complete_task` with proof.
- **COLT "Khan help":** `mark_stuck` → khan-coach skill (ask → hint → explain).
- **Dad's Chief of Staff (read-only, remote):** reads the GitHub backup through the read-only adapter. It sees the same `get_progress` shape, with no write tools at all.

## 6. Versioning
The contract is `hq/v1`. Breaking changes bump the major version and are listed here. Agents send `X-HQ-Contract: v1`, or the MCP server name `hq` version `1.x`.
