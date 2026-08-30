'use server'

import { revalidatePath } from 'next/cache'
import { requireFamilyMember, resolveTargetStudentId, currentWeekMonday } from '@/lib/auth'

const MISSION_STATUSES = ['not_started', 'in_progress', 'done', 'partial', 'not_done']

export async function addMission(formData: FormData) {
  const quadrantId = String(formData.get('quadrant_id') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  const doneLooksLike = String(formData.get('done_looks_like') ?? '').trim()
  if (!quadrantId || !title) return

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const { error } = await supabase.from('missions').insert({
    student_id: studentId,
    quadrant_id: quadrantId,
    week_of: currentWeekMonday(),
    title,
    done_looks_like: doneLooksLike || null,
  })

  if (error) {
    console.error('Failed to add mission:', error.message)
    return
  }

  revalidatePath('/dashboard')
}

export async function setMissionStatus(missionId: string, formData: FormData) {
  const status = String(formData.get('status') ?? '')
  if (!MISSION_STATUSES.includes(status)) return

  const { supabase } = await requireFamilyMember()

  const { error } = await supabase.from('missions').update({ status }).eq('id', missionId)

  if (error) {
    console.error('Failed to update mission status:', error.message)
    return
  }

  revalidatePath('/dashboard')
}

export async function setQuadrantScore(quadrantId: string, formData: FormData) {
  const score = Number(formData.get('score'))
  if (!Number.isInteger(score) || score < 0 || score > 10) return

  const notes = String(formData.get('notes') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const { error } = await supabase.from('quadrant_scores').upsert(
    {
      student_id: studentId,
      quadrant_id: quadrantId,
      week_of: currentWeekMonday(),
      score,
      notes: notes || null,
    },
    { onConflict: 'student_id,quadrant_id,week_of' }
  )

  if (error) {
    console.error('Failed to set quadrant score:', error.message)
    return
  }

  revalidatePath('/dashboard')
}

export async function addEvidence(formData: FormData) {
  const quadrantId = String(formData.get('quadrant_id') ?? '')
  const description = String(formData.get('description') ?? '').trim()
  if (!quadrantId || !description) return

  const subjectId = String(formData.get('subject_id') ?? '').trim()
  const evidenceType = String(formData.get('evidence_type') ?? '').trim()
  const link = String(formData.get('link') ?? '').trim()
  const occurredOn = String(formData.get('occurred_on') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const insert: Record<string, unknown> = {
    student_id: studentId,
    quadrant_id: quadrantId,
    description,
    evidence_type: evidenceType || null,
    link: link || null,
    subject_id: subjectId || null,
    reviewer_id: member.role === 'parent' ? member.id : null,
  }
  if (occurredOn) insert.occurred_on = occurredOn

  const { error } = await supabase.from('evidence_log_entries').insert(insert)

  if (error) {
    console.error('Failed to add evidence:', error.message)
    return
  }

  revalidatePath('/dashboard')
}
