import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const UniverseSky: React.FC = () => {
  const planetRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.03;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Giant Distant Ringed Celestial Body */}
      <group ref={planetRef} position={[-25, 18, -45]}>
        {/* Planet Sphere */}
        <mesh>
          <sphereGeometry args={[7, 32, 32]} />
          <meshStandardMaterial
            color="#1e1b4b"
            emissive="#312e81"
            emissiveIntensity={0.6}
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>

        {/* Planet Glow Atmosphere */}
        <mesh scale={1.08}>
          <sphereGeometry args={[7, 32, 32]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={0.12}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Planetary Rings */}
        <mesh ref={ringRef} rotation={[-Math.PI / 3, 0.2, 0]}>
          <ringGeometry args={[9, 14, 64]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Secondary Distant Moon */}
      <group position={[35, 22, -50]}>
        <mesh>
          <sphereGeometry args={[3.5, 24, 24]} />
          <meshStandardMaterial
            color="#064e3b"
            emissive="#059669"
            emissiveIntensity={0.5}
            roughness={0.8}
          />
        </mesh>
      </group>
    </group>
  );
};
