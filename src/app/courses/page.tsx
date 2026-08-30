import Link from 'next/link'
import { requireFamilyMember, resolveTargetStudentId } from '@/lib/auth'
import { AppNav } from '@/components/AppNav'

export const dynamic = 'force-dynamic'

type Course = {
  id: string
  title: string
  description: string | null
  primary_quadrant_id: string | null
}
type Quadrant = { id: string; name: string; emoji: string | null }
type UnitRow = { id: string; course_id: string }
type ProgressRow = { course_unit_id: string; status: string }

export default async function CoursesPage() {
  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)

  const [{ data: courses, error }, { data: quadrants }, { data: units }] = await Promise.all([
    supabase
      .from('courses')
      .select('id, title, description, primary_quadrant_id')
      .eq('status', 'active')
      .order('created_at')
      .returns<Course[]>(),
    supabase.from('quadrants').select('id, name, emoji').returns<Quadrant[]>(),
    supabase.from('course_units').select('id, course_id').returns<UnitRow[]>(),
  ])

  const { data: progress } = studentId
    ? await supabase
        .from('course_unit_progress')
        .select('course_unit_id, status')
        .eq('student_id', studentId)
        .returns<ProgressRow[]>()
    : { data: [] as ProgressRow[] }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <AppNav role={member.role} active="/courses" />
        <h1 className="mt-6 text-2xl font-semibold">Courses</h1>
        <p className="mt-4 text-red-600">Couldn&apos;t load courses: {error.message}</p>
      </main>
    )
  }

  const courseList = courses ?? []
  const unitsByCourse = new Map<string, string[]>()
  for (const u of units ?? []) {
    const arr = unitsByCourse.get(u.course_id) ?? []
    arr.push(u.id)
    unitsByCourse.set(u.course_id, arr)
  }
  const completedUnitIds = new Set(
    (progress ?? []).filter((p) => p.status === 'complete').map((p) => p.course_unit_id)
  )
  const quadrantLabel = (id: string | null) => {
    if (!id) return null
    const q = quadrants?.find((q) => q.id === id)
    return q ? `${q.emoji ?? ''} ${q.name}`.trim() : id
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <AppNav role={member.role} active="/courses" />
      <h1 className="mt-6 text-2xl font-semibold">Courses</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Structured multi-week courses — units, deliverables, and progress tracked per unit.
      </p>

      {courseList.length === 0 ? (
        <p className="mt-6 text-zinc-600 dark:text-zinc-400">No courses yet.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {courseList.map((c) => {
            const unitIds = unitsByCourse.get(c.id) ?? []
            const total = unitIds.length
            const completed = unitIds.filter((id) => completedUnitIds.has(id)).length
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0
            return (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="block rounded-lg border border-zinc-200 p-5 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">{c.title}</h2>
                  {quadrantLabel(c.primary_quadrant_id) && (
                    <span className="text-xs text-zinc-500">{quadrantLabel(c.primary_quadrant_id)}</span>
                  )}
                </div>
                {c.description && (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{c.description}</p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full bg-foreground"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500">
                    {completed}/{total} units
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
