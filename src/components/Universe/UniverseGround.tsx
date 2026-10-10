import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const UniverseGround: React.FC = () => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outerRingRef.current) outerRingRef.current.rotation.z += delta * 0.04;
    if (midRingRef.current) midRingRef.current.rotation.z -= delta * 0.06;
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Main Ground Hub Disk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[22, 64]} />
        <meshStandardMaterial
          color="#090910"
          roughness={0.8}
          metalness={0.4}
        />
      </mesh>

      {/* Cybernetic Grid Overlay */}
      <gridHelper
        args={[44, 44, '#00F0FF', '#1e1b4b']}
        position={[0, 0.02, 0]}
      />

      {/* Outer Rotating Energy Ring */}
      <mesh
        ref={outerRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
      >
        <ringGeometry args={[18, 18.3, 64]} />
        <meshBasicMaterial
          color="#FFE500"
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Mid Rotating Energy Ring */}
      <mesh
        ref={midRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.06, 0]}
      >
        <ringGeometry args={[12, 12.2, 48]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Conduit Line from Center to Portals (6 directions) */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const len = 14;
        const x = Math.sin(rad) * (len / 2);
        const z = Math.cos(rad) * (len / 2);
        return (
          <mesh
            key={deg}
            position={[x, 0.04, z]}
            rotation={[-Math.PI / 2, 0, -rad]}
          >
            <planeGeometry args={[0.2, len]} />
            <meshBasicMaterial
              color="#00F0FF"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
};
