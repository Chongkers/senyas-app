import { cn } from '../../lib/cn'

type ProgressBarProps = {
  /** 0 to 1 */
  value: number
  trackClassName?: string
  className?: string
}

export function ProgressBar({ value, trackClassName, className }: ProgressBarProps) {
  const pct = Math.min(1, Math.max(0, value)) * 100
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-3 overflow-hidden rounded-full bg-mint-light', trackClassName, className)}
    >
      <div
        className="h-full rounded-full bg-periwinkle transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

type SegmentedProgressProps = {
  total: number
  /** Index of the step in progress; earlier steps render as done. */
  current: number
  className?: string
}

export function SegmentedProgress({ total, current, className }: SegmentedProgressProps) {
  return (
    <div className={cn('flex flex-1 gap-1.5', className)} aria-label={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-2.5 flex-1 rounded-full',
            i < current ? 'bg-periwinkle' : i === current ? 'bg-sky' : 'bg-white',
          )}
        />
      ))}
    </div>
  )
}
