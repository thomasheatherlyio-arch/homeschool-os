import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireFamilyMember, resolveTargetStudentId } from '@/lib/auth'
import { AppNav } from '@/components/AppNav'
import { CourseUnitProgressForm } from '../CourseUnitProgressForm'

export const dynamic = 'force-dynamic'

type Course = {
  id: string
  title: string
  description: string | null
  subjects_covered: string[] | null
}
type Unit = {
  id: string
  unit_number: number
  title: string
  teaching_notes: string | null
  deliverable: string | null
  video_assignment: string | null
  is_capstone: boolean
}
type ProgressRow = { course_unit_id: string; status: string; evidence_link: string | null }

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)

  const [{ data: course }, { data: units }] = await Promise.all([
    supabase
      .from('courses')
      .select('id, title, description, subjects_covered')
      .eq('id', courseId)
      .maybeSingle<Course>(),
    supabase
      .from('course_units')
      .select('id, unit_number, title, teaching_notes, deliverable, video_assignment, is_capstone')
      .eq('course_id', courseId)
      .order('unit_number')
      .returns<Unit[]>(),
  ])

  if (!course) notFound()

  const { data: progress } = studentId
    ? await supabase
        .from('course_unit_progress')
        .select('course_unit_id, status, evidence_link')
        .eq('student_id', studentId)
        .returns<ProgressRow[]>()
    : { data: [] as ProgressRow[] }

  const progressByUnit = new Map((progress ?? []).map((p) => [p.course_unit_id, p]))
  const unitList = units ?? []

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <AppNav role={member.role} active="/courses" />
      <Link href="/courses" className="mt-6 inline-block text-sm text-zinc-500 underline">
        ← All courses
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">{course.title}</h1>
      {course.description && (
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{course.description}</p>
      )}
      {course.subjects_covered && course.subjects_covered.length > 0 && (
        <p className="mt-2 text-xs text-zinc-500">
          Covers: {course.subjects_covered.join(', ')}
        </p>
      )}

      {!studentId && (
        <p className="mt-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          No student set up yet — progress can&apos;t be tracked until one exists.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {unitList.map((u) => {
          const p = progressByUnit.get(u.id)
          return (
            <section
              key={u.id}
              className={`rounded-lg border p-5 ${
                u.is_capstone
                  ? 'border-amber-300 dark:border-amber-700'
                  : 'border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-500">
                  {u.is_capstone ? 'Capstone' : `Unit ${u.unit_number}`}
                </span>
              </div>
              <h2 className="text-lg font-medium">{u.title}</h2>
              {u.teaching_notes && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{u.teaching_notes}</p>
              )}
              {u.deliverable && (
                <p className="mt-2 text-xs text-zinc-500">
                  <span className="font-medium">Deliverable:</span> {u.deliverable}
                </p>
              )}
              {u.video_assignment && (
                <p className="mt-1 text-xs text-zinc-500">
                  <span className="font-medium">Video:</span> {u.video_assignment}
                </p>
              )}

              {studentId && (
                <CourseUnitProgressForm
                  courseId={course.id}
                  unitId={u.id}
                  status={p?.status ?? 'not_started'}
                  evidenceLink={p?.evidence_link ?? null}
                />
              )}
            </section>
          )
        })}
      </div>
    </main>
  )
}
