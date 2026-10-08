import { HandHeart, Hash, Lock } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { ALPHABET_LESSON, FAMILY_UNLOCK_XP, GREETINGS_QUIZ } from '../data/lessons'

export type TopicId = 'alphabet' | 'numbers' | 'greetings' | 'family'

type TopicGridProps = {
  xp: number
  onOpenTopic: (topic: TopicId) => void
}

export function TopicGrid({ xp, onOpenTopic }: TopicGridProps) {
  const familyLocked = xp < FAMILY_UNLOCK_XP
  const topics: {
    id: TopicId
    name: string
    detail: string
    icon: ReactNode
    tone: string
    disabled?: boolean
  }[] = [
    {
      id: 'alphabet',
      name: 'Alphabet',
      detail: `${ALPHABET_LESSON.queue.length} signs · camera`,
      icon: <span className="text-base font-black">Aa</span>,
      tone: 'bg-sky',
    },
    {
      id: 'numbers',
      name: 'Numbers',
      detail: '1 to 10 · coming soon',
      icon: <Hash className="size-5" />,
      tone: 'bg-blush',
      disabled: true,
    },
    {
      id: 'greetings',
      name: 'Greetings',
      detail: `${GREETINGS_QUIZ.questions.length} signs · quiz`,
      icon: <HandHeart className="size-5" />,
      tone: 'bg-mint',
    },
    {
      id: 'family',
      name: 'Family',
      detail: familyLocked ? `Unlocks at ${FAMILY_UNLOCK_XP} XP` : 'Unlocked · coming soon',
      icon: familyLocked ? <Lock className="size-5" /> : <HandHeart className="size-5" />,
      tone: familyLocked ? 'border border-dashed border-ink/30 bg-surface' : 'bg-success',
      disabled: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {topics.map((topic) => (
        <button
          key={topic.id}
          type="button"
          disabled={topic.disabled}
          onClick={() => onOpenTopic(topic.id)}
          className={cn(
            'rounded-card p-4 text-left transition active:scale-[0.98] disabled:active:scale-100',
            topic.tone,
          )}
        >
          <span className="grid size-10 place-items-center rounded-full bg-white">{topic.icon}</span>
          <span className="mt-3 block text-xl font-extrabold">{topic.name}</span>
          <span className="mt-1 block font-body text-sm font-normal">{topic.detail}</span>
        </button>
      ))}
    </div>
  )
}
