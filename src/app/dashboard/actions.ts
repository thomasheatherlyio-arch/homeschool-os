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

export async function addMentor(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const tier = String(formData.get('tier') ?? '')
  const personaType = String(formData.get('persona_type') ?? '')
  const quadrantId = String(formData.get('quadrant_id') ?? '').trim()
  if (!name || (tier !== 'knight' && tier !== 'squire')) return
  if (personaType !== 'ai_persona' && personaType !== 'irl') return

  const { supabase } = await requireFamilyMember()

  const { error } = await supabase.from('mentors').insert({
    name,
    tier,
    persona_type: personaType,
    quadrant_id: quadrantId || null,
  })

  if (error) {
    console.error('Failed to add mentor:', error.message)
    return
  }

  revalidatePath('/dashboard')
}

export async function logMentorSession(formData: FormData) {
  const mentorId = String(formData.get('mentor_id') ?? '')
  const quadrantId = String(formData.get('quadrant_id') ?? '')
  const notes = String(formData.get('notes') ?? '').trim()
  if (!mentorId || !quadrantId || !notes) return

  const resultingAction = String(formData.get('resulting_action') ?? '').trim()
  const occurredOn = String(formData.get('occurred_on') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const insert: Record<string, unknown> = {
    student_id: studentId,
    mentor_id: mentorId,
    quadrant_id: quadrantId,
    notes,
    resulting_action: resultingAction || null,
  }
  if (occurredOn) insert.occurred_on = occurredOn

  const { error } = await supabase.from('mentor_sessions').insert(insert)

  if (error) {
    console.error('Failed to log mentor session:', error.message)
    return
  }

  revalidatePath('/dashboard')
}

export async function addContract(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const studentCommitment = String(formData.get('student_commitment') ?? '').trim()
  const providerCommitment = String(formData.get('provider_commitment') ?? '').trim()
  const definitionOfDone = String(formData.get('definition_of_done') ?? '').trim()
  if (!title || !studentCommitment || !providerCommitment || !definitionOfDone) return

  const reviewDate = String(formData.get('review_date') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const { error } = await supabase.from('contracts').insert({
    student_id: studentId,
    title,
    student_commitment: studentCommitment,
    provider_commitment: providerCommitment,
    definition_of_done: definitionOfDone,
    review_date: reviewDate || null,
  })

  if (error) {
    console.error('Failed to add contract:', error.message)
    return
  }

  revalidatePath('/dashboard')
}

export async function setContractStatus(contractId: string, formData: FormData) {
  const status = String(formData.get('status') ?? '')
  if (status !== 'active' && status !== 'completed') return

  const { supabase } = await requireFamilyMember()

  const { error } = await supabase.from('contracts').update({ status }).eq('id', contractId)

  if (error) {
    console.error('Failed to update contract status:', error.message)
    return
  }

  revalidatePath('/dashboard')
}
