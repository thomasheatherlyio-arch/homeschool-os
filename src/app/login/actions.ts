'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { safeRedirectPath } from '@/lib/auth'

// No signup form for either method below: an account is created by signing
// in for the first time (see src/app/auth/callback/route.ts, which bootstraps
// the first-ever sign-in as parent and provisions everyone after that from
// an `invites` row a parent creates at /family).
export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const next = safeRedirectPath(String(formData.get('next') ?? '').trim(), '')

  if (!email) {
    redirect('/login?error=Enter+an+email+address')
  }

  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`,
    },
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/login?sent=1')
}

// Google's redirect lands back on Supabase's own /auth/v1/callback (configured
// in the Google Cloud OAuth client, not this app's callback), which then
// forwards to *this* app's /auth/callback with a `code` — same PKCE exchange
// src/app/auth/callback/route.ts already does for the email-link flow, so
// that route needs no changes to support this.
export async function signInWithGoogle(formData: FormData) {
  const next = safeRedirectPath(String(formData.get('next') ?? '').trim(), '')

  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`,
    },
  })

  if (error || !data.url) {
    redirect(`/login?error=${encodeURIComponent(error?.message ?? 'Google sign-in failed')}`)
  }

  redirect(data.url)
}
