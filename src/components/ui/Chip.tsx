import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

const TONES = {
  blush: 'bg-blush',
  mint: 'bg-mint',
  success: 'bg-success',
  error: 'bg-error',
  locked: 'border border-dashed border-ink/30 bg-surface',
}

type ChipProps = {
  tone: keyof typeof TONES
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export function Chip({ tone, icon, children, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-display text-base font-extrabold text-ink',
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
