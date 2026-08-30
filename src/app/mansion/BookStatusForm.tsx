'use client'

import { setBookStatus } from './actions'

const STATUS_OPTIONS = [
  { value: 'recommended', label: '📖 Recommended' },
  { value: 'reading', label: '📚 Reading' },
  { value: 'finished', label: '✅ Finished' },
  { value: 'shelved', label: '🗄️ Shelved' },
] as const

export function BookStatusForm({ bookId, status, take }: { bookId: string; status: string; take: string | null }) {
  return (
    <form action={setBookStatus.bind(null, bookId)} className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
      <select
        name="status"
        defaultValue={status}
        className="rounded-md border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="take"
        placeholder="One-line take (once finished)"
        defaultValue={take ?? ''}
        className="flex-1 rounded-md border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button type="submit" className="rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background">
        Save
      </button>
    </form>
  )
}
