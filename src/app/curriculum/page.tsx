import { requireFamilyMember } from '@/lib/auth'
import { AppNav } from '@/components/AppNav'
import { addLesson, addSubject, addUnit } from './actions'
import { LessonStatusForm } from './LessonStatusForm'

// Curriculum data can change outside this page's own form (direct DB edits,
// future admin flows), so always read fresh rather than serve a static build.
export const dynamic = 'force-dynamic'

type LessonStatus = 'not_started' | 'in_progress' | 'complete'

type Subject = { id: string; name: string; description: string | null }
type Unit = { id: string; subject_id: string; title: string; description: string | null }
type Lesson = {
  id: string
  subject_id: string
  unit_id: string | null
  title: string
  status: LessonStatus
}

function LessonList({ lessons }: { lessons: Lesson[] }) {
  if (lessons.length === 0) {
    return <p className="text-sm text-zinc-500">No lessons yet.</p>
  }
  return (
    <ul className="flex flex-col gap-2">
      {lessons.map((lesson) => (
        <li
          key={lesson.id}
          className="flex items-center justify-between gap-3 rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900"
        >
          <span className="text-sm">{lesson.title}</span>
          <LessonStatusForm lessonId={lesson.id} status={lesson.status} />
        </li>
      ))}
    </ul>
  )
}

function AddLessonForm({ subjectId, unitId }: { subjectId: string; unitId: string | null }) {
  return (
    <form action={addLesson.bind(null, subjectId, unitId)} className="flex gap-2">
      <input
        type="text"
        name="title"
        placeholder="New lesson title"
        required
        className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button
        type="submit"
        className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
      >
        Add lesson
      </button>
    </form>
  )
}

export default async function CurriculumPage() {
  const { supabase, member } = await requireFamilyMember()

  const [{ data: subjects, error }, { data: units }, { data: lessons }] = await Promise.all([
    supabase
      .from('subjects')
      .select('id, name, description')
      .order('sort_order')
      .returns<Subject[]>(),
    supabase
      .from('units')
      .select('id, subject_id, title, description')
      .order('sort_order')
      .returns<Unit[]>(),
    supabase
      .from('lessons')
      .select('id, subject_id, unit_id, title, status')
      .order('sort_order')
      .returns<Lesson[]>(),
  ])

  if (error) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <AppNav role={member.role} active="/curriculum" />
        <h1 className="mt-6 text-2xl font-semibold">Curriculum</h1>
        <p className="mt-4 text-red-600">Couldn&apos;t load subjects: {error.message}</p>
      </main>
    )
  }

  const subjectList = subjects ?? []
  const unitsBySubject = new Map<string, Unit[]>()
  for (const u of units ?? []) {
    const arr = unitsBySubject.get(u.subject_id) ?? []
    arr.push(u)
    unitsBySubject.set(u.subject_id, arr)
  }
  const lessonsByUnit = new Map<string, Lesson[]>()
  const generalLessonsBySubject = new Map<string, Lesson[]>()
  for (const l of lessons ?? []) {
    if (l.unit_id) {
      const arr = lessonsByUnit.get(l.unit_id) ?? []
      arr.push(l)
      lessonsByUnit.set(l.unit_id, arr)
    } else {
      const arr = generalLessonsBySubject.get(l.subject_id) ?? []
      arr.push(l)
      generalLessonsBySubject.set(l.subject_id, arr)
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <AppNav role={member.role} active="/curriculum" />
      <h1 className="mt-6 text-2xl font-semibold">Curriculum</h1>

      <form
        action={addSubject}
        className="mt-6 flex flex-col gap-2 rounded-lg border border-dashed border-zinc-300 p-4 sm:flex-row sm:items-start dark:border-zinc-700"
      >
        <div className="flex flex-1 flex-col gap-2">
          <input
            type="text"
            name="name"
            placeholder="New subject name (e.g. Math)"
            required
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            type="text"
            name="description"
            placeholder="Description (optional)"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
        >
          Add subject
        </button>
      </form>

      {subjectList.length === 0 ? (
        <p className="mt-6 text-zinc-600 dark:text-zinc-400">
          No subjects yet — add one above to get started.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-8">
          {subjectList.map((subject) => {
            const subjectUnits = unitsBySubject.get(subject.id) ?? []
            const generalLessons = generalLessonsBySubject.get(subject.id) ?? []
            return (
              <section
                key={subject.id}
                className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
              >
                <h2 className="text-lg font-medium">{subject.name}</h2>
                {subject.description && (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {subject.description}
                  </p>
                )}

                {/* Units */}
                {subjectUnits.length > 0 && (
                  <div className="mt-4 flex flex-col gap-4">
                    {subjectUnits.map((unit) => (
                      <div
                        key={unit.id}
                        className="rounded-md border border-zinc-200 p-3 dark:border-zinc-800"
                      >
                        <h3 className="text-sm font-semibold">{unit.title}</h3>
                        {unit.description && (
                          <p className="mt-0.5 text-xs text-zinc-500">{unit.description}</p>
                        )}
                        <div className="mt-2">
                          <LessonList lessons={lessonsByUnit.get(unit.id) ?? []} />
                        </div>
                        <div className="mt-2">
                          <AddLessonForm subjectId={subject.id} unitId={unit.id} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lessons not grouped into a unit */}
                <div className="mt-4">
                  {subjectUnits.length > 0 && (
                    <h3 className="mb-2 text-xs font-medium text-zinc-500">
                      Not in a unit
                    </h3>
                  )}
                  <LessonList lessons={generalLessons} />
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <AddLessonForm subjectId={subject.id} unitId={null} />

                  <details className="text-sm">
                    <summary className="cursor-pointer text-zinc-500">Add a unit</summary>
                    <form
                      action={addUnit.bind(null, subject.id)}
                      className="mt-2 flex flex-col gap-2 sm:flex-row"
                    >
                      <input
                        type="text"
                        name="title"
                        placeholder="Unit title (e.g. Chapter 3)"
                        required
                        className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      />
                      <input
                        type="text"
                        name="description"
                        placeholder="Description (optional)"
                        className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      />
                      <button
                        type="submit"
                        className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
                      >
                        Add unit
                      </button>
                    </form>
                  </details>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </main>
  )
}
