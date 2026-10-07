# 🤟 Senyas 

**An Interactive, On-Device Filipino Sign Language (FSL) Learning App**  
*Built for the AppBuilders PH 48-Hour Hackathon*

---

## 📖 The Problem
Current sign language apps are **passive dictionaries**. They show a video of a sign, but users are left guessing if their own hand placement, finger curling, and angles are correct. This creates a high barrier to entry and fosters impostor syndrome among beginners.

## 💡 The Solution
**Senyas** is an active, pedagogical learning companion. Using real-time, on-device computer vision and augmented reality overlays, Senyas tracks your hands and provides instant, mathematically calculated feedback. 

Guided by our mascot, **Munin** (a congenitally deaf white cat with blue eyes), users learn FSL not by watching, but by doing.

## ✨ Key Features
* **Real-Time AR Feedback:** A virtual skeleton overlays your hand via the front-facing camera, turning from red to green when you hit the correct FSL pose.
* **100% Offline Edge Vision:** Powered by Google MediaPipe WASM binaries running directly on the device GPU. Zero server latency, zero Wi-Fi reliance, and complete user privacy.
* **Zero-Training Heuristic Engine:** Instead of heavy, slow neural networks, Senyas uses deterministic geometric vector math (Euclidean distances and joint angles) to instantly validate signs.
* **Native Mobile Experience:** Built with Capacitor for true native Android/iOS deployment, featuring integrated haptic vibration feedback for successful signs.

## 🛠 Tech Stack
* **Frontend:** React 19, Vite, TypeScript, Tailwind CSS
* **Mobile Container:** Capacitor 6 (iOS & Android)
* **Computer Vision:** `@mediapipe/tasks-vision` (HandLandmarker)
* **Sensory APIs:** `@capacitor/haptics`

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone [https://github.com/yourusername/senyas-mobile.git](https://github.com/yourusername/senyas-mobile.git)
cd senyas-mobile
npm install