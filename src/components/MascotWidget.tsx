import { Cat } from 'lucide-react'
import { cn } from '../lib/cn'

export type HoldState = 'IDLE' | 'SEARCHING' | 'HOLDING' | 'SUCCESS'

type MascotWidgetProps = {
  state: HoldState
  message: string
}

const RING = {
  IDLE: 'border-mint',
  SEARCHING: 'border-error',
  HOLDING: 'border-periwinkle',
  SUCCESS: 'border-success',
}

/** Munin, the deaf white cat. Feedback stays visual and non-judgmental. */
export function MascotWidget({ state, message }: MascotWidgetProps) {
  return (
    <div className="flex flex-col items-start gap-2" aria-live="polite">
      <p className="relative max-w-[78%] rounded-3xl bg-white px-5 py-3 text-base leading-snug">
        {message}
        <span className="absolute -bottom-1.5 left-8 size-4 rotate-45 bg-white" />
      </p>
      <div
        className={cn(
          'grid size-16 place-items-center rounded-full border-4 bg-white text-periwinkle transition-colors',
          RING[state],
          state === 'SUCCESS' && 'animate-bounce',
        )}
      >
        <Cat className="size-8" aria-label="Munin" />
      </div>
    </div>
  )
}
