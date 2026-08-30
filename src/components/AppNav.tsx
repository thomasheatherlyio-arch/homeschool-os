import Link from 'next/link'
import { signOut } from '@/app/actions'
import type { FamilyMember } from '@/lib/auth'

const LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/curriculum', label: 'Curriculum' },
  { href: '/courses', label: 'Courses' },
] as const

export function AppNav({ role, active }: { role: FamilyMember['role']; active: string }) {
  const links = role === 'parent' ? [...LINKS, { href: '/family', label: 'Family' }] : LINKS

  return (
    <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
      <nav className="flex gap-4 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.href === active
                ? 'font-semibold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <form action={signOut}>
        <button
          type="submit"
          className="text-sm text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Sign out
        </button>
      </form>
    </div>
  )
}
