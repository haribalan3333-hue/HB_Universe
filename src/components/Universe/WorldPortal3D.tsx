import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WorldData } from '../../types';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';
import { WorldPortalLabel } from './WorldPortalLabel';

interface WorldPortal3DProps {
  world: WorldData;
  position: [number, number, number];
}

export const WorldPortal3D: React.FC<WorldPortal3DProps> = ({ world, position }) => {
  const portalGroup = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ornamentsRef = useRef<THREE.Group>(null);

  const {
    hoveredWorld,
    setHoveredWorld,
    selectedWorld,
    setSelectedWorld,
    setFocusedWorld,
    unlockedWorlds,
    setCameraMode,
    openWorldModal,
    soundEnabled,
  } = useUniverseStore();

  const isUnlocked = unlockedWorlds.includes(world.id);
  const isHovered = hoveredWorld?.id === world.id;
  const isSelected = selectedWorld?.id === world.id;

  useFrame((state, delta) => {
    const speed = isHovered ? 2.5 : 1.0;
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.8 * speed;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 1.2 * speed;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5 * speed;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
    if (ornamentsRef.current) {
      ornamentsRef.current.rotation.y += delta * 0.6 * speed;
    }
  });

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHoveredWorld(world);
    if (soundEnabled) audioManager.playHover();
  };

  const handlePointerOut = () => {
    setHoveredWorld(null);
  };

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setSelectedWorld(world);
    setFocusedWorld(world);
    setCameraMode('WORLD_FOCUS');

    if (!isUnlocked) {
      if (soundEnabled) audioManager.playLockedWorld();
      openWorldModal(world);
      return;
    }

    if (soundEnabled) audioManager.playPortalOpen();
    openWorldModal(world);
  };

  const renderWorldOrnaments = () => {
    switch (world.id) {
      case 'arcade':
        return (
          <group ref={ornamentsRef}>
            {/* Orbiting Retro Game Cubes */}
            {[0, 90, 180, 270].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const r = 2.4;
              return (
                <mesh
                  key={i}
                  position={[Math.cos(rad) * r, Math.sin(rad) * r, 0]}
                  rotation={[deg, deg, 0]}
                >
                  <boxGeometry args={[0.35, 0.35, 0.35]} />
                  <meshBasicMaterial color="#00F0FF" />
                </mesh>
              );
            })}
          </group>
        );

      case 'cinema':
        return (
          <group ref={ornamentsRef}>
            {/* Theatrical Spotlight Cone */}
            <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.2, 1.8, 2.5, 16, 1, true]} />
              <meshBasicMaterial color="#FF2A55" transparent opacity={0.18} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );

      case 'music':
        return (
          <group ref={ornamentsRef}>
            {/* Waveform Harmonic Rings */}
            {[1.6, 2.1, 2.6].map((rad, i) => (
              <mesh key={i} rotation={[0, 0, i * 0.4]}>
                <ringGeometry args={[rad, rad + 0.05, 32]} />
                <meshBasicMaterial color="#A855F7" transparent opacity={0.45} side={THREE.DoubleSide} />
              </mesh>
            ))}
          </group>
        );

      case 'ai':
        return (
          <group ref={ornamentsRef}>
            {/* Neural Matrix Synapses */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const r = 2.3;
              return (
                <mesh key={i} position={[Math.cos(rad) * r, Math.sin(rad) * r, 0]}>
                  <sphereGeometry args={[0.15, 12, 12]} />
                  <meshBasicMaterial color="#FFE500" />
                </mesh>
              );
            })}
          </group>
        );

      case 'challenge':
        return (
          <group ref={ornamentsRef}>
            {/* Arena Champion Spires */}
            {[-1.8, 1.8].map((x, i) => (
              <mesh key={i} position={[x, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.2, 3.2, 8]} />
                <meshBasicMaterial color="#10B981" />
              </mesh>
            ))}
          </group>
        );

      case 'mystery':
        return (
          <group ref={ornamentsRef}>
            {/* Ominous Dark Fog Core */}
            <mesh scale={1.2}>
              <sphereGeometry args={[1.5, 16, 16]} />
              <meshBasicMaterial color="#1e1b4b" transparent opacity={0.6} wireframe />
            </mesh>
          </group>
        );

      default:
        return null;
    }
  };

  return (
    <group
      ref={portalGroup}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Floating 3D/HTML Info Label */}
      <WorldPortalLabel
        world={world}
        isUnlocked={isUnlocked}
        isHovered={isHovered}
        isSelected={isSelected}
      />

      {/* Portal Base Pedestal */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[1.8, 2.2, 0.4, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Outer Energy Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2.0, 0.12, 16, 64]} />
        <meshStandardMaterial
          color={isUnlocked ? world.themeColor : '#334155'}
          emissive={isUnlocked ? world.themeColor : '#1e293b'}
          emissiveIntensity={isHovered ? 1.8 : 0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Inner Rotating Glyphs Ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.7, 0.06, 12, 32]} />
        <meshBasicMaterial
          color={isUnlocked ? '#ffffff' : '#475569'}
          transparent
          opacity={isHovered ? 0.9 : 0.6}
        />
      </mesh>

      {/* Central Swirling Dimensional Energy Core */}
      <mesh ref={coreRef}>
        <circleGeometry args={[1.65, 32]} />
        <meshBasicMaterial
          color={isUnlocked ? world.themeColor : '#0f172a'}
          transparent
          opacity={isUnlocked ? (isHovered ? 0.85 : 0.65) : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* World-Specific 3D Thematic Ornaments */}
      {renderWorldOrnaments()}

      {/* Point Light emitted from portal */}
      <pointLight
        color={isUnlocked ? world.themeColor : '#334155'}
        intensity={isHovered ? 3.0 : 1.2}
        distance={8}
      />
    </group>
  );
};
