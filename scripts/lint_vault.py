"""Vault lint: skill front matter, broken wikilinks, AGENTS.md size, proposal format."""
import os, re, sys
errs = []
root = sys.argv[1] if len(sys.argv) > 1 else "."
skip = {".git", ".obsidian", "private", "node_modules"}
notes = {}
for dp, dn, fn in os.walk(root):
    dn[:] = [d for d in dn if d not in skip and not (dp == root and d == ".claude")]
    for f in fn:
        if f.endswith(".md"):
            notes.setdefault(f[:-3], []).append(os.path.join(dp, f))
# 1. skills
sk = os.path.join(root, ".agents/skills")
for s in sorted(os.listdir(sk)):
    p = os.path.join(sk, s, "SKILL.md")
    t = open(p).read() if os.path.exists(p) else ""
    m = re.match(r"---\n(.*?)\n---", t, re.S)
    fm = m.group(1) if m else ""
    if f"name: {s}" not in fm: errs.append(f"{p}: front matter name must be '{s}'")
    d = re.search(r"^description: (.+)$", fm, re.M)
    if not d or len(d.group(1)) > 1024: errs.append(f"{p}: missing/too-long description")
# 2. AGENTS.md size
n = len(open(os.path.join(root, "AGENTS.md")).read().splitlines())
if n > 120: errs.append(f"AGENTS.md is {n} lines (max 120)")
# 3. wikilinks
for name, paths in notes.items():
    for p in paths:
        for link in re.findall(r"\[\[([^\]|#\\]+)", open(p).read()):
            tgt = os.path.basename(link.strip())
            if tgt.endswith(".md"): tgt = tgt[:-3]
            if tgt not in notes and "/" not in link and not p.endswith(("TEMPLATE.md","_squire-template.md")):
                errs.append(f"{p}: broken link [[{link}]]")
# 4. duplicate note names break wikilinks
for name, paths in notes.items():
    if len(paths) > 1 and name not in ("README", "SKILL"):
        errs.append(f"duplicate note name '{name}': {paths}")
# 5. proposals
pd = os.path.join(root, "proposals")
for f in sorted(os.listdir(pd)) if os.path.isdir(pd) else []:
    if f.endswith(".md") and f != "TEMPLATE.md":
        t = open(os.path.join(pd, f)).read()
        for k in ("id:", "decision:", "## Change"):
            if k not in t: errs.append(f"proposals/{f}: missing '{k}'")
print("\n".join(errs) or "vault lint: OK")
sys.exit(1 if errs else 0)
