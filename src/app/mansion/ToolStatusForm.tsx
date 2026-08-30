'use client'

import { useRef } from 'react'
import { setToolStatus } from './actions'

const STATUS_OPTIONS = [
  { value: 'candidate', label: '💡 Candidate' },
  { value: 'setting_up', label: '🔧 Setting Up' },
  { value: 'active', label: '🔁 Active' },
  { value: 'paused_retired', label: '⏸️ Paused/Retired' },
] as const

export function ToolStatusForm({ toolId, status }: { toolId: string; status: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} action={setToolStatus.bind(null, toolId)}>
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
