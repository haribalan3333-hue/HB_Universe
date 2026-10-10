import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HBAvatar } from './HBAvatar';

export const HBPlatform: React.FC = () => {
  const outerRing = useRef<THREE.Mesh>(null);
  const hexRing = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outerRing.current) outerRing.current.rotation.z += delta * 0.4;
    if (hexRing.current) hexRing.current.rotation.z -= delta * 0.6;
    if (beamRef.current) {
      beamRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Hologram Avatar of HB Pilot */}
      <HBAvatar />

      {/* Pedestal Base Cylinders */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[2.4, 2.8, 0.6, 32]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Gold Ring Edge */}
      <mesh position={[0, 0.61, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 2.35, 32]} />
        <meshBasicMaterial
          color="#FFE500"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cyan Inner Ring */}
      <mesh ref={outerRing} position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.8, 24]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Hex Ring */}
      <mesh ref={hexRing} position={[0, 0.63, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.1, 6]} />
        <meshBasicMaterial
          color="#A855F7"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ascending Hologram Energy Beam */}
      <mesh ref={beamRef} position={[0, 2.5, 0]}>
        <cylinderGeometry args={[1.2, 1.8, 4.5, 24, 1, true]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
