import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Handles the magic-link redirect from Supabase Auth: exchanges the code for
// a session, then provisions this account's family_members row on first
// sign-in.
//
// - The very first person ever to sign in (family_members is empty) is
//   bootstrapped as the parent — there's no one else yet to have invited them.
// - Everyone after that must have a matching row in `invites` (added by a
//   parent, see /family), and gets provisioned with that invite's name/role.
// - No matching invite: turned away rather than silently made a parent.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const next = request.nextUrl.searchParams.get('next') || '/dashboard'

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
    const { count } = await supabase
      .from('family_members')
      .select('id', { count: 'exact', head: true })

    if (!count) {
      // Bootstrap: first-ever sign-in becomes the parent.
      const name = user.email?.split('@')[0] ?? 'Parent'
      const { error: insertError } = await supabase
        .from('family_members')
        .insert({ id: user.id, name, role: 'parent' })

      if (insertError) {
        console.error('Failed to bootstrap parent family_members row:', insertError.message)
      }
    } else if (user.email) {
      const { data: invite } = await supabase
        .from('invites')
        .select('name, role')
        .eq('email', user.email.toLowerCase())
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
        // Consumed — clean up so the invite doesn't linger (best-effort).
        await supabase.from('invites').delete().eq('email', user.email.toLowerCase())
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url))
}
