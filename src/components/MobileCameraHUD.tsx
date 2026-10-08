import { CameraOff, Hand } from 'lucide-react'
import { cn } from '../lib/cn'
import { useMobileCamera, type FrameHandler } from '../vision/useMobileCamera'
import type { HoldState } from './MascotWidget'

type MobileCameraHUDProps = {
  state: HoldState
  onFrame: FrameHandler
  /** Fallback when the camera or model is unavailable (e.g. desktop preview). */
  onSimulate: () => void
}

const FRAME = {
  IDLE: 'border-periwinkle',
  SEARCHING: 'border-[#e05a5a]',
  HOLDING: 'border-periwinkle',
  SUCCESS: 'border-ink',
}

export function MobileCameraHUD({ state, onFrame, onSimulate }: MobileCameraHUDProps) {
  const { videoRef, canvasRef, status } = useMobileCamera(onFrame)
  const unavailable = status === 'error'

  return (
    <>
      {/* Front camera is mirrored; the canvas shares the flip so landmarks line up. */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 size-full -scale-x-100 object-cover"
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 size-full -scale-x-100 object-cover"
      />

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-10">
        <button
          type="button"
          disabled={!unavailable}
          onClick={onSimulate}
          className={cn(
            'grid min-h-0 w-full max-w-72 flex-1 place-items-center rounded-[2rem] border-[3px] border-dashed transition-colors',
            FRAME[state],
            state === 'SUCCESS' && 'border-solid bg-success/30',
          )}
        >
          {state === 'IDLE' && (
            <span className="flex flex-col items-center gap-3">
              <span className="grid size-20 place-items-center rounded-full bg-white text-periwinkle">
                {unavailable ? <CameraOff className="size-9" /> : <Hand className="size-9" />}
              </span>
              <span className="rounded-full bg-white px-4 py-1.5 font-body text-base font-normal">
                {status === 'loading' && 'Starting camera...'}
                {status === 'ready' && 'Place your hand in the frame'}
                {unavailable && 'Camera unavailable'}
              </span>
            </span>
          )}
        </button>
        {unavailable && (
          <p className="font-display text-xs font-extrabold uppercase tracking-widest">
            Tap the frame to simulate
          </p>
        )}
      </div>
    </>
  )
}
