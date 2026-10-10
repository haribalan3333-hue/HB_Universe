import { useState, useEffect } from 'react';
import { useUniverseStore } from './store/universeStore';
import { EntryScreen } from './components/LoadingScreen/EntryScreen';
import { UniverseBackground } from './components/Universe/UniverseBackground';
import { Navbar } from './components/Navbar/Navbar';
import { BottomNavigation } from './components/Navbar/BottomNavigation';
import { WorldModal } from './components/Portal/WorldModal';
import { WorldMapModal } from './components/Map/WorldMapModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { TravelLoading } from './navigation/TravelLoading';
import { WorldNavigator } from './navigation/WorldNavigator';
import { HBCharacterCustomizer } from './components/Character/HBCharacterCustomizer';
import { HBCharacterProfile } from './components/Character/HBCharacterProfile';
import { AICompanionOrb } from './components/AICharacter/AICompanionOrb';
import { HubPage } from './pages/HubPage';
import { WorldsPage } from './pages/WorldsPage';
import { PlayPage } from './pages/PlayPage';
import { RankPage } from './pages/RankPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './auth/AuthProvider';
import { LocalMigrationModal } from './components/Auth/LocalMigrationModal';
import { LocalProgressDetector } from './migration/LocalProgressDetector';
import { TouchControls } from './input/TouchControls';
import { TouchManager } from './input/TouchManager';
import { InstallPromptModal } from './pwa/InstallPromptModal';
import { OnlineStatus } from './network/OnlineStatus';
import { PerformanceMonitor } from './performance/PerformanceMonitor';
import { NativeBridge } from './native/nativeBridge';

function UniverseApp() {
  const { hasEntered, currentTab, currentWorldId } = useUniverseStore();
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const isTouch = TouchManager.isTouchDevice();

  useEffect(() => {
    NativeBridge.initNativeMobile();
    TouchManager.init();
    if (hasEntered && !LocalProgressDetector.isAlreadyMigrated()) {
      setShowMigrationModal(true);
    }
  }, [hasEntered]);

  if (!hasEntered) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-white">
        <UniverseBackground />
        <EntryScreen />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-yellow-400 selection:text-black flex flex-col justify-between overflow-x-hidden">
      {/* Animated Starfield & Parallax Background */}
      <UniverseBackground />

      {/* Online / Offline Toast Badge */}
      <OnlineStatus />

      {/* Top Navbar HUD */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        <AnimatePresence mode="wait">
          {currentWorldId ? (
            <WorldNavigator key={`world-${currentWorldId}`} />
          ) : (
            <>
              {currentTab === 'home' && <HubPage key="home" />}
              {currentTab === 'worlds' && <WorldsPage key="worlds" />}
              {currentTab === 'play' && <PlayPage key="play" />}
              {currentTab === 'rank' && <RankPage key="rank" />}
              {currentTab === 'profile' && <ProfilePage key="profile" />}
            </>
          )}
        </AnimatePresence>
      </main>

      {/* Virtual Touch Joystick & Action Controls in 3D Universe */}
      {isTouch && currentTab === 'home' && !currentWorldId && (
        <TouchControls />
      )}

      {/* Phase 5 World Travel Loading Overlay */}
      <TravelLoading />

      {/* Modals, Overlays and PWA prompts */}
      <WorldModal />
      <WorldMapModal />
      <SettingsModal />
      <InstallPromptModal />
      <PerformanceMonitor />
      {showMigrationModal && (
        <LocalMigrationModal
          onClose={() => {
            LocalProgressDetector.markMigrated();
            setShowMigrationModal(false);
          }}
          onImport={() => {
            LocalProgressDetector.markMigrated();
            setShowMigrationModal(false);
          }}
        />
      )}
      <HBCharacterCustomizer />
      <HBCharacterProfile />

      {/* Floating AI Companion Orb */}
      <AICompanionOrb />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavigation />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <UniverseApp />
    </AuthProvider>
  );
}

export default App;
