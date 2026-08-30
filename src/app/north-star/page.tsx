import { requireFamilyMember, resolveTargetStudentId } from '@/lib/auth'
import { AppNav } from '@/components/AppNav'
import { addVision, addInterestLedgerEntry, addForkLogEntry } from './actions'

export const dynamic = 'force-dynamic'

const HORIZONS = [
  { value: '50yr', label: '50-Year Vision' },
  { value: '30yr', label: '30-Year Vision' },
  { value: '10yr', label: '10-Year Vision' },
  { value: '5yr', label: '5-Year Vision' },
  { value: '3yr', label: '3-Year Vision' },
  { value: '1yr_goals', label: '1-Year Goals' },
  { value: 'quarterly_objective', label: 'Quarterly Objective' },
  { value: 'monthly_target', label: 'Monthly Target' },
] as const

const AUDIT_LABELS: Record<string, string> = {
  energy: 'Energy',
  flow: 'Flow',
  admiration: 'Admiration',
  problem: 'Problem',
  feedback: 'Feedback',
}

type VisionRow = { id: string; horizon: string; body: string; created_at: string }
type InterestEntry = {
  id: string
  occurred_on: string
  audit_type: string
  description: string
  became_small_bet: boolean
  result: string | null
}
type ForkEntry = {
  id: string
  occurred_on: string
  decision_point: string
  door_type: 'two_way' | 'one_way'
  decision: string
  reasoning: string | null
}

export default async function NorthStarPage() {
  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  const today = new Date().toISOString().slice(0, 10)

  if (!studentId) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <AppNav role={member.role} active="/north-star" />
        <h1 className="mt-6 text-2xl font-semibold">North Star</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">No student set up yet.</p>
      </main>
    )
  }

  const [{ data: visions }, { data: interestEntries }, { data: forkEntries }] = await Promise.all([
    supabase
      .from('visions')
      .select('id, horizon, body, created_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .returns<VisionRow[]>(),
    supabase
      .from('interest_ledger_entries')
      .select('id, occurred_on, audit_type, description, became_small_bet, result')
      .eq('student_id', studentId)
      .order('occurred_on', { ascending: false })
      .limit(25)
      .returns<InterestEntry[]>(),
    supabase
      .from('fork_log_entries')
      .select('id, occurred_on, decision_point, door_type, decision, reasoning')
      .eq('student_id', studentId)
      .order('occurred_on', { ascending: false })
      .returns<ForkEntry[]>(),
  ])

  const visionsByHorizon = new Map<string, VisionRow[]>()
  for (const v of visions ?? []) {
    const arr = visionsByHorizon.get(v.horizon) ?? []
    arr.push(v)
    visionsByHorizon.set(v.horizon, arr)
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <AppNav role={member.role} active="/north-star" />
      <h1 className="mt-6 text-2xl font-semibold">North Star</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        The Horizon Ladder, Interest Ledger, and Fork Log — the slower-cadence system behind
        the weekly missions.
      </p>

      {/* Horizon Vision Set */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">Horizon Vision Set</h2>
        <div className="mt-3 flex flex-col gap-4">
          {HORIZONS.map((h) => {
            const entries = visionsByHorizon.get(h.value) ?? []
            const [current, ...history] = entries
            return (
              <div key={h.value} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <h3 className="text-sm font-medium">{h.label}</h3>
                {current ? (
                  <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                    {current.body}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-zinc-500 italic">Not written yet.</p>
                )}
                {history.length > 0 && (
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer text-zinc-500">
                      {history.length} earlier version{history.length === 1 ? '' : 's'}
                    </summary>
                    <ul className="mt-2 flex flex-col gap-2">
                      {history.map((v) => (
                        <li key={v.id} className="border-l-2 border-zinc-200 pl-2 dark:border-zinc-700">
                          <div className="text-zinc-400">{v.created_at.slice(0, 10)}</div>
                          <div className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">{v.body}</div>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                <form action={addVision.bind(null, h.value)} className="mt-3 flex flex-col gap-2">
                  <textarea
                    name="body"
                    placeholder={current ? 'Rewrite this vision…' : `Write a ${h.label.toLowerCase()}…`}
                    required
                    rows={2}
                    className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                  <button
                    type="submit"
                    className="self-start rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background"
                  >
                    {current ? 'Save new version' : 'Save'}
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      </section>

      {/* Interest Ledger */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">Interest Ledger</h2>
        <p className="mt-1 text-xs text-zinc-500">
          The Five Audits: Energy, Flow, Admiration, Problem, Feedback.
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {(interestEntries ?? []).length === 0 && (
            <li className="text-sm text-zinc-500">Nothing logged yet.</li>
          )}
          {(interestEntries ?? []).map((e) => (
            <li key={e.id} className="rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>
                  {AUDIT_LABELS[e.audit_type] ?? e.audit_type}
                  {e.became_small_bet ? ' · small bet' : ''}
                </span>
                <span>{e.occurred_on}</span>
              </div>
              <div className="mt-1 text-sm">{e.description}</div>
              {e.result && <div className="mt-1 text-xs text-zinc-500">Result: {e.result}</div>}
            </li>
          ))}
        </ul>

        <form
          action={addInterestLedgerEntry}
          className="mt-4 flex flex-col gap-2 rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              name="audit_type"
              required
              defaultValue=""
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="" disabled>
                Audit…
              </option>
              {Object.entries(AUDIT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
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
            placeholder="What came up…"
            required
            rows={2}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <label className="flex items-center gap-2 text-xs text-zinc-500">
            <input type="checkbox" name="became_small_bet" />
            Became a small bet
          </label>
          <input
            type="text"
            name="result"
            placeholder="Result (optional — confirmed / ruled out / unclear)"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="submit"
            className="self-start rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
          >
            Add entry
          </button>
        </form>
      </section>

      {/* Fork Log */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">Fork Log</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {(forkEntries ?? []).length === 0 && (
            <li className="text-sm text-zinc-500">No decision points logged yet.</li>
          )}
          {(forkEntries ?? []).map((f) => (
            <li key={f.id} className="rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{f.door_type === 'one_way' ? 'One-way door' : 'Two-way door'}</span>
                <span>{f.occurred_on}</span>
              </div>
              <div className="mt-1 text-sm font-medium">{f.decision_point}</div>
              <div className="mt-1 text-sm">{f.decision}</div>
              {f.reasoning && <div className="mt-1 text-xs text-zinc-500">{f.reasoning}</div>}
            </li>
          ))}
        </ul>

        <form
          action={addForkLogEntry}
          className="mt-4 flex flex-col gap-2 rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              name="decision_point"
              placeholder="What's the decision…"
              required
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <select
              name="door_type"
              defaultValue="two_way"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="two_way">Two-way door</option>
              <option value="one_way">One-way door</option>
            </select>
            <input
              type="date"
              name="occurred_on"
              defaultValue={today}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <textarea
            name="decision"
            placeholder="What was decided (or that it was deferred)…"
            required
            rows={2}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <textarea
            name="reasoning"
            placeholder="Why (optional)…"
            rows={2}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="submit"
            className="self-start rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
          >
            Log fork
          </button>
        </form>
      </section>
    </main>
  )
}
