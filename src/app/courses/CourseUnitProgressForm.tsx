'use client'

import { setUnitProgress } from './actions'

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not started' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'complete', label: 'Complete' },
] as const

export function CourseUnitProgressForm({
  courseId,
  unitId,
  status,
  evidenceLink,
}: {
  courseId: string
  unitId: string
  status: string
  evidenceLink: string | null
}) {
  return (
    <form
      action={setUnitProgress.bind(null, courseId, unitId)}
      className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <select
        name="status"
        defaultValue={status}
        className="rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        type="url"
        name="evidence_link"
        placeholder="Evidence link (optional)"
        defaultValue={evidenceLink ?? ''}
        className="flex-1 rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button
        type="submit"
        className="rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background"
      >
        Save
      </button>
    </form>
  )
}
