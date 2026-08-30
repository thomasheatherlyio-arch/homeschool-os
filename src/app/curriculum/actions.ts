'use server'

import { revalidatePath } from 'next/cache'
import { requireParent } from '@/lib/auth'

const LESSON_STATUSES = ['not_started', 'in_progress', 'complete']

export async function addSubject(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return

  const description = String(formData.get('description') ?? '').trim()
  const { supabase } = await requireParent()

  const { error } = await supabase.from('subjects').insert({
    name,
    description: description || null,
  })

  if (error) {
    console.error('Failed to add subject:', error.message)
    return
  }

  revalidatePath('/curriculum')
}

export async function addUnit(subjectId: string, formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  if (!title) return

  const description = String(formData.get('description') ?? '').trim()
  const { supabase } = await requireParent()

  const { error } = await supabase.from('units').insert({
    subject_id: subjectId,
    title,
    description: description || null,
  })

  if (error) {
    console.error('Failed to add unit:', error.message)
    return
  }

  revalidatePath('/curriculum')
}

// unitId is optional: a lesson can be added directly under a subject (no
// unit) or into a specific unit within that subject. The lessons table's own
// trigger (lessons_check_unit_subject) is the real guard against a mismatched
// unit_id/subject_id pair — this action doesn't need to re-check that itself.
export async function addLesson(subjectId: string, unitId: string | null, formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  if (!title) return

  const { supabase } = await requireParent()

  const { error } = await supabase.from('lessons').insert({
    subject_id: subjectId,
    unit_id: unitId,
    title,
  })

  if (error) {
    console.error('Failed to add lesson:', error.message)
    return
  }

  revalidatePath('/curriculum')
}

export async function setLessonStatus(lessonId: string, formData: FormData) {
  const status = String(formData.get('status') ?? '')
  if (!LESSON_STATUSES.includes(status)) return

  const { supabase } = await requireParent()

  const { error } = await supabase.from('lessons').update({ status }).eq('id', lessonId)

  if (error) {
    console.error('Failed to update lesson status:', error.message)
    return
  }

  revalidatePath('/curriculum')
}
