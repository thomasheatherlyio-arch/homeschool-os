import { requireFamilyMember, resolveTargetStudentId } from '@/lib/auth'
import { AppNav } from '@/components/AppNav'
import { addBook, addVideo, addPractice, addTool, addGalleryItem, signOffTool } from './actions'
import { BookStatusForm } from './BookStatusForm'
import { VideoStatusForm } from './VideoStatusForm'
import { PracticeStatusForm } from './PracticeStatusForm'
import { ToolStatusForm } from './ToolStatusForm'

export const dynamic = 'force-dynamic'

// Doc 08's rooms map 1:1 to quadrants but have their own names.
const ROOM_LABELS: Record<string, string> = {
  mind_mastery: '🧠 The Study',
  body_discipline: '💪 The Training Hall',
  venture_craft: '🚀 The Workshop',
  spirit_character: '🕊️ The Chapel',
  systems_self_command: '🗂️ The Command Room',
}

type Quadrant = { id: string; name: string }
type Book = {
  id: string
  quadrant_id: string | null
  title: string
  author: string | null
  status: string
  recommended_by: string | null
  why: string | null
  take: string | null
}
type Video = {
  id: string
  quadrant_id: string | null
  title: string
  creator: string | null
  type: string | null
  status: string
  why: string | null
  take: string | null
}
type Practice = {
  id: string
  quadrant_id: string | null
  name: string
  practice_type: string | null
  frequency: string | null
  status: string
  notes: string | null
}
type Tool = {
  id: string
  quadrant_id: string | null
  name: string
  category: string | null
  purpose: string | null
  status: string
  signed_off_by: string | null
}
type GalleryItem = {
  id: string
  quadrant_id: string | null
  date_finished: string
  title: string
  type: string | null
  related_to: string | null
  where_it_lives: string | null
  take: string | null
}

