'use client'

import { useRef } from 'react'
import { setLessonStatus } from './actions'

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not started' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'complete', label: 'Complete' },
] as const

export function LessonStatusForm({ lessonId, status }: { lessonId: string; status: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} action={setLessonStatus.bind(null, lessonId)}>
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
