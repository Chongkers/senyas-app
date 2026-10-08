import { CircleCheck, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type AnswerState = 'default' | 'selected' | 'correct' | 'wrong'

type AnswerCardProps = {
  letter: string
  word: string
  meaning: string
  state: AnswerState
  disabled?: boolean
  onSelect: () => void
}

const CARD = {
  default: 'border-line bg-white',
  selected: 'border-periwinkle bg-mint-light',
  correct: 'border-ink bg-success',
  wrong: 'border-ink bg-error',
}

export function AnswerCard({ letter, word, meaning, state, disabled, onSelect }: AnswerCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={state !== 'default'}
      onClick={onSelect}
      className={cn(
        'relative rounded-card border-2 p-4 text-left transition active:scale-[0.98] disabled:active:scale-100',
        CARD[state],
      )}
    >
      <span
        className={cn(
          'grid h-7 w-9 place-items-center rounded-full text-sm font-extrabold',
          state === 'selected' ? 'bg-periwinkle text-white' : 'bg-surface text-ink',
        )}
      >
        {letter}
      </span>
      <span className="mt-2 block text-xl font-extrabold leading-tight">{word}</span>
      <span className="mt-1 block font-body text-sm font-normal">{meaning}</span>
      {state === 'correct' && <CircleCheck className="absolute right-4 top-4 size-5" />}
      {state === 'wrong' && <X className="absolute right-4 top-4 size-5" />}
    </button>
  )
}
