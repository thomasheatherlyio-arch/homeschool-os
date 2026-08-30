import Link from 'next/link'
import { requireFamilyMember, resolveTargetStudentId, currentWeekMonday } from '@/lib/auth'
import { AppNav } from '@/components/AppNav'
import { addMission, addEvidence, setQuadrantScore } from './actions'
import { MissionStatusForm } from './MissionStatusForm'

// Weekly data (missions, scores) changes independently of this page's own
// forms (a parent and a student can both be looking at it), so always read
// fresh rather than serve a static build.
export const dynamic = 'force-dynamic'

type Quadrant = { id: string; name: string; emoji: string | null; sort_order: number }
type Mission = {
  id: string
  quadrant_id: string
  title: string
  done_looks_like: string | null
  status: string
}
type ScoreRow = { quadrant_id: string; week_of: string; score: number }
type EvidenceRow = {
  id: string
  quadrant_id: string
  description: string
  evidence_type: string | null
  link: string | null
  occurred_on: string
  subjects: { name: string } | null
}
type SubjectOption = { id: string; name: string }

export default async function DashboardPage() {
  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)

  if (!studentId) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <AppNav role={member.role} active="/dashboard" />
        <h1 className="mt-6 text-2xl font-semibold">Dashboard</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          No student set up yet.{' '}
          {member.role === 'parent' ? (
            <>
              Invite one from{' '}
              <Link href="/family" className="underline">
                Family
              </Link>
              .
            </>
          ) : null}
        </p>
      </main>
    )
  }

  const weekOf = currentWeekMonday()
  const today = new Date().toISOString().slice(0, 10)

  const [
    { data: quadrants },
    { data: missions },
    { data: scores },
    { data: evidence },
    { data: subjects },
  ] = await Promise.all([
    supabase.from('quadrants').select('id, name, emoji, sort_order').order('sort_order').returns<Quadrant[]>(),
    supabase
      .from('missions')
      .select('id, quadrant_id, title, done_looks_like, status')
      .eq('student_id', studentId)
      .eq('week_of', weekOf)
      .order('created_at')
      .returns<Mission[]>(),
    supabase
      .from('quadrant_scores')
      .select('quadrant_id, week_of, score')
      .eq('student_id', studentId)
      .order('week_of', { ascending: false })
      .returns<ScoreRow[]>(),
    supabase
      .from('evidence_log_entries')
      .select('id, quadrant_id, description, evidence_type, link, occurred_on, subjects(name)')
      .eq('student_id', studentId)
      .order('occurred_on', { ascending: false })
      .limit(20)
      .returns<EvidenceRow[]>(),
    supabase.from('subjects').select('id, name').order('name').returns<SubjectOption[]>(),
  ])

  const quadrantList = quadrants ?? []
  const missionList = missions ?? []
  const evidenceList = evidence ?? []
  const subjectList = subjects ?? []

  const scoreByQuadrant = new Map<string, { latest?: number; previous?: number }>()
  for (const row of scores ?? []) {
    const entry = scoreByQuadrant.get(row.quadrant_id) ?? {}
    if (entry.latest === undefined) entry.latest = row.score
    else if (entry.previous === undefined) entry.previous = row.score
    scoreByQuadrant.set(row.quadrant_id, entry)
  }

  const quadrantLabel = (id: string) => {
    const q = quadrantList.find((q) => q.id === id)
    return q ? `${q.emoji ?? ''} ${q.name}`.trim() : id
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <AppNav role={member.role} active="/dashboard" />
      <h1 className="mt-6 text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Week of {weekOf}
      </p>

      {/* Circle Snapshot */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">Circle Snapshot</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {quadrantList.map((q) => {
            const s = scoreByQuadrant.get(q.id)
            const trend =
              s?.latest !== undefined && s?.previous !== undefined
                ? s.latest > s.previous
                  ? '▲'
                  : s.latest < s.previous
                    ? '▼'
                    : '–'
                : null
            return (
              <div
                key={q.id}
                className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <div className="text-xs font-medium">
                  {q.emoji} {q.name}
                </div>
                <div className="text-xl font-semibold">
                  {s?.latest ?? '—'}
                  <span className="text-xs font-normal text-zinc-500">/10</span>
                  {trend && <span className="ml-1 text-sm">{trend}</span>}
                </div>
                <form action={setQuadrantScore.bind(null, q.id)} className="flex gap-1">
                  <input
                    type="number"
                    name="score"
                    min={0}
                    max={10}
                    defaultValue={s?.latest ?? ''}
                    required
                    className="w-14 rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background"
                  >
                    Set
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      </section>

      {/* This Week's Missions */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">This Week&apos;s Missions</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {missionList.length === 0 && (
            <li className="text-sm text-zinc-500">No missions set for this week yet.</li>
          )}
          {missionList.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900"
            >
              <div>
                <div className="text-sm font-medium">
                  {quadrantLabel(m.quadrant_id)} — {m.title}
                </div>
                {m.done_looks_like && (
                  <div className="text-xs text-zinc-500">Done looks like: {m.done_looks_like}</div>
                )}
              </div>
              <MissionStatusForm missionId={m.id} status={m.status} />
            </li>
          ))}
        </ul>

        <form action={addMission} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <select
            name="quadrant_id"
            required
            defaultValue=""
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="" disabled>
              Quadrant…
            </option>
            {quadrantList.map((q) => (
              <option key={q.id} value={q.id}>
                {q.emoji} {q.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="title"
            placeholder="Mission title"
            required
            className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            type="text"
            name="done_looks_like"
            placeholder="Done looks like… (optional)"
            className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="submit"
            className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
          >
            Add mission
          </button>
        </form>
      </section>

      {/* Evidence Inbox */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">Evidence Inbox</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {evidenceList.length === 0 && (
            <li className="text-sm text-zinc-500">No evidence logged yet.</li>
          )}
          {evidenceList.map((e) => (
            <li key={e.id} className="rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>
                  {quadrantLabel(e.quadrant_id)}
                  {e.subjects ? ` · ${e.subjects.name}` : ''}
                </span>
                <span>{e.occurred_on}</span>
              </div>
              <div className="mt-1 text-sm">{e.description}</div>
              {(e.evidence_type || e.link) && (
                <div className="mt-1 text-xs text-zinc-500">
                  {e.evidence_type}
                  {e.evidence_type && e.link ? ' · ' : ''}
                  {e.link && (
                    <a href={e.link} target="_blank" rel="noopener noreferrer" className="underline">
                      link
                    </a>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>

        <form
          action={addEvidence}
          className="mt-4 flex flex-col gap-2 rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              name="quadrant_id"
              required
              defaultValue=""
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="" disabled>
                Quadrant…
              </option>
              {quadrantList.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.emoji} {q.name}
                </option>
              ))}
            </select>
            <select
              name="subject_id"
              defaultValue=""
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="">Subject (optional)…</option>
              {subjectList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="occurred_on"
              defaultValue={today}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <textarea
            name="description"
            placeholder="What happened…"
            required
            rows={2}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              name="evidence_type"
              placeholder="Evidence type (e.g. writing sample)"
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <input
              type="url"
              name="link"
              placeholder="Link (optional)"
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <button
            type="submit"
            className="self-start rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
          >
            Add evidence
          </button>
        </form>
      </section>
    </main>
  )
}
