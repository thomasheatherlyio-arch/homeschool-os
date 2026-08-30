import Link from 'next/link'
import { requireFamilyMember, resolveTargetStudentId, currentWeekMonday } from '@/lib/auth'
import { AppNav } from '@/components/AppNav'
import {
  upsertHomeJob,
  addExtraItem,
  retireExtraItem,
  addHomeJobLogEntry,
  addHteaoLogEntry,
} from './actions'

export const dynamic = 'force-dynamic'

const DUTIES_LABEL: Record<string, string> = { yes: 'Yes', partial: 'Partial', no: 'No' }
const HTEAO_TYPE_LABEL: Record<string, string> = {
  conversation: 'Conversation',
  application: 'Application',
  interview: 'Interview',
  shift: 'Shift',
}

type HomeJob = {
  job_title: string | null
  core_duties: string | null
  standard_of_done: string | null
  schedule: string | null
}
type ExtraItem = { id: string; task: string; price: number | null; notes: string | null }
type HomeJobLogEntry = {
  id: string
  week_of: string
  duties_met: 'yes' | 'partial' | 'no'
  extras_completed: string | null
  pay_earned: number | null
  misses_consequence: string | null
  notes: string | null
}
type HteaoLogEntry = {
  id: string
  occurred_on: string
  entry_type: string
  what_happened: string
  result_next_step: string | null
}

