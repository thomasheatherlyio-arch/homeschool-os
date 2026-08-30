'use server'

import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'

export async function signOut() {
  const { supabase } = await requireUser()
  await supabase.auth.signOut()
  redirect('/login')
}
