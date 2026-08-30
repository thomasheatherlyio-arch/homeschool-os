import Link from 'next/link'
import { requireFamilyMember, resolveTargetStudentId, currentWeekMonday } from '@/lib/auth'
import { AppNav } from '@/components/AppNav'
import {
  addMission,
  addEvidence,
  setQuadrantScore,
  addMentor,
  logMentorSession,
  addContract,
} from './actions'
import { MissionStatusForm } from './MissionStatusForm'
import { ContractStatusForm } from './ContractStatusForm'

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
type Mentor = {
  id: string
  name: string
  tier: 'knight' | 'squire'
  persona_type: 'ai_persona' | 'irl'
  quadrant_id: string | null
}
type MentorSessionRow = {
  id: string
  mentor_id: string
  quadrant_id: string
  occurred_on: string
  notes: string
  resulting_action: string | null
  mentors: { name: string } | null
}
type ContractRow = {
  id: string
  title: string
  student_commitment: string
  provider_commitment: string
  definition_of_done: string
  review_date: string | null
  status: 'active' | 'completed'
}

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

  // Bound the score history pull to the last 8 weeks — plenty to find this
  // week's score (if set) and the prior one for the trend arrow, without the
  // query growing unboundedly as more weeks accumulate over years of use.
  const scoreWindowStart = new Date(weekOf)
  scoreWindowStart.setDate(scoreWindowStart.getDate() - 7 * 8)
  const scoreWindowStartStr = scoreWindowStart.toISOString().slice(0, 10)

  const [
    { data: quadrants },
    { data: missions },
    { data: scores },
    { data: evidence },
    { data: subjects },
    { data: mentors },
    { data: mentorSessions },
    { data: contracts },
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
      .gte('week_of', scoreWindowStartStr)
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
    supabase
      .from('mentors')
      .select('id, name, tier, persona_type, quadrant_id')
      .order('name')
      .returns<Mentor[]>(),
    supabase
      .from('mentor_sessions')
      .select('id, mentor_id, quadrant_id, occurred_on, notes, resulting_action, mentors(name)')
      .eq('student_id', studentId)
      .order('occurred_on', { ascending: false })
      .limit(20)
      .returns<MentorSessionRow[]>(),
    supabase
      .from('contracts')
      .select('id, title, student_commitment, provider_commitment, definition_of_done, review_date, status')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .returns<ContractRow[]>(),
  ])

  const quadrantList = quadrants ?? []
  const missionList = missions ?? []
  const evidenceList = evidence ?? []
  const subjectList = subjects ?? []
  const mentorList = mentors ?? []
  const mentorSessionList = mentorSessions ?? []
  const openContracts = (contracts ?? []).filter((c) => c.status === 'active')
  const completedContracts = (contracts ?? []).filter((c) => c.status === 'completed')

  // "This week" only counts if it's actually scored for the current week_of
  // — an older score is shown separately as "last scored," never silently
  // reused as if it were current (and never prefilled into the update form,
  // where resubmitting it would wrongly stamp a stale number onto this week).
  const scoreByQuadrant = new Map<string, { thisWeek?: number; lastKnown?: number; lastKnownOn?: string }>()
  for (const row of scores ?? []) {
    const entry = scoreByQuadrant.get(row.quadrant_id) ?? {}
    if (row.week_of === weekOf) {
      entry.thisWeek = row.score
    } else if (entry.lastKnown === undefined) {
      entry.lastKnown = row.score
      entry.lastKnownOn = row.week_of
    }
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
              s?.thisWeek !== undefined && s?.lastKnown !== undefined
                ? s.thisWeek > s.lastKnown
                  ? '▲'
                  : s.thisWeek < s.lastKnown
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
                  {s?.thisWeek ?? '—'}
                  <span className="text-xs font-normal text-zinc-500">/10</span>
                  {trend && <span className="ml-1 text-sm">{trend}</span>}
                </div>
                {s?.thisWeek === undefined && s?.lastKnown !== undefined && (
                  <div className="text-[11px] text-zinc-500">
                    Last scored {s.lastKnown}/10 on {s.lastKnownOn}
                  </div>
                )}
                <form action={setQuadrantScore.bind(null, q.id)} className="flex gap-1">
                  <input
                    type="number"
                    name="score"
                    min={0}
                    max={10}
                    defaultValue={s?.thisWeek ?? ''}
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

      {/* Mentor Session Log */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">Mentor Session Log</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {mentorSessionList.length === 0 && (
            <li className="text-sm text-zinc-500">No mentor sessions logged yet.</li>
          )}
          {mentorSessionList.map((s) => (
            <li key={s.id} className="rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>
                  {s.mentors?.name ?? 'Unknown mentor'} · {quadrantLabel(s.quadrant_id)}
                </span>
                <span>{s.occurred_on}</span>
              </div>
              <div className="mt-1 text-sm">{s.notes}</div>
              {s.resulting_action ? (
                <div className="mt-1 text-xs text-zinc-500">Resulting action: {s.resulting_action}</div>
              ) : (
                <div className="mt-1 text-xs text-zinc-400 italic">No resulting action logged</div>
              )}
            </li>
          ))}
        </ul>

        {mentorList.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            No mentors seated yet — add one below before logging a session.
          </p>
        ) : (
          <form
            action={logMentorSession}
            className="mt-4 flex flex-col gap-2 rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700"
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                name="mentor_id"
                required
                defaultValue=""
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="" disabled>
                  Mentor…
                </option>
                {mentorList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.tier})
                  </option>
                ))}
              </select>
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
                type="date"
                name="occurred_on"
                defaultValue={today}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <textarea
              name="notes"
              placeholder="What was discussed…"
              required
              rows={2}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <input
              type="text"
              name="resulting_action"
              placeholder="What changed as a result (optional)"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="submit"
              className="self-start rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
            >
              Log session
            </button>
          </form>
        )}

        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-zinc-500">Add a mentor</summary>
          <form action={addMentor} className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              name="name"
              placeholder="Mentor name"
              required
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <select
              name="tier"
              defaultValue="squire"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="knight">Knight</option>
              <option value="squire">Squire</option>
            </select>
            <select
              name="persona_type"
              defaultValue="irl"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="irl">Real person</option>
              <option value="ai_persona">AI persona</option>
            </select>
            <select
              name="quadrant_id"
              defaultValue=""
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="">Primary quadrant (optional)…</option>
              {quadrantList.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.emoji} {q.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
            >
              Add mentor
            </button>
          </form>
        </details>
      </section>

      {/* Open Contracts */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">Open Contracts</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {openContracts.length === 0 && (
            <li className="text-sm text-zinc-500">No active contracts right now.</li>
          )}
          {openContracts.map((c) => (
            <li key={c.id} className="rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{c.title}</span>
                <ContractStatusForm contractId={c.id} status={c.status} />
              </div>
              <dl className="mt-1 flex flex-col gap-0.5 text-xs text-zinc-500">
                <div>
                  <dt className="inline font-medium">Student commits:</dt>{' '}
                  <dd className="inline">{c.student_commitment}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Provides:</dt>{' '}
                  <dd className="inline">{c.provider_commitment}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Done looks like:</dt>{' '}
                  <dd className="inline">{c.definition_of_done}</dd>
                </div>
                {c.review_date && (
                  <div>
                    <dt className="inline font-medium">Review:</dt> <dd className="inline">{c.review_date}</dd>
                  </div>
                )}
              </dl>
            </li>
          ))}
        </ul>

        {completedContracts.length > 0 && (
          <details className="mt-3 text-sm">
            <summary className="cursor-pointer text-zinc-500">
              {completedContracts.length} completed contract{completedContracts.length === 1 ? '' : 's'}
            </summary>
            <ul className="mt-2 flex flex-col gap-2">
              {completedContracts.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
                  <span className="text-sm">{c.title}</span>
                  <ContractStatusForm contractId={c.id} status={c.status} />
                </li>
              ))}
            </ul>
          </details>
        )}

        <form
          action={addContract}
          className="mt-4 flex flex-col gap-2 rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700"
        >
          <input
            type="text"
            name="title"
            placeholder="Contract title"
            required
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <textarea
            name="student_commitment"
            placeholder="What Shiloh commits to…"
            required
            rows={2}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <textarea
            name="provider_commitment"
            placeholder="What Thomas provides…"
            required
            rows={2}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <textarea
            name="definition_of_done"
            placeholder="What &quot;done&quot; looks like…"
            required
            rows={2}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-500" htmlFor="review_date">
              Review by (optional)
            </label>
            <input
              id="review_date"
              type="date"
              name="review_date"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <button
            type="submit"
            className="self-start rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
          >
            Add contract
          </button>
        </form>
      </section>
    </main>
  )
}
