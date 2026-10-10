import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore } from '../../store/universeStore';
import { CHARACTER_AURAS } from '../../data/skins';

export const HBCharacterEffects: React.FC = () => {
  const auraPointsRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { character, isMoving, isRunning, effectsEnabled, reducedMotion } = useUniverseStore();

  const selectedAuraData = CHARACTER_AURAS.find((a) => a.id === character.selectedAura) || CHARACTER_AURAS[0];

  useFrame((state, delta) => {
    if (!effectsEnabled || reducedMotion) return;

    if (auraPointsRef.current) {
      auraPointsRef.current.rotation.y += delta * selectedAuraData.pulseSpeed * (isMoving ? 1.8 : 0.8);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.5;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.08;
      ringRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  if (!effectsEnabled || selectedAuraData.id === 'none') return null;

  return (
    <group position={[0, 0.9, 0]}>
      {/* Ground Energy Halo */}
      <mesh ref={ringRef} position={[0, -0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.1, 32]} />
        <meshBasicMaterial
          color={selectedAuraData.color}
          transparent
          opacity={isMoving ? 0.8 : 0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbiting Aura Spark Particles */}
      <points ref={auraPointsRef}>
        <sphereGeometry args={[1.3, 16, 16]} />
        <pointsMaterial
          size={isRunning ? 0.12 : 0.08}
          color={selectedAuraData.color}
          transparent
          opacity={0.8}
        />
      </points>
    </group>
  );
};
