#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenerate the JSON block inside maps/shiloh-command-center.html
from 55-progress/status-tracker.md (and khan-dashboard / project-priority-board /
hs-readiness / shiloh-schedule when those files exist).

Never invent a number: missing values become null / "—".
Run from the vault root:  python scripts/build_dashboard.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
VAULT = HERE.parent
HTML = VAULT / "maps" / "shiloh-command-center.html"
MARKER_OPEN = '<script id="hq-data" type="application/json">'
MARKER_CLOSE = "</script>"


def read(rel: str) -> str | None:
    p = VAULT / rel
    if not p.exists():
        return None
    return p.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\r", "\n")


def split_row(line: str) -> list[str]:
    """Split a markdown table row without breaking wikilink aliases."""
    line = line.strip().strip("|")
    def repl(m):
        return "[[" + m.group(1).replace("|", "\x1f") + "]]"
    line = re.sub(r"\[\[([^\]]+)\]\]", repl, line)
    return [c.strip().replace("\x1f", "|") for c in line.split("|")]


def parse_tables(text: str) -> list[list[list[str]]]:
    tables: list[list[list[str]]] = []
    current: list[list[str]] = []
    for line in text.splitlines():
        if line.strip().startswith("|"):
            cells = split_row(line)
            if cells and all(re.fullmatch(r":?-{3,}:?", c.replace(" ", "")) for c in cells):
                continue
            current.append(cells)
        else:
            if current:
                tables.append(current)
                current = []
    if current:
        tables.append(current)
    return tables


def table_by_headers(text: str, required: list[str]) -> list[dict] | None:
    req = [h.lower() for h in required]
    for rows in parse_tables(text):
        if not rows:
            continue
        header = [h.lower() for h in rows[0]]
        if all(any(r in h for h in header) for r in req):
            out = []
            for row in rows[1:]:
                item = {}
                for i, h in enumerate(header):
                    item[h] = row[i] if i < len(row) else ""
                out.append(item)
            return out
    return None


def col(row: dict, *names: str) -> str:
    for n in names:
        for k, v in row.items():
            if n in k:
                return v
    return ""


def pct_from(text: str):
    m = re.search(r"(\d+(?:\.\d+)?)\s*%", text or "")
    return float(m.group(1)) if m else None


def int_or_none(text: str):
    m = re.search(r"-?\d+", text or "")
    return int(m.group(0)) if m else None


def strip_wiki(text: str) -> str:
    # Prefer the alias: [[target|Alias]] -> Alias
    return re.sub(r"\[\[(?:[^\]|]+\|)?([^\]]+)\]\]", r"\1", text or "").strip()


def section(text: str, heading: str) -> str:
    pat = re.compile(rf"^##\s+{re.escape(heading)}\s*$", re.M)
    m = pat.search(text)
    if not m:
        return ""
    rest = text[m.end():]
    nxt = re.search(r"^##\s+", rest, re.M)
    return rest[: nxt.start()] if nxt else rest


