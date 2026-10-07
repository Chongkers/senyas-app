***

### `AGENTS.md`

```markdown
# 🧠 System Agents & Core Logic Architecture

To achieve high-performance real-time validation on mobile devices without relying on cloud APIs, **Senyas** is driven by three distinct "agents" or logical engines running entirely on the client edge.

---

## 1. The Vision Pipeline Agent (MediaPipe WebAssembly)
This agent is responsible for extracting 3D spatial data from a raw 2D camera feed.

* **Role:** Continuous frame ingestion and landmark coordinate extraction.
* **Execution:** Runs via WebAssembly (WASM) using hardware GPU delegation.
* **Input:** Raw HTML5 `<video>` feed at 30-60 FPS.
* **Output:** An array of 21 localized 3D points `(x, y, z)` per hand, normalized to the camera viewport.
* **Why it matters:** It isolates the heavy lifting of computer vision from the UI thread, ensuring the app remains responsive and doesn't drain the device battery excessively.

## 2. The Geometric Heuristic Agent (Deterministic Math Engine)
Instead of feeding the 21 landmarks into a secondary Machine Learning classifier (which is prone to latency and black-box failures), this agent applies rigid vector mathematics to evaluate the sign.

* **Role:** Determines if the current hand pose matches the target FSL letter/word.
* **Methodology:** 
  * Calculates Euclidean distances between specific joints (e.g., Thumb Tip `[4]` to Index MCP `[5]`).
  * Evaluates finger state (Extended vs. Curled) by comparing the Y-coordinates of fingertips against PIP joints.
* **Example Rule (Letter "L"):**
  * `Index == Extended` AND `Middle, Ring, Pinky == Curled` AND `Distance(Thumb, Index Base) > 0.16`
* **Why it matters for hackathons:** Zero training data required. If a sign isn't registering correctly under venue lighting, developers can tweak the distance threshold variables instantly in code.

## 3. The Companion Agent (Munin the Mascot State Machine)
A UI/UX agent that manages the gamification and psychological reinforcement of the learner.

* **Role:** Translates raw true/false validation into encouraging, humanized feedback.
* **States:**
  * `IDLE`: Munin is watching the camera feed with a neutral, attentive posture.
  * `SEARCHING (Red AR)`: Munin looks closely, displaying a "Thinking" or "Adjust your hand" prompt.
  * `LOCKED (Hold Timer)`: Munin exhibits anticipation as the frame counter tracks the required 1.5-second hold duration.
  * `SUCCESS (Green AR)`: Munin cheers. This state triggers the `@capacitor/haptics` bridge for a physical buzz and advances the lesson queue.
* **Why it matters:** FSL beginners experience high friction and self-doubt. The Companion Agent softens the technical rigidity of computer vision, turning a pass/fail system into an encouraging game loop.