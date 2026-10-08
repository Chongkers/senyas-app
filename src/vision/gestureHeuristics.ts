export type Landmark = { x: number; y: number; z: number }
export type DetectedLetter = 'A' | 'B' | 'L' | 'Y' | 'UNKNOWN'

const WRIST = 0
// [mcp, tip] per finger
const INDEX = [5, 8] as const
const MIDDLE = [9, 12] as const
const RING = [13, 16] as const
const PINKY = [17, 20] as const

// Every rule below is distance-based, so results are identical for the
// mirrored (front camera) and unmirrored feed. Directional rules added later
// must account for the horizontal flip.
function dist(a: Landmark, b: Landmark) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function isExtended(lm: Landmark[], [mcp, tip]: readonly [number, number]) {
  return dist(lm[tip], lm[WRIST]) > dist(lm[mcp], lm[WRIST])
}

export function evaluateGesture(lm: Landmark[]): DetectedLetter {
  if (!lm || lm.length < 21) return 'UNKNOWN'

  const index = isExtended(lm, INDEX)
  const middle = isExtended(lm, MIDDLE)
  const ring = isExtended(lm, RING)
  const pinky = isExtended(lm, PINKY)

  if (index && middle && ring && pinky) {
    return dist(lm[4], lm[17]) < 0.22 ? 'B' : 'UNKNOWN'
  }
  if (index && !middle && !ring && !pinky) {
    return dist(lm[4], lm[5]) > 0.16 ? 'L' : 'UNKNOWN'
  }
  if (pinky && !index && !middle && !ring) {
    return dist(lm[4], lm[2]) > 0.12 ? 'Y' : 'UNKNOWN'
  }
  if (!index && !middle && !ring && !pinky) {
    return dist(lm[4], lm[5]) < 0.13 ? 'A' : 'UNKNOWN'
  }
  return 'UNKNOWN'
}
