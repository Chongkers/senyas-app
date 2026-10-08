import { ArrowLeft, Flame, Hand, Sparkles, Star, Trophy, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button, IconButton } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/Progress'
import { FAMILY_UNLOCK_XP, USER_NAME, type LessonResult } from '../data/lessons'
import { cn } from '../lib/cn'

type ResultsScreenProps = {
  result: LessonResult
  xp: number
  streak: number
  onHome: () => void
  onNext: () => void
  onRetry: () => void
}

export function ResultsScreen({ result, xp, streak, onHome, onNext, onRetry }: ResultsScreenProps) {
  const remaining = FAMILY_UNLOCK_XP - xp

  return (
    <div className="pb-safe flex h-full flex-col overflow-y-auto">
      <div className="pt-safe rounded-b-[2.5rem] bg-mint-light px-5 pb-24 text-center">
        <IconButton aria-label="Back to home" className="border-0 bg-white" onClick={onHome}>
          <ArrowLeft className="size-5" />
        </IconButton>
        <div className="relative mx-auto mt-2 grid size-36 place-items-center rounded-full bg-blush">
          <span className="grid size-24 place-items-center rounded-full bg-white text-periwinkle">
            <Trophy className="size-12" />
          </span>
          <Sparkles className="absolute -right-3 -top-1 size-8 text-[#b9479a]" />
        </div>
        <h1 className="mt-5 text-4xl font-black">Galing, {USER_NAME}!</h1>
        <p className="mt-2 text-base">
          You finished {result.lesson}.
          <br />
          Keep the streak going tomorrow.
        </p>
      </div>

      <div className="-mt-16 grid grid-cols-2 gap-3 px-5">
        <Stat tone="bg-sky" icon={<Star className="size-5" />} label="Score" value={result.scoreLabel} />
        <Stat tone="bg-mint" icon={<Zap className="size-5" />} label="XP earned" value={`+${result.xpEarned}`} />
        <Stat tone="bg-blush" icon={<Flame className="size-5" />} label="Streak" value={`${streak} days`} />
        <Stat tone="bg-mint-light" icon={<Hand className="size-5" />} label="Signs learned" value={result.signsLabel} />
      </div>

      <section className="mx-5 mt-5 rounded-card bg-surface p-4">
        <div className="mb-2 flex justify-between font-display font-extrabold">
          <span>Level {Math.floor(xp / 100) + 1} · Signer</span>
          <span>
            {xp} / {FAMILY_UNLOCK_XP} XP
          </span>
        </div>
        <ProgressBar value={xp / FAMILY_UNLOCK_XP} trackClassName="bg-white" className="h-2.5" />
        <p className="mt-2 text-sm">
          {remaining > 0 ? `${remaining} XP more to unlock Family` : 'Family is unlocked!'}
        </p>
      </section>

      <div className="mt-auto flex flex-col gap-3 px-5 pt-6">
        <Button onClick={onNext}>Next lesson</Button>
        <Button variant="secondary" onClick={onRetry}>
          Practice again
        </Button>
      </div>
    </div>
  )
}

function Stat({ tone, icon, label, value }: { tone: string; icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-card border-2 border-line bg-white p-3.5">
      <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl', tone)}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm">{label}</span>
        <span className="block truncate font-display text-2xl font-black leading-tight">{value}</span>
      </span>
    </div>
  )
}
