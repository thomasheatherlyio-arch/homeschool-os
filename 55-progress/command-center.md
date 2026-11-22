---
type: dashboard
status: active
date: 2026-11-22
updated: 2026-11-22
quadrant: "[[systems-self-command]]"
---
# Command Center

A visual dashboard for Shiloh's week: missions, Khan, courses, readiness, evidence, and the Circle.

Open the file in a browser (or an Obsidian HTML viewer):

`maps/shiloh-command-center.html`

It is self-contained (no network). The numbers come from an embedded JSON block that `scripts/build_dashboard.py` regenerates from [[status-tracker]] (and from [[khan-dashboard]] or the project board when those files exist). If a figure is missing in the vault, the dashboard shows — rather than inventing it.

The living table is [[status-tracker]]. Khan plan: [[khan-priority-plan]]. P1: [[hs-readiness]]. This week's list: [[NOW]].
