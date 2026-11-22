---
name: wiki-ingest
description: Turn a source in raw/ (NotebookLM deck, transcript, article) into linked wiki pages, and lint the wiki. Use when Shiloh drops something in raw/ or asks to "add this to the wiki".
---
1. Read only the named raw file. Never edit it.
2. Create/update 1–3 `wiki/<concept>.md` pages: summary, key ideas, wikilinks to related
   wiki pages and courses, `source: [[raw/<file>]]`.
3. Lint (monthly): find orphans, duplicates, broken links; fix or list them in NOW.md.