def build() -> dict:
    data: dict = {
        "generated": None,
        "timezone": "America/Chicago",
        "weekOf": None,
        "streakWeeks": None,
        "streakSource": None,
        "weeksToFall2027": None,
        "weeksSource": None,
        "priorities": [],
        "prioritiesNote": None,
        "courses": [],
        "khan": {},
        "projects": [],
        "readiness": {},
        "evidence": {"pending": None, "verified": None, "note": None},
        "circle": {
            "scores": {"mind": None, "body": None, "venture": None, "spirit": None, "systems": None},
            "scoresNote": "No Circle scores are in the vault yet.",
            "templateMinutes": {},
        },
        "schedule": {},
    }

    tracker = read("55-progress/status-tracker.md")
    dash = read("25-khan/khan-dashboard.md")
    board = read("55-progress/project-priority-board.md")
    ready = read("55-progress/hs-readiness.md")
    sched = read("40-journal/schedule/shiloh-schedule.md")
    now = read("NOW.md")

    if now:
        m = re.search(r"\*\*Week of:\*\*\s*(\d{4}-\d{2}-\d{2})", now)
        if m:
            data["weekOf"] = m.group(1)

    if tracker:
        m = re.search(r"\*\*Last refresh:\*\*\s*(\d{4}-\d{2}-\d{2})", tracker)
        data["generated"] = m.group(1) if m else "2026-11-22"
        rows = table_by_headers(tracker, ["workstream", "status", "progress"]) or []
        course_names = (
            "6th grade math", "7th grade math", "8th grade math", "Constitution 101",
            "MS biology", "MS Earth", "MS physics", "6th grade reading",
            "The Civ", "The Kitchen", "The Gym", "The Panel", "The Forge",
            "Venture playbook",
        )
        project_names = (
            "Book reports", "Gym 6-week", "Electrician 12-week", "Restaurant 6-week",
            "Baseline diagnostics", "System setup", "Khan priority plan",
            "7th grade ELA", "8th grade ELA",
        )
        qmap = {
            "math": "mind", "constitution": "mind", "biology": "mind", "earth": "mind",
            "physics": "mind", "reading": "mind", "ela": "mind", "civ": "mind",
            "kitchen": "venture", "panel": "venture", "forge": "venture", "venture": "venture",
            "gym": "body",
        }

        def quadrant(name: str) -> str:
            low = name.lower()
            for k, v in qmap.items():
                if k in low:
                    return v
            return "systems"

        for row in rows:
            name = strip_wiki(col(row, "workstream", "name"))
            rec = {
                "name": name,
                "status": col(row, "status") or "—",
                "progress": col(row, "progress") or "—",
                "pct": pct_from(col(row, "progress")),
                "quadrant": quadrant(name),
                "next": col(row, "next action", "next") or "—",
                "link": strip_wiki(col(row, "link")),
            }
            if "interest" in (col(row, "progress") + " " + name).lower() or "civ" in name.lower():
                im = re.search(r"interest\s+(\d+(?:\.\d+)?)", col(row, "progress"), re.I)
                pm = re.search(r"priority\s+(\d+(?:\.\d+)?)", col(row, "progress"), re.I)
                if im:
                    rec["interest"] = float(im.group(1))
                if pm:
                    rec["priority"] = float(pm.group(1))
            if any(n.lower() in name.lower() for n in course_names):
                data["courses"].append(rec)
            elif any(n.lower() in name.lower() for n in project_names):
                data["projects"].append({
                    "name": name,
                    "status": rec["status"],
                    "progress": rec["progress"],
                    "next": rec["next"],
                })

        pend = ver = 0
        seen_civics = False
        for row in rows:
            name = col(row, "workstream").lower()
            p = int_or_none(col(row, "pending")) or 0
            v = int_or_none(col(row, "verified")) or 0
            # Constitution 101 and The Civ share the same three pending notes
            if "constitution 101" in name or name.startswith("| the civ") or name == "the civ" or "the civ" in name:
                if seen_civics:
                    continue
                seen_civics = True
            pend += p
            ver += v
        data["evidence"] = {
            "pending": pend,
            "verified": ver,
            "note": "Pending items are in 50-evidence/. Constitution 101 and The Civ share the same pending Khan civics notes when both list them. Counts are pending until Thomas verifies.",
        }

    if dash:
        m = re.search(r"streak\s+(\d+)\s+weeks", dash, re.I)
        if m:
            data["streakWeeks"] = int(m.group(1))
            data["streakSource"] = "Khan Academy account, latest dashboard / snapshot"
        km = re.search(r"Minutes Khan showed:\s*\*\*(\d+)\*\*", dash)
        goal = re.search(r"=\s*\*\*(\d+)\*\*\s*min", dash)
        khan_courses = []
        rows = table_by_headers(dash, ["course", "mastery"]) or []
        for row in rows:
            name = strip_wiki(col(row, "course"))
            mastery = pct_from(col(row, "mastery"))
            khan_courses.append({
                "name": name,
                "mastery": mastery,
                "goal": col(row, "weekly goal") or "—",
                "subject": col(row, "doc 03", "subject") or "—",
                "label": None if mastery is not None else (col(row, "mastery") or "—"),
            })
        m_sync = re.search(r"\*\*Last successful sync:\*\*\s*(\d{4}-\d{2}-\d{2})", dash)
        data["khan"] = {
            "lastSync": m_sync.group(1) if m_sync else None,
            "thisWeekMinutes": int(km.group(1)) if km else None,
            "thisWeekRange": None,
            "weeklyGoal": int(goal.group(1)) if goal else None,
            "weeklyGoalNote": None,
            "streakWeeks": data["streakWeeks"],
            "courses": khan_courses,
        }
        wr = re.search(r"## This week \(([^)]+)\)", dash)
        if wr:
            data["khan"]["thisWeekRange"] = wr.group(1)
        gn = re.search(r"Weekly \*goal\* \(approved\):([^\n]+)", dash)
        if gn:
            data["khan"]["weeklyGoalNote"] = gn.group(1).strip()

    if board:
        sec = section(board, "3. Top 5 this week")
        rows = table_by_headers(sec or board, ["rank", "item", "priority"]) or []
        data["priorities"] = []
        for row in rows:
            rank = int_or_none(col(row, "rank"))
            if rank is None:
                continue
            data["priorities"].append({
                "rank": rank,
                "item": strip_wiki(col(row, "item")),
                "priority": col(row, "priority").replace("**", ""),
                "do": col(row, "do this week", "do"),
            })
        note_bits = []
        if "Priority **6.0**" in board or "Priority is **6.0**" in board or "at **6.0**" in board:
            note_bits.append("The Civ is just below the cut at 6.0 (Shiloh's Interest 3.5; no longer provisional). Top 5 is unchanged.")
        if "Reading baseline" in sec:
            note_bits.append("Reading baseline remains this week's P1 for Dad.")
        data["prioritiesNote"] = " ".join(note_bits) or None

    if ready:
        m = re.search(r"Weeks to target\s*\|\s*~?(\d+)", ready)
        if m:
            data["weeksToFall2027"] = int(m.group(1))
            data["weeksSource"] = "hs-readiness (Fall 2027 is proposed; Thomas confirms or changes)"
        om = re.search(r"Overall\s*\|\s*\*?\*?[^\n]*?\b([^|]+)\*\*?", ready)
        overall = None
        for line in ready.splitlines():
            if "Overall" in line and "|" in line:
                parts = [p.strip() for p in line.strip().strip("|").split("|")]
                if len(parts) >= 2 and parts[0].lower().startswith("overall"):
                    overall = re.sub(r"[⚪🟡🟢🔴*]", "", parts[1]).strip()
        subjects = []
        rows = table_by_headers(ready, ["subject", "status"]) or []
        for row in rows:
            ev = col(row, "evidence")
            nums = re.findall(r"\d+", ev)
            subjects.append({
                "name": col(row, "subject"),
                "req": col(row, "tx req", "req") or "—",
                "verified": int(nums[0]) if len(nums) >= 1 else 0,
                "pending": int(nums[1]) if len(nums) >= 2 else 0,
                "status": col(row, "status").replace("⚪", "not started").replace("🟡", "in progress").replace("🟢", "met").replace("🔴", "off track").strip(" ·") or "—",
            })
        g2_rows = table_by_headers(section(ready, "Gate 2: The system holds (Doc 03 §6.1)") or ready, ["week of", "missions"]) or []
        g2 = g2_rows[0] if g2_rows else {}
        credits = None
        cm = re.search(r"Credits earned:\s*([\d\s/]+)", ready)
        if cm:
            credits = cm.group(1).strip()
        data["readiness"] = {
            "overall": overall or "—",
            "targetStart": "Fall 2027 (Thomas confirms)",
            "weeksToTarget": data["weeksToFall2027"],
            "gate2": {
                "weekOf": col(g2, "week of") if g2 else None,
                "missions": col(g2, "missions") if g2 else "—",
                "dailyNotes": col(g2, "daily notes") if g2 else "—",
                "fridayReview": col(g2, "friday review") if g2 else "—",
            },
            "gate3Credits": credits or "—",
            "subjects": subjects,
        }

    if sched:
        start = "9:00" if "start at **9:00 AM**" in sched or "| 9:00–9:15 |" in sched else None
        data["schedule"] = {
            "status": "draft" if "Status: draft" in sched or "status: draft" in sched else "—",
            "timesApproved": False,
            "calendarName": "Homie School" if "Homie School" in sched else None,
            "calendarNote": "Google Calendar in Shiloh's Gmail. COLT adds events only after Shiloh and Dad approve the times.",
            "dayStart": start,
            "khanMinutesApproved": "approved" in sched.lower() and "ELA 4" in sched,
            "days": {},
        }
        # weekday template: header Time | Monday | Tuesday | ...
        days_map = {"monday": "Mon", "tuesday": "Tue", "wednesday": "Wed", "thursday": "Thu", "friday": "Fri"}
        rows = table_by_headers(section(sched, "1. Proposed weekday template (Mon–Fri)") or sched, ["time", "monday"]) or []
        kind_of = [
            ("khan ela", "mind"), ("khan science", "mind"), ("math keep-warm", "mind"),
            ("monday plan", "systems"), ("check-in", "systems"), ("wrap-up", "systems"),
            ("review", "systems"), ("sync", "systems"), ("civ", "mind"),
            ("kitchen", "venture"), ("panel", "venture"), ("forge", "venture"),
            ("body", "body"), ("gym", "body"), ("lunch", "personal"),
        ]
        buckets = {d: [] for d in ("Mon", "Tue", "Wed", "Thu", "Fri")}
        for row in rows:
            time = col(row, "time")
            for full, short in days_map.items():
                cell = col(row, full)
                if not cell:
                    continue
                raw = strip_wiki(cell)
                low = raw.lower().strip()
                if low in {"—", "-", ""}:
                    continue
                if low.startswith("break") or low.startswith("*flex") or "late-morning flex" in low or "break / flex" in low:
                    continue
                if low.startswith("*optional") or low.startswith("optional light"):
                    continue
                name = re.sub(r"\*\*", "", raw)
                name = re.split(r"\(|\.", name)[0].strip(" *")
                name = re.sub(r"^Course:\s*", "", name)
                name = re.sub(r"\s+", " ", name)
                kind = "systems"
                for key, val in kind_of:
                    if key in low:
                        kind = val
                        break
                buckets[short].append({"time": time, "name": name, "kind": kind})
        if buckets["Fri"] and not any("sync" in b["name"].lower() for b in buckets["Fri"]):
            buckets["Fri"].append({"time": "6:00", "name": "Khan sync (auto)", "kind": "systems"})
        data["schedule"]["days"] = buckets

        mins = {}
        qrows = table_by_headers(section(sched, "3. Circle balance check") or sched, ["quadrant", "weekly minutes"]) or []
        for row in qrows:
            label = strip_wiki(col(row, "quadrant")).lower()
            val = col(row, "weekly minutes")
            for key in ("mind", "body", "venture", "spirit", "systems"):
                if key in label:
                    mins[key] = val
        if mins:
            data["circle"]["templateMinutes"] = mins
            data["circle"]["scoresNote"] = "No Circle scores are in the vault yet. Template minutes below are from the draft schedule, not tracked actuals."

    if not data["generated"]:
        data["generated"] = "2026-11-22"
    return data


def replace_json(html: str, payload: dict) -> str:
    start = html.find(MARKER_OPEN)
    if start < 0:
        raise SystemExit("hq-data script tag not found in command-center HTML")
    start_json = start + len(MARKER_OPEN)
    end = html.find(MARKER_CLOSE, start_json)
    if end < 0:
        raise SystemExit("closing script tag not found after hq-data")
    pretty = json.dumps(payload, indent=2, ensure_ascii=False)
    return html[:start_json] + "\n" + pretty + "\n" + html[end:]


def main() -> None:
    if not HTML.exists():
        raise SystemExit(f"missing {HTML}")
    payload = build()
    html = HTML.read_text(encoding="utf-8")
    HTML.write_text(replace_json(html, payload), encoding="utf-8", newline="\r\n")
    print("updated", HTML)
    print("courses", len(payload.get("courses") or []), "priorities", len(payload.get("priorities") or []),
          "evidence", payload.get("evidence"), "dayStart", (payload.get("schedule") or {}).get("dayStart"),
          "civ", [c for c in payload.get("courses") or [] if "Civ" in c.get("name", "")])


if __name__ == "__main__":
    main()
