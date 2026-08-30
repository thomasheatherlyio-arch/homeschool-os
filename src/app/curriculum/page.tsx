import { requireFamilyMember } from '@/lib/auth'
import { AppNav } from '@/components/AppNav'
import { addLesson, addSubject } from './actions'

// Curriculum data can change outside this page's own form (direct DB edits,
// future admin flows), so always read fresh rather than serve a static build.
export const dynamic = 'force-dynamic'

type LessonStatus = 'not_started' | 'in_progress' | 'complete'

type Lesson = {
  id: string
  title: string
  status: LessonStatus
  sort_order: number
}

type Subject = {
  id: string
  name: string
  description: string | null
  lessons: Lesson[]
}

const STATUS_LABEL: Record<LessonStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  complete: 'Complete',
}

const STATUS_STYLE: Record<LessonStatus, string> = {
  not_started: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  complete: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
}

export default async function CurriculumPage() {
  const { supabase, member } = await requireFamilyMember()

  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('id, name, description, lessons(id, title, status, sort_order)')
    .order('sort_order', { ascending: true })
    .order('sort_order', { ascending: true, referencedTable: 'lessons' })
    .returns<Subject[]>()

  if (error) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <AppNav role={member.role} active="/curriculum" />
        <h1 className="mt-6 text-2xl font-semibold">Curriculum</h1>
        <p className="mt-4 text-red-600">Couldn&apos;t load subjects: {error.message}</p>
      </main>
    )
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

      {subjects.length === 0 ? (
        <p className="mt-6 text-zinc-600 dark:text-zinc-400">
          No subjects yet — add one above to get started.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-8">
          {subjects.map((subject) => (
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

              <ul className="mt-4 flex flex-col gap-2">
                {subject.lessons.length === 0 && (
                  <li className="text-sm text-zinc-500">No lessons yet.</li>
                )}
                {subject.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="flex items-center justify-between gap-3 rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900"
                  >
                    <span>{lesson.title}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[lesson.status]}`}
                    >
                      {STATUS_LABEL[lesson.status]}
                    </span>
                  </li>
                ))}
              </ul>

              <form action={addLesson.bind(null, subject.id)} className="mt-4 flex gap-2">
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
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
