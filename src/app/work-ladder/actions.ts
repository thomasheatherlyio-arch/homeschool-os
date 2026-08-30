'use server'

import { revalidatePath } from 'next/cache'
import { requireFamilyMember, resolveTargetStudentId } from '@/lib/auth'

const DUTIES_MET = ['yes', 'partial', 'no']
const HTEAO_TYPES = ['conversation', 'application', 'interview', 'shift']

export async function upsertHomeJob(formData: FormData) {
  const jobTitle = String(formData.get('job_title') ?? '').trim()
  const coreDuties = String(formData.get('core_duties') ?? '').trim()
  const standardOfDone = String(formData.get('standard_of_done') ?? '').trim()
  const schedule = String(formData.get('schedule') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const { error } = await supabase.from('home_job').upsert(
    {
      student_id: studentId,
      job_title: jobTitle || null,
      core_duties: coreDuties || null,
      standard_of_done: standardOfDone || null,
      schedule: schedule || null,
    },
    { onConflict: 'student_id' }
  )

  if (error) {
    console.error('Failed to save home job description:', error.message)
    return
  }

  revalidatePath('/work-ladder')
}

export async function addExtraItem(formData: FormData) {
  const task = String(formData.get('task') ?? '').trim()
  if (!task) return

  const priceRaw = String(formData.get('price') ?? '').trim()
  const price = priceRaw ? Number(priceRaw) : null
  const notes = String(formData.get('notes') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const { error } = await supabase.from('extras_menu_items').insert({
    student_id: studentId,
    task,
    price: price !== null && !Number.isNaN(price) ? price : null,
    notes: notes || null,
  })

  if (error) {
    console.error('Failed to add extra:', error.message)
    return
  }

  revalidatePath('/work-ladder')
}

export async function retireExtraItem(itemId: string) {
  const { supabase } = await requireFamilyMember()

  const { error } = await supabase.from('extras_menu_items').update({ active: false }).eq('id', itemId)

  if (error) {
    console.error('Failed to retire extra:', error.message)
    return
  }

  revalidatePath('/work-ladder')
}

export async function addHomeJobLogEntry(formData: FormData) {
  const weekOf = String(formData.get('week_of') ?? '').trim()
  const dutiesMet = String(formData.get('duties_met') ?? '')
  if (!weekOf || !DUTIES_MET.includes(dutiesMet)) return

  const extrasCompleted = String(formData.get('extras_completed') ?? '').trim()
  const payEarnedRaw = String(formData.get('pay_earned') ?? '').trim()
  const payEarned = payEarnedRaw ? Number(payEarnedRaw) : null
  const missesConsequence = String(formData.get('misses_consequence') ?? '').trim()
  const notes = String(formData.get('notes') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const { error } = await supabase.from('home_job_log_entries').upsert(
    {
      student_id: studentId,
      week_of: weekOf,
      duties_met: dutiesMet,
      extras_completed: extrasCompleted || null,
      pay_earned: payEarned !== null && !Number.isNaN(payEarned) ? payEarned : null,
      misses_consequence: missesConsequence || null,
      notes: notes || null,
    },
    { onConflict: 'student_id,week_of' }
  )

  if (error) {
    console.error('Failed to log home job week:', error.message)
    return
  }

  revalidatePath('/work-ladder')
}

export async function addHteaoLogEntry(formData: FormData) {
  const entryType = String(formData.get('entry_type') ?? '')
  const whatHappened = String(formData.get('what_happened') ?? '').trim()
  if (!HTEAO_TYPES.includes(entryType) || !whatHappened) return

  const resultNextStep = String(formData.get('result_next_step') ?? '').trim()
  const occurredOn = String(formData.get('occurred_on') ?? '').trim()

  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  if (!studentId) return

  const insert: Record<string, unknown> = {
    student_id: studentId,
    entry_type: entryType,
    what_happened: whatHappened,
    result_next_step: resultNextStep || null,
  }
  if (occurredOn) insert.occurred_on = occurredOn

  const { error } = await supabase.from('hteao_log_entries').insert(insert)

  if (error) {
    console.error('Failed to log HTeaO entry:', error.message)
    return
  }

  revalidatePath('/work-ladder')
}
