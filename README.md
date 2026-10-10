# 🌌 HB UNIVERSE — PHASE 13: MOBILE APP EXPERIENCE + RESPONSIVE DESIGN + PWA + PERFORMANCE OPTIMIZATION

Welcome to **HB UNIVERSE (Phase 13)** — a mobile-first, installable Progressive Web Application (PWA) with responsive layouts, virtual touch controls, dynamic rendering quality adaptation, on-demand lazy-loaded worlds, and offline shell resilience.

---

## 🚀 What's New in Phase 13

1. **Mobile-First Responsive System**:
   - Centralized fluid breakpoints covering **320px, 375px, 390px, 430px, 768px, 1024px, 1280px, 1440px, and 1920px+ (Ultra-Wide)**.
   - Safe-area inset support (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) for modern notched/island mobile displays.
   - Elimination of unwanted horizontal scrolling.

2. **Touch Controls & Virtual Joystick (`src/input/`)**:
   - **Virtual Joystick**: 2D floating/docked joystick with dead-zone handling, smooth vector normalization, and touch lifecycle.
   - **Touch Interaction Controls**: Touch-based world entry triggers, jump/interact actions, and gesture managers (`SWIPE`, `TAP`, `PINCH`) without interfering with native scrolling.

3. **Performance & Dynamic Quality Manager (`src/performance/`)**:
   - **Quality Profiles**: `ULTRA`, `HIGH`, `MEDIUM`, `LOW`, and `MOBILE`.
   - **Device Pixel Ratio (DPR) Capping**: Capped at 1.0–1.25 on mobile to save GPU/battery; up to 2.0 on high-end desktop displays.
   - **Dynamic Quality Degradation & Recovery**: Real-time FPS monitoring that automatically adjusts particle budgets (120 to 1200) and post-processing effects.
   - **Developer Performance HUD**: Optional live overlay monitoring FPS, active tier, DPR, and particle budgets.

4. **Code Splitting & Lazy-Loaded Worlds**:
   - On-demand chunk streaming for all worlds: `ArcadeWorld`, `CinemaWorld`, `MusicWorld`, `AIWorld`, `ChallengeWorld`, and `MysteryWorld`.
   - Initial load bundle size reduced with fast warm-up and quantum warp transition fallbacks.

5. **Progressive Web App (PWA) & Offline Shell**:
   - `manifest.webmanifest`: Standalone app configuration, theme colors (`#050505`, `#ffe500`), and multi-resolution icons.
   - `sw.js` Service Worker: Caches application shell, CSS, JS, and icons for instant startup without caching sensitive user auth tokens or private data.
   - `InstallPromptModal.tsx`: Non-intrusive `[ INSTALL HB UNIVERSE ]` prompt for mobile and desktop browser installations.

6. **Network Status & Reconnection Flow (`src/network/`)**:
   - Seamless transition handling for `ONLINE`, `OFFLINE`, and `RECONNECTING`.
   - Auto-triggers cloud synchronization upon network restoration.

---

## 🛠️ Complete Multi-Tier Architecture

```text
                         🌌 HB UNIVERSE
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
          DESKTOP             TABLET            MOBILE
        (Mouse/Keys)       (Responsive)     (Touch/PWA)
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                         RESPONSIVE UI
                                │
                    ┌───────────┴───────────┐
                    │                       │
                  3D MODE                2D MODE
               (WebGPU/GL)             (HTML/Cards)
                    │                       │
                    └───────────┬───────────┘
                                │
                          WORLD SYSTEM
                                │
       ┌────────┬────────┬──────┼──────┬────────┬────────┐
       │        │        │      │      │        │        │
     Arcade  Cinema   Music    AI  Challenge Mystery Profile
                                │
                          CLOUD BACKEND
                             FastAPI
                                │
                         CLOUD DATABASE
                      PostgreSQL / SQLite
```

---

## 💻 Development & Build Commands

### Frontend (React + Vite + Three.js + PWA)
```bash
npm install
npm run dev      # Local development server on http://localhost:3000
npm run build    # Production build with code-split world chunks (0 errors)
```

### 📱 Mobile App (Android & iOS via Capacitor)
```bash
# 1. Build and sync web assets to Android
npm run cap:build

# 2. Open Android Studio to build APK / AAB or run on USB-connected device/emulator
npm run cap:open:android

# (Optional) Open iOS in Xcode (macOS only)
npm run cap:open:ios
```
*Or simply double-click `build_mobile_android.bat` for one-click build and sync.*

### 🖥️ Desktop Application (Windows Standalone via Electron)
```bash
# Live development in standalone desktop window:
npm run electron:dev

# Test packaged build locally:
npm run electron:preview

# Compile standalone Windows Installer (.exe) & Portable App:
npm run electron:dist
```
*Or simply double-click `run_desktop_app.bat` to launch or `build_desktop_app.bat` to package.*

---

### Backend (Python + FastAPI + PostgreSQL/SQLite)
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

