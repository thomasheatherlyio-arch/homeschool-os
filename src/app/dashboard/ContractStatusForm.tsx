'use client'

import { useRef } from 'react'
import { setContractStatus } from './actions'

export function ContractStatusForm({ contractId, status }: { contractId: string; status: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} action={setContractStatus.bind(null, contractId)}>
      <select
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
      >
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </form>
  )
}
