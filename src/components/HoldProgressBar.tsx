import { useImperativeHandle, useRef, type Ref } from 'react'

export type HoldProgressHandle = {
  /** Update the bar without a React render; safe to call every frame. */
  set: (fraction: number) => void
}

type HoldProgressBarProps = {
  ref: Ref<HoldProgressHandle>
  holdSeconds: number
}

export function HoldProgressBar({ ref, holdSeconds }: HoldProgressBarProps) {
  const fillRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useImperativeHandle(
    ref,
    () => ({
      set(fraction) {
        const clamped = Math.min(1, Math.max(0, fraction))
        if (fillRef.current) fillRef.current.style.width = `${clamped * 100}%`
        if (labelRef.current) {
          labelRef.current.textContent = `${(clamped * holdSeconds).toFixed(1)}s`
        }
      },
    }),
    [holdSeconds],
  )

  return (
    <div className="flex flex-1 items-center gap-4">
      <div className="h-4 flex-1 overflow-hidden rounded-full bg-mint-light">
        <div ref={fillRef} className="h-full w-0 rounded-full bg-periwinkle" />
      </div>
      <span ref={labelRef} className="w-10 text-right font-display text-lg font-extrabold tabular-nums">
        0.0s
      </span>
    </div>
  )
}
