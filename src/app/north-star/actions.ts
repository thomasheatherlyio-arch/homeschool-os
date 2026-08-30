'use server'

import { revalidatePath } from 'next/cache'
import { requireFamilyMember, resolveTargetStudentId } from '@/lib/auth'

const HORIZONS = [
  '50yr', '30yr', '10yr', '5yr', '3yr', '1yr_goals', 'quarterly_objective', 'monthly_target',
]
const AUDIT_TYPES = ['energy', 'flow', 'admiration', 'problem', 'feedback']
const DOOR_TYPES = ['two_way', 'one_way']

export async function addVision(horizon: string, formData: FormData) {
  if (!HORIZONS.includes(horizon)) return

  const body = String(formData.get('body') ?? '').trim()
  if (!body) return

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const { error } = await supabase.from('visions').insert({
    student_id: studentId,
    horizon,
    body,
  })

  if (error) {
    console.error('Failed to add vision:', error.message)
    return
  }

  revalidatePath('/north-star')
}

export async function addInterestLedgerEntry(formData: FormData) {
  const auditType = String(formData.get('audit_type') ?? '')
  const description = String(formData.get('description') ?? '').trim()
  if (!AUDIT_TYPES.includes(auditType) || !description) return

  const becameSmallBet = formData.get('became_small_bet') === 'on'
  const result = String(formData.get('result') ?? '').trim()
  const occurredOn = String(formData.get('occurred_on') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const insert: Record<string, unknown> = {
    student_id: studentId,
    audit_type: auditType,
    description,
    became_small_bet: becameSmallBet,
    result: result || null,
  }
  if (occurredOn) insert.occurred_on = occurredOn

  const { error } = await supabase.from('interest_ledger_entries').insert(insert)

  if (error) {
    console.error('Failed to add interest ledger entry:', error.message)
    return
  }

  revalidatePath('/north-star')
}

export async function addForkLogEntry(formData: FormData) {
  const decisionPoint = String(formData.get('decision_point') ?? '').trim()
  const doorType = String(formData.get('door_type') ?? '')
  const decision = String(formData.get('decision') ?? '').trim()
  if (!decisionPoint || !DOOR_TYPES.includes(doorType) || !decision) return

  const reasoning = String(formData.get('reasoning') ?? '').trim()
  const occurredOn = String(formData.get('occurred_on') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const insert: Record<string, unknown> = {
    student_id: studentId,
    decision_point: decisionPoint,
    door_type: doorType,
    decision,
    reasoning: reasoning || null,
  }
  if (occurredOn) insert.occurred_on = occurredOn

  const { error } = await supabase.from('fork_log_entries').insert(insert)

  if (error) {
    console.error('Failed to add fork log entry:', error.message)
    return
  }

  revalidatePath('/north-star')
}
