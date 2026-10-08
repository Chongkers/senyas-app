# AGENTS.md — Senyas Architecture & Dev Directives

## 1. Project Context
* **App:** Senyas (Filipino Sign Language / FSL learning mobile app).
* **Target:** 48-Hour Hackathon MVP.
* **Stack:** React 19, Vite, TypeScript, Tailwind CSS, Capacitor 6 (Android/iOS).
* **Core Tech:** On-device `@mediapipe/tasks-vision` (WebAssembly/GPU delegate), `@capacitor/haptics`.
* **Guardrails:** Zero cloud ML, zero Python backend, zero Flutter/C++ bridges. All inference runs client-side.

---

## 2. Core Subsystems (Agents)

### Agent 1: Vision Ingestion (`useMobileCamera.ts` / `MobileCameraHUD.tsx`)
* **Role:** Ingests portrait camera feed, runs MediaPipe HandLandmarker in WASM at 30+ FPS.
* **Input:** HTML5 `<video>` stream (front-facing, mirrored: `-scale-x-100`).
* **Output:** Normalized 21-point 3D landmark array: `Array<{x: number, y: number, z: number}>`.
* **Token/Compute Rules:**
  * Do not dispatch React state on every frame.
  * Landmarker initialization must be a singleton cached outside component render cycles.
  * Canvas skeleton rendering must stay inside `requestAnimationFrame` loops.

### Agent 2: Geometric Heuristic Engine (`gestureHeuristics.ts`)
* **Role:** Evaluates hand coordinates using deterministic vector math. No custom neural nets.
* **Methodology:**
  * Finger extension test: `dist(tip, wrist) > dist(mcp, wrist)`.
  * Spatial thresholds: Euclidean 2D distance `Math.hypot(x1 - x2, y1 - y2)`.
* **Supported Alphabet Rules (MVP):**
  * `L`: Index extended, thumb spread (`dist(lm[4], lm[5]) > 0.16`), middle/ring/pinky curled.
  * `B`: Index, middle, ring, pinky extended; thumb tucked (`dist(lm[4], lm[17]) < 0.22`).
  * `Y`: Thumb & pinky extended (`dist(lm[4], lm[2]) > 0.12`), index/middle/ring curled.
  * `A`: Fist closed, thumb adjacent to index base (`dist(lm[4], lm[5]) < 0.13`).
* **Contract:** Function `evaluateGesture(lm: Landmark[]): DetectedLetter`. Returns `"UNKNOWN"` if confidence/landmarks are insufficient.

### Agent 3: Sensory & Mascot Companion (`MascotWidget.tsx` / `HoldProgressBar.tsx`)
* **Role:** Gamification state machine, visual validation, and tactile feedback.
* **State Contract:**
  * `IDLE`: No hand detected.
  * `SEARCHING`: Hand visible, sign mismatch (red keypoints).
  * `HOLDING`: Matching target sign; increment frame counter toward `REQUIRED_FRAMES = 25` (~0.8s hold).
  * `SUCCESS`: Hold threshold met. Fires `@capacitor/haptics` notification (`NotificationType.Success`), triggers confetti, advances lesson queue.
* **Mascot Context:** "Munin" (deaf white cat, blue eyes, teal bandana). Non-judgmental visual feedback.

---

## 3. Coding Agent Constraints & Guardrails

When modifying or generating code for this repository, observe the following rules:

1. **Token Efficiency:** When proposing edits, output only changed functions or localized diffs. Do not re-print unedited files.
2. **Framework Isolation:** Reject solutions proposing Python, Flask, FastAPI, TensorFlow.js, or native Android NDK. Maintain the web-to-Capacitor boundary.
3. **State Management Discipline:** Keep frame loops out of React global stores (Redux/Zustand). Use `useRef` for frame counters, animation IDs, and raw landmark buffers.
4. **Offline Resilience:** All model assets must resolve from `public/models/` rather than external CDNs in production builds.
5. **Coordinate Mirroring:** Always account for horizontal flipping when calculating relative directional vectors (e.g., thumb pointing left vs. right).