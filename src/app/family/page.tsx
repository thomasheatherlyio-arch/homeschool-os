import { requireParent } from '@/lib/auth'
import { AppNav } from '@/components/AppNav'
import { addInvite, removeInvite } from './actions'

export const dynamic = 'force-dynamic'

type Member = { id: string; name: string; role: 'parent' | 'child'; created_at: string }
type Invite = { email: string; name: string; role: 'parent' | 'child'; created_at: string }

export default async function FamilyPage() {
  const { supabase, member } = await requireParent()

  const [{ data: members }, { data: invites }] = await Promise.all([
    supabase
      .from('family_members')
      .select('id, name, role, created_at')
      .order('created_at', { ascending: true })
      .returns<Member[]>(),
    supabase
      .from('invites')
      .select('email, name, role, created_at')
      .order('created_at', { ascending: true })
      .returns<Invite[]>(),
  ])

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <AppNav role={member.role} active="/family" />
      <h1 className="mt-6 text-2xl font-semibold">Family</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Invite a family member by email — the next time they sign in with that email,
        they&apos;ll be set up automatically with the name and role below.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Family members</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {(members ?? []).map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900"
            >
              <span>{m.name}</span>
              <span className="text-zinc-500 capitalize">{m.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Pending invites</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {(invites ?? []).length === 0 && (
            <li className="text-sm text-zinc-500">No pending invites.</li>
          )}
          {(invites ?? []).map((invite) => (
            <li
              key={invite.email}
              className="flex items-center justify-between gap-3 rounded-md bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900"
            >
              <span>
                {invite.name} — {invite.email}{' '}
                <span className="text-zinc-500 capitalize">({invite.role})</span>
              </span>
              <form action={removeInvite}>
                <input type="hidden" name="email" value={invite.email} />
                <button type="submit" className="text-zinc-500 underline hover:text-red-600">
                  Cancel
                </button>
              </form>
            </li>
          ))}
        </ul>

        <form
          action={addInvite}
          className="mt-4 flex flex-col gap-2 rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700"
        >
          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <select
            name="role"
            defaultValue="child"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="child">Child (Student-CEO)</option>
            <option value="parent">Parent (Headmaster)</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
          >
            Send invite
          </button>
        </form>
      </section>
    </main>
  )
}