export default async function MansionPage() {
  const { supabase, member } = await requireFamilyMember()
  const studentId = await resolveTargetStudentId(supabase, member)
  const today = new Date().toISOString().slice(0, 10)

  if (!studentId) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <AppNav role={member.role} active="/mansion" />
        <h1 className="mt-6 text-2xl font-semibold">The Mind Mansion</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">No student set up yet.</p>
      </main>
    )
  }

  const [
    { data: quadrants },
    { data: books },
    { data: videos },
    { data: practices },
    { data: tools },
    { data: galleryItems },
  ] = await Promise.all([
    supabase.from('quadrants').select('id, name').order('sort_order').returns<Quadrant[]>(),
    supabase
      .from('mansion_books')
      .select('id, quadrant_id, title, author, status, recommended_by, why, take')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .returns<Book[]>(),
    supabase
      .from('mansion_videos')
      .select('id, quadrant_id, title, creator, type, status, why, take')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .returns<Video[]>(),
    supabase
      .from('mansion_practices')
      .select('id, quadrant_id, name, practice_type, frequency, status, notes')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .returns<Practice[]>(),
    supabase
      .from('mansion_tools')
      .select('id, quadrant_id, name, category, purpose, status, signed_off_by')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .returns<Tool[]>(),
    supabase
      .from('gallery_items')
      .select('id, quadrant_id, date_finished, title, type, related_to, where_it_lives, take')
      .eq('student_id', studentId)
      .order('date_finished', { ascending: false })
      .returns<GalleryItem[]>(),
  ])

  const quadrantList = quadrants ?? []
  const roomLabel = (id: string | null) => {
    if (!id) return null
    return ROOM_LABELS[id] ?? quadrantList.find((q) => q.id === id)?.name ?? id
  }

  const roomSelect = (name: string) => (
    <select
      name={name}
      defaultValue=""
      className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
    >
      <option value="">Room (optional)…</option>
      {quadrantList.map((q) => (
        <option key={q.id} value={q.id}>
          {ROOM_LABELS[q.id] ?? q.name}
        </option>
      ))}
    </select>
  )

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <AppNav role={member.role} active="/mansion" />
      <h1 className="mt-6 text-2xl font-semibold">The Mind Mansion</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Books, videos, practices, and tools furnishing each room — plus The Gallery, the
        permanent record of everything actually finished.
      </p>

      {/* The Study Shelves */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">The Study Shelves — Books</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {(books ?? []).length === 0 && <li className="text-sm text-zinc-500">Shelves are empty.</li>}
          {(books ?? []).map((b) => (
            <li key={b.id} className="rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>
                  {b.title}
                  {b.author ? ` — ${b.author}` : ''}
                </span>
                <span>{roomLabel(b.quadrant_id)}</span>
              </div>
              {(b.why || b.recommended_by) && (
                <div className="mt-1 text-xs text-zinc-500">
                  {b.why}
                  {b.why && b.recommended_by ? ' · ' : ''}
                  {b.recommended_by && `rec. by ${b.recommended_by}`}
                </div>
              )}
              {b.take && <div className="mt-1 text-sm italic">&ldquo;{b.take}&rdquo;</div>}
              <BookStatusForm bookId={b.id} status={b.status} take={b.take} />
            </li>
          ))}
        </ul>

        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-zinc-500">Add a book</summary>
          <form action={addBook} className="mt-2 flex flex-col gap-2">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                name="title"
                placeholder="Title"
                required
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              {roomSelect('quadrant_id')}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                name="recommended_by"
                placeholder="Recommended by"
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                type="text"
                name="why"
                placeholder="Why (one line)"
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <button type="submit" className="self-start rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background">
              Add book
            </button>
          </form>
        </details>
      </section>

      {/* The Screening Room */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">The Screening Room — Videos</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {(videos ?? []).length === 0 && <li className="text-sm text-zinc-500">Nothing queued.</li>}
          {(videos ?? []).map((v) => (
            <li key={v.id} className="rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>
                  {v.title}
                  {v.creator ? ` — ${v.creator}` : ''}
                  {v.type ? ` (${v.type})` : ''}
                </span>
                <span>{roomLabel(v.quadrant_id)}</span>
              </div>
              {v.why && <div className="mt-1 text-xs text-zinc-500">{v.why}</div>}
              {v.take && <div className="mt-1 text-sm italic">&ldquo;{v.take}&rdquo;</div>}
              <VideoStatusForm videoId={v.id} status={v.status} take={v.take} />
            </li>
          ))}
        </ul>

        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-zinc-500">Add a video</summary>
          <form action={addVideo} className="mt-2 flex flex-col gap-2">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                name="title"
                placeholder="Title"
                required
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                type="text"
                name="creator"
                placeholder="Creator / channel"
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                type="text"
                name="type"
                placeholder="Type (e.g. documentary)"
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {roomSelect('quadrant_id')}
              <input
                type="text"
                name="recommended_by"
                placeholder="Recommended by"
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                type="text"
                name="why"
                placeholder="Why (one line)"
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <button type="submit" className="self-start rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background">
              Add video
            </button>
          </form>
        </details>
      </section>

      {/* The Practice Room */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">The Practice Room</h2>
        <p className="mt-1 text-xs text-zinc-500">Mindfulness, exercise, prayer & meditation — recurring, not a backlog.</p>
        <ul className="mt-3 flex flex-col gap-2">
          {(practices ?? []).length === 0 && <li className="text-sm text-zinc-500">No practices logged yet.</li>}
          {(practices ?? []).map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <div>
                <div className="text-sm">
                  {p.name}
                  {p.frequency ? ` · ${p.frequency}` : ''}
                </div>
                <div className="text-xs text-zinc-500">
                  {p.practice_type}
                  {p.practice_type && roomLabel(p.quadrant_id) ? ' · ' : ''}
                  {roomLabel(p.quadrant_id)}
                </div>
              </div>
              <PracticeStatusForm practiceId={p.id} status={p.status} />
            </li>
          ))}
        </ul>

        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-zinc-500">Add a practice</summary>
          <form action={addPractice} className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              name="name"
              placeholder="Practice"
              required
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <input
              type="text"
              name="practice_type"
              placeholder="Type (mindfulness/exercise/prayer)"
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <input
              type="text"
              name="frequency"
              placeholder="Frequency (e.g. daily)"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            {roomSelect('quadrant_id')}
            <button type="submit" className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background">
              Add
            </button>
          </form>
        </details>
      </section>

      {/* The Toolshed */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">The Toolshed</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Apps & platforms. Setup needs the Headmaster&apos;s sign-off even when proposed by Shiloh.
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {(tools ?? []).length === 0 && <li className="text-sm text-zinc-500">No tools yet.</li>}
          {(tools ?? []).map((t) => (
            <li key={t.id} className="rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm">
                    {t.name}
                    {t.category ? ` · ${t.category}` : ''}
                  </div>
                  {t.purpose && <div className="text-xs text-zinc-500">{t.purpose}</div>}
                </div>
                <ToolStatusForm toolId={t.id} status={t.status} />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-zinc-500">
                <span>{roomLabel(t.quadrant_id)}</span>
                {t.signed_off_by ? (
                  <span className="text-emerald-600 dark:text-emerald-400">✓ Signed off</span>
                ) : member.role === 'parent' ? (
                  <form action={signOffTool.bind(null, t.id)}>
                    <button type="submit" className="underline">
                      Sign off
                    </button>
                  </form>
                ) : (
                  <span>Awaiting sign-off</span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-zinc-500">Add a tool</summary>
          <form action={addTool} className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              name="name"
              placeholder="Tool name"
              required
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <input
              type="text"
              name="purpose"
              placeholder="What it's for"
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            {roomSelect('quadrant_id')}
            <button type="submit" className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background">
              Add
            </button>
          </form>
        </details>
      </section>

      {/* The Gallery */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">The Gallery</h2>
        <p className="mt-1 text-xs text-zinc-500">Every project, assignment, and video Shiloh&apos;s actually finished.</p>
        <ul className="mt-3 flex flex-col gap-2">
          {(galleryItems ?? []).length === 0 && (
            <li className="text-sm text-zinc-500">Nothing filed yet.</li>
          )}
          {(galleryItems ?? []).map((g) => (
            <li key={g.id} className="rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>
                  {g.title}
                  {g.type ? ` · ${g.type}` : ''}
                </span>
                <span>{g.date_finished}</span>
              </div>
              <div className="mt-0.5 text-xs text-zinc-500">
                {roomLabel(g.quadrant_id)}
                {g.related_to ? ` · ${g.related_to}` : ''}
              </div>
              {g.where_it_lives && (
                <div className="mt-1 text-xs text-zinc-500">
                  <a href={g.where_it_lives} target="_blank" rel="noopener noreferrer" className="underline">
                    where it lives
                  </a>
                </div>
              )}
              {g.take && <div className="mt-1 text-sm italic">&ldquo;{g.take}&rdquo;</div>}
            </li>
          ))}
        </ul>

        <form
          action={addGalleryItem}
          className="mt-4 flex flex-col gap-2 rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              name="title"
              placeholder="Title"
              required
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <input
              type="text"
              name="type"
              placeholder="Type (e.g. Studio piece)"
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <input
              type="date"
              name="date_finished"
              defaultValue={today}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {roomSelect('quadrant_id')}
            <input
              type="text"
              name="related_to"
              placeholder="Related to (optional)"
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <input
              type="url"
              name="where_it_lives"
              placeholder="Where it lives (link, optional)"
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <input
            type="text"
            name="take"
            placeholder="Shiloh's one-line take (optional)"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="submit"
            className="self-start rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
          >
            Add to Gallery
          </button>
        </form>
      </section>
    </main>
  )
}