export default async function WorkLadderPage() {
  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  const today = new Date().toISOString().slice(0, 10)
  const weekOf = currentWeekMonday()

  if (!studentId) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <AppNav role={member.role} active="/work-ladder" />
        <h1 className="mt-6 text-2xl font-semibold">The Work Ladder</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">No student set up yet.</p>
      </main>
    )
  }

  const [{ data: homeJob }, { data: extras }, { data: homeJobLog }, { data: hteaoLog }] = await Promise.all([
    supabase
      .from('home_job')
      .select('job_title, core_duties, standard_of_done, schedule')
      .eq('student_id', studentId)
      .maybeSingle<HomeJob>(),
    supabase
      .from('extras_menu_items')
      .select('id, task, price, notes')
      .eq('student_id', studentId)
      .eq('active', true)
      .order('created_at')
      .returns<ExtraItem[]>(),
    supabase
      .from('home_job_log_entries')
      .select('id, week_of, duties_met, extras_completed, pay_earned, misses_consequence, notes')
      .eq('student_id', studentId)
      .order('week_of', { ascending: false })
      .limit(12)
      .returns<HomeJobLogEntry[]>(),
    supabase
      .from('hteao_log_entries')
      .select('id, occurred_on, entry_type, what_happened, result_next_step')
      .eq('student_id', studentId)
      .order('occurred_on', { ascending: false })
      .returns<HteaoLogEntry[]>(),
  ])

  const logList = homeJobLog ?? []
  let streak = 0
  for (const entry of logList) {
    if (entry.duties_met === 'yes') streak++
    else break
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <AppNav role={member.role} active="/work-ladder" />
      <h1 className="mt-6 text-2xl font-semibold">The Work Ladder</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Rung 0 — the Home Job. Rung 1 — First Paid Job (HTeaO).
      </p>

      {/* Home Job description */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">Home Job</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Write it once, together, and stop relitigating it weekly. The Home Job Contract
          itself lives on the{' '}
          <Link href="/dashboard" className="underline">
            Dashboard
          </Link>
          &apos;s Open Contracts section.
        </p>
        <form action={upsertHomeJob} className="mt-4 flex flex-col gap-2">
          <input
            type="text"
            name="job_title"
            placeholder="Job title (e.g. Household Operations)"
            defaultValue={homeJob?.job_title ?? ''}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <textarea
            name="core_duties"
            placeholder="Core duties (baseline, unpaid)…"
            defaultValue={homeJob?.core_duties ?? ''}
            rows={2}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <textarea
            name="standard_of_done"
            placeholder="What &quot;done right&quot; looks like for each duty…"
            defaultValue={homeJob?.standard_of_done ?? ''}
            rows={2}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            type="text"
            name="schedule"
            placeholder="Schedule (e.g. kitchen after dinner nightly, trash Sunday night)"
            defaultValue={homeJob?.schedule ?? ''}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button type="submit" className="self-start rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background">
            Save
          </button>
        </form>
      </section>

      {/* Extras Menu */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">Extras Menu</h2>
        <p className="mt-1 text-xs text-zinc-500">Above-and-beyond tasks, priced before the work starts.</p>
        <ul className="mt-3 flex flex-col gap-2">
          {(extras ?? []).length === 0 && <li className="text-sm text-zinc-500">No extras listed yet.</li>}
          {(extras ?? []).map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <div>
                <span className="text-sm">{e.task}</span>
                {e.price !== null && <span className="ml-2 text-sm text-zinc-500">${e.price}</span>}
                {e.notes && <div className="text-xs text-zinc-500">{e.notes}</div>}
              </div>
              <form action={retireExtraItem.bind(null, e.id)}>
                <button type="submit" className="text-xs text-zinc-500 underline hover:text-red-600">
                  Retire
                </button>
              </form>
            </li>
          ))}
        </ul>

        <form action={addExtraItem} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            name="task"
            placeholder="Extra task"
            required
            className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Price"
            className="w-24 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            type="text"
            name="notes"
            placeholder="Notes (optional)"
            className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button type="submit" className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background">
            Add
          </button>
        </form>
      </section>

      {/* Home Job Log */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">Home Job Log</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Current streak of fully-met weeks:{' '}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{streak}</span> — Doc 13&apos;s
          starting readiness target for HTeaO is 4 straight weeks.
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {logList.length === 0 && <li className="text-sm text-zinc-500">No weeks logged yet.</li>}
          {logList.map((l) => (
            <li key={l.id} className="rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Week of {l.week_of}</span>
                <span>Duties met: {DUTIES_LABEL[l.duties_met]}</span>
              </div>
              {l.extras_completed && <div className="mt-1 text-sm">Extras: {l.extras_completed}</div>}
              {l.pay_earned !== null && (
                <div className="mt-1 text-xs text-zinc-500">Pay earned: ${l.pay_earned}</div>
              )}
              {l.misses_consequence && (
                <div className="mt-1 text-xs text-zinc-500">Misses/consequence: {l.misses_consequence}</div>
              )}
              {l.notes && <div className="mt-1 text-xs text-zinc-500">{l.notes}</div>}
            </li>
          ))}
        </ul>

        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-zinc-500">Log a week</summary>
          <form action={addHomeJobLogEntry} className="mt-2 flex flex-col gap-2">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="date"
                name="week_of"
                defaultValue={weekOf}
                required
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <select
                name="duties_met"
                defaultValue="yes"
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="yes">Duties met: Yes</option>
                <option value="partial">Duties met: Partial</option>
                <option value="no">Duties met: No</option>
              </select>
              <input
                type="number"
                step="0.01"
                name="pay_earned"
                placeholder="Pay earned"
                className="w-28 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <input
              type="text"
              name="extras_completed"
              placeholder="Extras completed (e.g. Washed car ($10))"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <input
              type="text"
              name="misses_consequence"
              placeholder="Misses / consequence (optional)"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <textarea
              name="notes"
              placeholder="Notes (optional)"
              rows={2}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button type="submit" className="self-start rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background">
              Save week
            </button>
          </form>
        </details>
      </section>

      {/* HTeaO Work Log */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">HTeaO Work Log</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {(hteaoLog ?? []).length === 0 && <li className="text-sm text-zinc-500">Nothing logged yet.</li>}
          {(hteaoLog ?? []).map((h) => (
            <li key={h.id} className="rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{HTEAO_TYPE_LABEL[h.entry_type] ?? h.entry_type}</span>
                <span>{h.occurred_on}</span>
              </div>
              <div className="mt-1 text-sm">{h.what_happened}</div>
              {h.result_next_step && (
                <div className="mt-1 text-xs text-zinc-500">Next: {h.result_next_step}</div>
              )}
            </li>
          ))}
        </ul>

        <form
          action={addHteaoLogEntry}
          className="mt-4 flex flex-col gap-2 rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              name="entry_type"
              defaultValue="conversation"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              {Object.entries(HTEAO_TYPE_LABEL).map(([value, label]) => (
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
            name="what_happened"
            placeholder="What happened…"
            required
            rows={2}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            type="text"
            name="result_next_step"
            placeholder="Result / next step (optional)"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button type="submit" className="self-start rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background">
            Log entry
          </button>
        </form>
      </section>
    </main>
  )
}
