import React, { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useUniverseStore } from '../../store/universeStore';
import { CHARACTER_SKINS } from '../../data/skins';

interface HBCharacterModelProps {
  gait: number; // Gait oscillation value from movement animation
}

export const HBCharacterModel: React.FC<HBCharacterModelProps> = ({ gait }) => {
  const texture = useTexture('/images/hb_pilot.png');
  const { character } = useUniverseStore();

  const skin = CHARACTER_SKINS.find((s) => s.id === character.selectedSkin) || CHARACTER_SKINS[0];

  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  // Apply gait swing to limbs
  const armSwing = Math.sin(gait) * 0.45;
  const legSwing = Math.sin(gait) * 0.55;

  return (
    <group position={[0, 0.9, 0]}>
      {/* HEAD: Cylindrical Holographic Visor projecting user portrait */}
      <group position={[0, 0.82, 0]}>
        {/* Head Base Mesh */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>

        {/* Uploaded HB Pilot Face Texture Emblem on Front */}
        <mesh position={[0, 0, 0.28]}>
          <circleGeometry args={[0.26, 32]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.98}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Glowing Head Visor Band */}
        <mesh position={[0, 0.05, 0.15]}>
          <boxGeometry args={[0.42, 0.12, 0.32]} />
          <meshBasicMaterial
            color={skin.themeColor}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* TORSO: Cybernetic Exosuit Chest & Core */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.56, 0.65, 0.32]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Chest Glowing Power Reactor Badge */}
      <mesh position={[0, 0.35, 0.17]}>
        <circleGeometry args={[0.12, 16]} />
        <meshBasicMaterial
          color={skin.themeColor}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Shoulder Armor Plates */}
      <mesh position={[-0.34, 0.52, 0]}>
        <boxGeometry args={[0.18, 0.14, 0.24]} />
        <meshStandardMaterial color={skin.accentColor} metalness={0.8} />
      </mesh>
      <mesh position={[0.34, 0.52, 0]}>
        <boxGeometry args={[0.18, 0.14, 0.24]} />
        <meshStandardMaterial color={skin.accentColor} metalness={0.8} />
      </mesh>

      {/* LEFT ARM */}
      <group ref={leftArmRef} position={[-0.35, 0.45, 0]} rotation={[armSwing, 0, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.07, 0.42, 8, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
      </group>

      {/* RIGHT ARM */}
      <group ref={rightArmRef} position={[0.35, 0.45, 0]} rotation={[-armSwing, 0, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.07, 0.42, 8, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
      </group>

      {/* WAIST & BELT */}
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[0.5, 0.12, 0.28]} />
        <meshStandardMaterial color={skin.themeColor} metalness={0.9} />
      </mesh>

      {/* LEFT LEG */}
      <group ref={leftLegRef} position={[-0.18, -0.15, 0]} rotation={[-legSwing, 0, 0]}>
        <mesh position={[0, -0.36, 0]}>
          <capsuleGeometry args={[0.09, 0.55, 8, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Foot Cyber Boot */}
        <mesh position={[0, -0.68, 0.06]}>
          <boxGeometry args={[0.14, 0.12, 0.24]} />
          <meshStandardMaterial color={skin.accentColor} metalness={0.9} />
        </mesh>
      </group>

      {/* RIGHT LEG */}
      <group ref={rightLegRef} position={[0.18, -0.15, 0]} rotation={[legSwing, 0, 0]}>
        <mesh position={[0, -0.36, 0]}>
          <capsuleGeometry args={[0.09, 0.55, 8, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Foot Cyber Boot */}
        <mesh position={[0, -0.68, 0.06]}>
          <boxGeometry args={[0.14, 0.12, 0.24]} />
          <meshStandardMaterial color={skin.accentColor} metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
};
