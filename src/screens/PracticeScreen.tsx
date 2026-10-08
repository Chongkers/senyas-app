import { Haptics, NotificationType } from '@capacitor/haptics'
import confetti from 'canvas-confetti'
import { ArrowLeft, Check, Search, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { HoldProgressBar, type HoldProgressHandle } from '../components/HoldProgressBar'
import { MascotWidget, type HoldState } from '../components/MascotWidget'
import { MobileCameraHUD } from '../components/MobileCameraHUD'
import { IconButton } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { SegmentedProgress } from '../components/ui/Progress'
import {
  ALPHABET_LESSON,
  USER_NAME,
  XP_PER_SIGN,
  type LessonResult,
  type TargetLetter,
} from '../data/lessons'
import { evaluateGesture, type DetectedLetter, type Landmark } from '../vision/gestureHeuristics'

const REQUIRED_FRAMES = 25
const HOLD_SECONDS = 0.8
const SUCCESS_PAUSE_MS = 1400
const SIMULATED_FRAME_MS = 33

const HINTS: Record<TargetLetter, string> = {
  A: 'Make a fist with your thumb resting beside your index finger.',
  B: 'Hold four fingers straight up and tuck your thumb across your palm.',
  L: 'Point your index finger up and stretch your thumb out to the side.',
  Y: 'Stretch out your thumb and pinky, and curl the other fingers.',
}

type PracticeScreenProps = {
  onExit: () => void
  onComplete: (result: LessonResult) => void
}

export function PracticeScreen({ onExit, onComplete }: PracticeScreenProps) {
  const { queue } = ALPHABET_LESSON
  const [step, setStep] = useState(0)
  const [state, setState] = useState<HoldState>('IDLE')

  // Frame-loop state lives in refs so per-frame work never triggers a render.
  const stepRef = useRef(0)
  const stateRef = useRef<HoldState>('IDLE')
  const framesRef = useRef(0)
  const holdBarRef = useRef<HoldProgressHandle>(null)
  const advanceTimer = useRef(0)
  const simulateTimer = useRef(0)

  const target = queue[step]

  const advance = useCallback(() => {
    const next = stepRef.current + 1
    if (next >= queue.length) {
      onComplete({
        lesson: `${ALPHABET_LESSON.topic} · ${ALPHABET_LESSON.part}`,
        scoreLabel: `${queue.length}/${queue.length}`,
        xpEarned: queue.length * XP_PER_SIGN,
        signsLabel: queue.join(' '),
        signsCount: queue.length,
        retry: 'practice',
      })
      return
    }
    stepRef.current = next
    stateRef.current = 'IDLE'
    framesRef.current = 0
    holdBarRef.current?.set(0)
    setStep(next)
    setState('IDLE')
  }, [queue, onComplete])

  const handleDetection = useCallback(
    (detected: DetectedLetter | null) => {
      if (stateRef.current === 'SUCCESS') return true

      let next: HoldState =
        detected === null ? 'IDLE' : detected === queue[stepRef.current] ? 'HOLDING' : 'SEARCHING'
      framesRef.current = next === 'HOLDING' ? framesRef.current + 1 : 0
      if (framesRef.current >= REQUIRED_FRAMES) next = 'SUCCESS'
      holdBarRef.current?.set(framesRef.current / REQUIRED_FRAMES)

      if (next !== stateRef.current) {
        stateRef.current = next
        setState(next)
        if (next === 'SUCCESS') {
          Haptics.notification({ type: NotificationType.Success }).catch(() => {})
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.45 },
            colors: ['#4f72ba', '#96b8d0', '#c8e5d9', '#ecb5cf'],
          })
          advanceTimer.current = window.setTimeout(advance, SUCCESS_PAUSE_MS)
        }
      }
      return next === 'HOLDING' || next === 'SUCCESS'
    },
    [queue, advance],
  )

  const handleFrame = useCallback(
    (lm: Landmark[] | null) => handleDetection(lm ? evaluateGesture(lm) : null),
    [handleDetection],
  )

  const simulate = useCallback(() => {
    window.clearInterval(simulateTimer.current)
    simulateTimer.current = window.setInterval(() => {
      handleDetection(queue[stepRef.current])
      if (stateRef.current === 'SUCCESS') window.clearInterval(simulateTimer.current)
    }, SIMULATED_FRAME_MS)
  }, [queue, handleDetection])

  useEffect(
    () => () => {
      window.clearTimeout(advanceTimer.current)
      window.clearInterval(simulateTimer.current)
    },
    [],
  )

  const matched = state === 'HOLDING' || state === 'SUCCESS'
  const message = {
    IDLE: `Kumusta, ${USER_NAME}! Form the letter ${target}. ${HINTS[target]}`,
    SEARCHING: `Getting closer. ${HINTS[target]}`,
    HOLDING: `That's ${target}! Hold it right there.`,
    SUCCESS: `Galing! You signed ${target}.`,
  }[state]

  return (
    <div className="pt-safe pb-safe relative flex h-full flex-col gap-4 overflow-hidden bg-line px-5">
      <header className="relative z-10 flex items-center gap-3">
        <IconButton aria-label="Back" className="border-0 bg-white" onClick={onExit}>
          <ArrowLeft className="size-5" />
        </IconButton>
        <SegmentedProgress total={queue.length} current={step} />
        <span className="rounded-full bg-white px-3.5 py-2 font-display text-base font-extrabold">
          {step + 1}/{queue.length}
        </span>
      </header>

      <section className="relative z-10 flex items-stretch rounded-card bg-white p-5">
        <div className="flex-1">
          <p className="font-display text-xs font-extrabold uppercase tracking-widest">
            Target sign
          </p>
          <p className="font-display text-6xl font-black leading-none">{target}</p>
        </div>
        <div className="flex flex-1 flex-col items-end justify-between border-l border-line pl-4">
          <p className="font-display text-xs font-extrabold uppercase tracking-widest">Detected</p>
          {matched ? (
            <Chip tone="success" icon={<Check className="size-4" />} className="py-2.5">
              Detected {target}
            </Chip>
          ) : (
            <Chip tone="error" icon={<Search className="size-4" />} className="py-2.5">
              Searching...
            </Chip>
          )}
        </div>
      </section>

      <MobileCameraHUD state={state} onFrame={handleFrame} onSimulate={simulate} />

      <div className="relative">
        <MascotWidget state={state} message={message} />
      </div>

      <footer className="relative rounded-card bg-white p-5">
        <div className="flex items-center gap-4">
          <IconButton aria-label="Quit lesson" onClick={onExit}>
            <X className="size-5" />
          </IconButton>
          <HoldProgressBar ref={holdBarRef} holdSeconds={HOLD_SECONDS} />
        </div>
        <p className="mt-3 text-center text-sm">Hold still for {HOLD_SECONDS} seconds...</p>
      </footer>
    </div>
  )
}
