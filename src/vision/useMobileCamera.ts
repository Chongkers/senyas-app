import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import { useEffect, useRef, useState } from 'react'
import type { Landmark } from './gestureHeuristics'

export type CameraStatus = 'loading' | 'ready' | 'error'

/** Called once per video frame. Return true when the hand matches the target. */
export type FrameHandler = (landmarks: Landmark[] | null) => boolean

const MODELS = `${import.meta.env.BASE_URL}models`
const MATCH_COLOR = '#4f72ba'
const MISMATCH_COLOR = '#e05a5a'

// Singleton: the WASM runtime and model load once for the app's lifetime.
let landmarkerPromise: Promise<HandLandmarker> | null = null

function getLandmarker() {
  landmarkerPromise ??= (async () => {
    const fileset = await FilesetResolver.forVisionTasks(`${MODELS}/wasm`)
    return HandLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath: `${MODELS}/hand_landmarker.task`,
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numHands: 1,
    })
  })().catch((err) => {
    landmarkerPromise = null
    throw err
  })
  return landmarkerPromise
}

function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  lm: Landmark[],
  color: string,
) {
  const { width, height } = ctx.canvas
  ctx.lineWidth = Math.max(3, width / 160)
  ctx.lineCap = 'round'
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.beginPath()
  for (const { start, end } of HandLandmarker.HAND_CONNECTIONS) {
    ctx.moveTo(lm[start].x * width, lm[start].y * height)
    ctx.lineTo(lm[end].x * width, lm[end].y * height)
  }
  ctx.stroke()

  ctx.fillStyle = color
  const radius = Math.max(5, width / 90)
  for (const point of lm) {
    ctx.beginPath()
    ctx.arc(point.x * width, point.y * height, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function useMobileCamera(onFrame: FrameHandler) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onFrameRef = useRef(onFrame)
  const [status, setStatus] = useState<CameraStatus>('loading')

  useEffect(() => {
    onFrameRef.current = onFrame
  }, [onFrame])

  useEffect(() => {
    let cancelled = false
    let rafId = 0
    let stream: MediaStream | null = null
    let lastVideoTime = -1

    async function start() {
      try {
        const [landmarker, media] = await Promise.all([
          getLandmarker(),
          navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              facingMode: 'user',
              width: { ideal: 720 },
              height: { ideal: 1280 },
            },
          }),
        ])
        stream = media
        const video = videoRef.current
        const canvas = canvasRef.current
        if (cancelled || !video || !canvas) {
          media.getTracks().forEach((track) => track.stop())
          return
        }
        video.srcObject = media
        await video.play()
        if (cancelled) return
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')!
        setStatus('ready')

        const loop = () => {
          if (cancelled) return
          if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime
            const result = landmarker.detectForVideo(video, performance.now())
            const lm = result.landmarks[0] ?? null
            const matched = onFrameRef.current(lm)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            if (lm) drawSkeleton(ctx, lm, matched ? MATCH_COLOR : MISMATCH_COLOR)
          }
          rafId = requestAnimationFrame(loop)
        }
        rafId = requestAnimationFrame(loop)
      } catch (err) {
        console.warn('Camera or hand model unavailable', err)
        if (!cancelled) setStatus('error')
      }
    }

    start()
    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  return { videoRef, canvasRef, status }
}
