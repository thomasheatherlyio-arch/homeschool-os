import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { safeRedirectPath } from '@/lib/auth'

// Handles the magic-link/Google OAuth redirect from Supabase Auth: exchanges
// the code for a session, then provisions this account's family_members row
// on first sign-in.
//
// Every sign-in — including the very first — must have a matching row in
// `invites` (added by a parent at /family). This is defense-in-depth, not
// the only gate: the family_members_insert_invited RLS policy (see the
// rls_hardening migration) enforces the same rule at the database level, so
// this check can't be bypassed by calling the Supabase client directly.
//
// A brand-new deployment (empty invites table) needs its first parent's
// invites row created once via the Supabase dashboard's SQL editor before
// anyone can sign in — deliberately not something this route or a migration
// does automatically, so there's no self-service "first visitor becomes
// parent" window.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const next = safeRedirectPath(request.nextUrl.searchParams.get('next'))

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=Missing+sign-in+code', request.url))
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error?.message ?? 'Sign-in failed')}`, request.url)
    )
  }

  const user = data.user

  const { data: existing } = await supabase
    .from('family_members')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (!existing) {
    if (!user.email) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login?error=No+email+on+this+account', request.url))
    }

    const email = user.email.toLowerCase()

    const { data: invite } = await supabase
      .from('invites')
      .select('name, role')
      .eq('email', email)
      .maybeSingle()

    if (!invite) {
      await supabase.auth.signOut()
      return NextResponse.redirect(
        new URL('/login?error=No+invite+found+for+that+email+-+ask+the+Headmaster', request.url)
      )
    }

    const { error: insertError } = await supabase
      .from('family_members')
      .insert({ id: user.id, name: invite.name, role: invite.role })

    if (insertError) {
      console.error('Failed to provision invited family_members row:', insertError.message)
    } else {
      // Consumed — clean up so the invite doesn't linger (best-effort). RLS
      // lets you delete your own invite row regardless of role (see
      // invites_delete_self in the rls_hardening migration), so this works
      // for a child's own first sign-in too, not just a parent's.
      const { error: deleteError } = await supabase.from('invites').delete().eq('email', email)
      if (deleteError) {
        console.error('Failed to delete consumed invite:', deleteError.message)
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url))
}
