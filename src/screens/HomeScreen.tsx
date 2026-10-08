import { Bell, Flame, Hand, Play, Search, Target, Zap } from 'lucide-react'
import { Chip } from '../components/ui/Chip'
import { ProgressBar } from '../components/ui/Progress'
import { TopicGrid, type TopicId } from '../components/TopicGrid'
import { ALPHABET_LESSON, DAILY_GOAL, USER_NAME } from '../data/lessons'

type HomeScreenProps = {
  xp: number
  streak: number
  signsToday: number
  onOpenTopic: (topic: TopicId) => void
  onSeeAll: () => void
}

export function HomeScreen({ xp, streak, signsToday, onOpenTopic, onSeeAll }: HomeScreenProps) {
  return (
    <div className="pt-safe flex flex-col gap-6 px-5 pb-8">
      <header className="flex items-center gap-2">
        <span className="grid size-11 place-items-center rounded-xl bg-mint text-periwinkle">
          <Hand className="size-6" />
        </span>
        <span className="mr-auto font-display text-2xl font-semibold">Senyas</span>
        <Chip tone="blush" icon={<Flame className="size-4" />}>
          {streak}
        </Chip>
        <Chip tone="mint" icon={<Zap className="size-4" />}>
          {xp}
        </Chip>
        <button type="button" aria-label="Notifications" className="grid size-10 place-items-center">
          <Bell className="size-6" />
        </button>
      </header>

      <div>
        <p className="text-base">Kumusta, {USER_NAME}!</p>
        <h1 className="text-[1.75rem] font-black leading-tight">Let's learn a new sign today</h1>
      </div>

      <label className="flex h-14 items-center gap-3 rounded-full border border-line bg-surface px-5">
        <Search className="size-5 shrink-0" />
        <input
          type="search"
          placeholder="Search a sign or word"
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink/60"
        />
      </label>

      <section className="flex items-center gap-4 rounded-card bg-mint-light p-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white text-periwinkle">
          <Target className="size-6" />
        </span>
        <div className="flex-1">
          <div className="mb-2 flex justify-between font-display font-extrabold">
            <span>Daily goal</span>
            <span>
              {Math.min(signsToday, DAILY_GOAL)} / {DAILY_GOAL} signs
            </span>
          </div>
          <ProgressBar value={signsToday / DAILY_GOAL} trackClassName="bg-white" className="h-2.5" />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xl font-extrabold">Browse topics</h2>
          <button type="button" className="font-body text-base font-normal underline" onClick={onSeeAll}>
            See all
          </button>
        </div>
        <TopicGrid xp={xp} onOpenTopic={onOpenTopic} />
      </section>

      <section>
        <h2 className="mb-3 text-xl font-extrabold">Continue learning</h2>
        <button
          type="button"
          onClick={() => onOpenTopic('alphabet')}
          className="flex w-full items-center gap-4 rounded-card border-2 border-line bg-white p-4 text-left active:scale-[0.99]"
        >
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-periwinkle text-white">
            <Hand className="size-8" />
          </span>
          <span className="flex-1">
            <span className="block font-body text-sm font-normal">
              {ALPHABET_LESSON.topic} · {ALPHABET_LESSON.part}
            </span>
            <span className="block text-lg font-extrabold">{ALPHABET_LESSON.title}</span>
            <span className="mt-1.5 flex items-center gap-2">
              <ProgressBar value={0} className="h-2 flex-1" />
              <span className="text-sm font-extrabold">0/{ALPHABET_LESSON.queue.length}</span>
            </span>
          </span>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mint">
            <Play className="size-5 fill-current" />
          </span>
        </button>
      </section>
    </div>
  )
}
