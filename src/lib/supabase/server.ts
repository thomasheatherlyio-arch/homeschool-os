import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Supabase client for Server Components, Server Actions, and Route Handlers.
// Reads/writes the auth session via cookies, so requests carry the signed-in
// user (auth.uid()) and RLS policies apply correctly.
//
// Only one person signs in for now (see the curriculum_schema migration's
// pre-auth RLS note), so there's no separate browser client yet — add
// src/lib/supabase/client.ts if a Client Component ever needs its own.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // `setAll` is called from a Server Component when the session is
            // merely being read, not refreshed — cookies() is read-only
            // there. The proxy (src/proxy.ts) refreshes the session on every
            // request, so it's safe to ignore this here.
          }
        },
      },
    }
  )
}
