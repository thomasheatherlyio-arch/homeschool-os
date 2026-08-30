'use server'

import { revalidatePath } from 'next/cache'
import { requireFamilyMember, requireParent, resolveTargetStudentId } from '@/lib/auth'

const BOOK_STATUSES = ['recommended', 'reading', 'finished', 'shelved']
const VIDEO_STATUSES = ['recommended', 'watching', 'finished', 'shelved']
const PRACTICE_STATUSES = ['starting', 'active', 'paused']
const TOOL_STATUSES = ['candidate', 'setting_up', 'active', 'paused_retired']

// --- Books (The Study Shelves) ----------------------------------------------

export async function addBook(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  if (!title) return

  const quadrantId = String(formData.get('quadrant_id') ?? '').trim()
  const author = String(formData.get('author') ?? '').trim()
  const recommendedBy = String(formData.get('recommended_by') ?? '').trim()
  const why = String(formData.get('why') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const { error } = await supabase.from('mansion_books').insert({
    student_id: studentId,
    quadrant_id: quadrantId || null,
    title,
    author: author || null,
    recommended_by: recommendedBy || null,
    why: why || null,
  })

  if (error) {
    console.error('Failed to add book:', error.message)
    return
  }

  revalidatePath('/mansion')
}

export async function setBookStatus(bookId: string, formData: FormData) {
  const status = String(formData.get('status') ?? '')
  if (!BOOK_STATUSES.includes(status)) return

  const take = String(formData.get('take') ?? '').trim()

  const { supabase } = await requireFamilyMember()
  const update: Record<string, unknown> = { status }
  if (take) update.take = take

  const { error } = await supabase.from('mansion_books').update(update).eq('id', bookId)

  if (error) {
    console.error('Failed to update book status:', error.message)
    return
  }

  revalidatePath('/mansion')
}

// --- Videos (The Screening Room) --------------------------------------------

export async function addVideo(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  if (!title) return

  const quadrantId = String(formData.get('quadrant_id') ?? '').trim()
  const creator = String(formData.get('creator') ?? '').trim()
  const type = String(formData.get('type') ?? '').trim()
  const recommendedBy = String(formData.get('recommended_by') ?? '').trim()
  const why = String(formData.get('why') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const { error } = await supabase.from('mansion_videos').insert({
    student_id: studentId,
    quadrant_id: quadrantId || null,
    title,
    creator: creator || null,
    type: type || null,
    recommended_by: recommendedBy || null,
    why: why || null,
  })

  if (error) {
    console.error('Failed to add video:', error.message)
    return
  }

  revalidatePath('/mansion')
}

export async function setVideoStatus(videoId: string, formData: FormData) {
  const status = String(formData.get('status') ?? '')
  if (!VIDEO_STATUSES.includes(status)) return

  const take = String(formData.get('take') ?? '').trim()

  const { supabase } = await requireFamilyMember()
  const update: Record<string, unknown> = { status }
  if (take) update.take = take

  const { error } = await supabase.from('mansion_videos').update(update).eq('id', videoId)

  if (error) {
    console.error('Failed to update video status:', error.message)
    return
  }

  revalidatePath('/mansion')
}

// --- Practices (The Practice Room) ------------------------------------------

export async function addPractice(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return

  const quadrantId = String(formData.get('quadrant_id') ?? '').trim()
  const practiceType = String(formData.get('practice_type') ?? '').trim()
  const frequency = String(formData.get('frequency') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const { error } = await supabase.from('mansion_practices').insert({
    student_id: studentId,
    quadrant_id: quadrantId || null,
    name,
    practice_type: practiceType || null,
    frequency: frequency || null,
  })

  if (error) {
    console.error('Failed to add practice:', error.message)
    return
  }

  revalidatePath('/mansion')
}

export async function setPracticeStatus(practiceId: string, formData: FormData) {
  const status = String(formData.get('status') ?? '')
  if (!PRACTICE_STATUSES.includes(status)) return

  const { supabase } = await requireFamilyMember()

  const { error } = await supabase.from('mansion_practices').update({ status }).eq('id', practiceId)

  if (error) {
    console.error('Failed to update practice status:', error.message)
    return
  }

  revalidatePath('/mansion')
}

// --- Tools (The Toolshed) ---------------------------------------------------

export async function addTool(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return

  const quadrantId = String(formData.get('quadrant_id') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim()
  const purpose = String(formData.get('purpose') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const { error } = await supabase.from('mansion_tools').insert({
    student_id: studentId,
    quadrant_id: quadrantId || null,
    name,
    category: category || null,
    purpose: purpose || null,
  })

  if (error) {
    console.error('Failed to add tool:', error.message)
    return
  }

  revalidatePath('/mansion')
}

export async function setToolStatus(toolId: string, formData: FormData) {
  const status = String(formData.get('status') ?? '')
  if (!TOOL_STATUSES.includes(status)) return

  const { supabase } = await requireFamilyMember()

  const { error } = await supabase.from('mansion_tools').update({ status }).eq('id', toolId)

  if (error) {
    console.error('Failed to update tool status:', error.message)
    return
  }

  revalidatePath('/mansion')
}

// Sign-off is deliberately its own parent-only action, separate from status —
// Doc 08 §7 requires Thomas's sign-off before setup even when Shiloh
// proposes the tool, since these usually involve an account, personal info,
// or real money.
export async function signOffTool(toolId: string) {
  const { supabase, member } = await requireParent()

  const { error } = await supabase
    .from('mansion_tools')
    .update({ signed_off_by: member.id, signed_off_at: new Date().toISOString() })
    .eq('id', toolId)

  if (error) {
    console.error('Failed to sign off tool:', error.message)
    return
  }

  revalidatePath('/mansion')
}

// --- Gallery -----------------------------------------------------------------

export async function addGalleryItem(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  if (!title) return

  const quadrantId = String(formData.get('quadrant_id') ?? '').trim()
  const type = String(formData.get('type') ?? '').trim()
  const relatedTo = String(formData.get('related_to') ?? '').trim()
  const whereItLives = String(formData.get('where_it_lives') ?? '').trim()
  const take = String(formData.get('take') ?? '').trim()
  const dateFinished = String(formData.get('date_finished') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const insert: Record<string, unknown> = {
    student_id: studentId,
    quadrant_id: quadrantId || null,
    title,
    type: type || null,
    related_to: relatedTo || null,
    where_it_lives: whereItLives || null,
    take: take || null,
  }
  if (dateFinished) insert.date_finished = dateFinished

  const { error } = await supabase.from('gallery_items').insert(insert)

  if (error) {
    console.error('Failed to add gallery item:', error.message)
    return
  }

  revalidatePath('/mansion')
}
