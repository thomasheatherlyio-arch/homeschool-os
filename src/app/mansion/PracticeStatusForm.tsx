'use client'

import { useRef } from 'react'
import { setPracticeStatus } from './actions'

const STATUS_OPTIONS = [
  { value: 'starting', label: '🌱 Starting' },
  { value: 'active', label: '🔁 Active' },
  { value: 'paused', label: '⏸️ Paused' },
] as const

export function PracticeStatusForm({ practiceId, status }: { practiceId: string; status: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} action={setPracticeStatus.bind(null, practiceId)}>
      <select
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </form>
  )
}
