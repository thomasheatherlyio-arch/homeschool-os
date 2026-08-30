# Shiloh's Home School OS — Business Plan

*Working doc — Claude edits this directly.*

## What this is
A private, single-family web app to run our homeschool: curriculum and lesson planning,
scheduling and attendance, grades/records, and a resource library for materials
(worksheets, scanned work, links, books). Not a product for other families — built to
solve our own family's homeschool organization, accessible from any device in the house
(and remotely).

## Target customer
N/A as a product — this is an internal family tool. If the scope ever changes toward
supporting other homeschool families, this section gets rewritten first, before any
multi-tenant work starts.

## Positioning
N/A — not commercialized.

## Competitive landscape
Not researched — not applicable while this stays a private family tool. If/when we
consider opening this to other families, revisit this section against existing
homeschool management tools before building anything multi-tenant.

## Business model
None — private use only. No revenue, no pricing, no other users' data to protect beyond
our own family's.

## Key risks / open questions
- Data privacy: this holds kids' school records — decide whether the deployed app needs
  extra access protection beyond normal login (e.g. Vercel password protection, IP
  restriction) on top of Supabase auth.
- State reporting requirements: some states require homeschool attendance/records in a
  specific format — research what (if anything) applies to us before finalizing the
  records/grading data model, so we don't have to restructure it later.
- Scope: four feature areas (curriculum planning, scheduling/attendance, records/grading,
  resource library) is a lot for a first build — consider whether to sequence these
  rather than build all four before anything is usable day-to-day.
