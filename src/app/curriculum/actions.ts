'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth'

export async function addSubject(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return

  const description = String(formData.get('description') ?? '').trim()
  const { supabase } = await requireUser()

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

export async function addLesson(subjectId: string, formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  if (!title) return

  const { supabase } = await requireUser()

  const { error } = await supabase.from('lessons').insert({
    subject_id: subjectId,
    title,
  })

  if (error) {
    console.error('Failed to add lesson:', error.message)
    return
  }

  revalidatePath('/curriculum')
}
