import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { UniverseLighting } from './UniverseLighting';
import { UniverseCamera, getPortalCoordinates } from './UniverseCamera';
import { UniverseSky } from './UniverseSky';
import { UniverseStars } from './UniverseStars';
import { UniverseGround } from './UniverseGround';
import { UniverseCity } from './UniverseCity';
import { HBPlatform } from './HBPlatform';
import { HBCharacter } from '../Character/HBCharacter';
import { WorldPortal3D } from './WorldPortal3D';
import { WORLDS_DATA } from '../../data/worlds';
import { useUniverseStore } from '../../store/universeStore';

export const UniverseScene: React.FC = () => {
  const { qualityMode } = useUniverseStore();

  const getParticleCount = () => {
    switch (qualityMode) {
      case 'HIGH':
        return 900;
      case 'LOW':
        return 300;
      case 'MEDIUM':
      case 'AUTO':
      default:
        return 600;
    }
  };

  return (
    <div className="relative w-full h-[680px] md:h-[760px] rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl bg-black select-none">
      <Canvas
        camera={{ position: [0, 8, 22], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <UniverseLighting />
          <UniverseCamera />
          <UniverseSky />
          <UniverseStars count={getParticleCount()} />
          <UniverseCity />
          <UniverseGround />
          <HBPlatform />

          {/* Playable 3D HB Character */}
          <HBCharacter />

          {/* 3D World Portals in Circular Arrangement */}
          {WORLDS_DATA.map((world) => {
            const coords = getPortalCoordinates(world.id);
            return (
              <WorldPortal3D
                key={world.id}
                world={world}
                position={[coords.x, coords.y, coords.z]}
              />
            );
          })}
        </Suspense>
      </Canvas>
    </div>
  );
};
