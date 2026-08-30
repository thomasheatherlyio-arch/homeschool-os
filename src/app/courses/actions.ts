'use server'

import { revalidatePath } from 'next/cache'
import { requireFamilyMember, resolveTargetStudentId } from '@/lib/auth'

const UNIT_STATUSES = ['not_started', 'in_progress', 'complete']

export async function setUnitProgress(courseId: string, courseUnitId: string, formData: FormData) {
  const status = String(formData.get('status') ?? '')
  if (!UNIT_STATUSES.includes(status)) return

  const evidenceLink = String(formData.get('evidence_link') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const { error } = await supabase.from('course_unit_progress').upsert(
    {
      student_id: studentId,
      course_unit_id: courseUnitId,
      status,
      evidence_link: evidenceLink || null,
      completed_on: status === 'complete' ? new Date().toISOString().slice(0, 10) : null,
    },
    { onConflict: 'student_id,course_unit_id' }
  )

  if (error) {
    console.error('Failed to update unit progress:', error.message)
    return
  }

  revalidatePath('/courses')
  revalidatePath(`/courses/${courseId}`)
}
