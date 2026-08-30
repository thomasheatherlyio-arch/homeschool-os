'use server'

import { revalidatePath } from 'next/cache'
import { requireParent } from '@/lib/auth'

export async function addInvite(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const name = String(formData.get('name') ?? '').trim()
  const role = String(formData.get('role') ?? '')

  if (!email || !name || (role !== 'parent' && role !== 'child')) return

  const { supabase } = await requireParent()

  const { error } = await supabase.from('invites').insert({ email, name, role })

  if (error) {
    console.error('Failed to add invite:', error.message)
    return
  }

  revalidatePath('/family')
}

export async function removeInvite(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email) return

  const { supabase } = await requireParent()

  const { error } = await supabase.from('invites').delete().eq('email', email)

  if (error) {
    console.error('Failed to remove invite:', error.message)
    return
  }

  revalidatePath('/family')
}
