import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useUniverseStore } from '../../store/universeStore';

export const HBAvatar: React.FC = () => {
  const avatarGroup = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const texture = useTexture('/images/hb_pilot.png');
  const { character } = useUniverseStore();

  useFrame((state, delta) => {
    if (avatarGroup.current) {
      // Gentle floating animation
      avatarGroup.current.position.y = 2.0 + Math.sin(state.clock.elapsedTime * 2.0) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.2;
    }
  });

  return (
    <group ref={avatarGroup} position={[0, 2.0, 0]}>
      {/* Outer Hologram Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[1.55, 1.68, 48]} />
        <meshBasicMaterial
          color="#FFE500"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cyber Hex Badge Background */}
      <mesh position={[0, 0, -0.05]}>
        <circleGeometry args={[1.45, 32]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Uploaded HB Pilot Image Portrait */}
      <mesh>
        <circleGeometry args={[1.35, 48]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating 3D/HTML Info Badge */}
      <Html position={[0, 1.9, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center select-none whitespace-nowrap">
          <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-yellow-400 text-yellow-400 font-black text-xs tracking-wider shadow-[0_0_15px_rgba(255,229,0,0.6)] flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span>HB PILOT • LV {character.level}</span>
          </div>
          <div className="text-[10px] font-mono text-cyan-300 tracking-widest uppercase mt-0.5 drop-shadow">
            Universe Core Anchor
          </div>
        </div>
      </Html>
    </group>
  );
};
