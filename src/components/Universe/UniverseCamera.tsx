import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore } from '../../store/universeStore';

export const UniverseCamera: React.FC = () => {
  const { camera } = useThree();
  const { cameraMode, focusedWorld, reducedMotion } = useUniverseStore();

  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 8, 22));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.5, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.5, 0));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return;
      mousePosition.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mousePosition.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  useFrame((state, delta) => {
    // 1. Calculate target positions based on cameraMode
    switch (cameraMode) {
      case 'MAP_VIEW':
        targetCamPos.current.set(0, 28, 6);
        targetLookAt.current.set(0, 0, 0);
        break;

      case 'PORTAL_ENTRY':
        if (focusedWorld) {
          const coords = getPortalCoordinates(focusedWorld.id);
          targetCamPos.current.set(coords.x * 0.9, coords.y + 0.5, coords.z * 0.9);
          targetLookAt.current.set(coords.x, coords.y, coords.z);
        }
        break;

      case 'WORLD_FOCUS':
        if (focusedWorld) {
          const coords = getPortalCoordinates(focusedWorld.id);
          // Position camera in front of portal
          targetCamPos.current.set(coords.x * 0.75, coords.y + 1.2, coords.z * 0.75 + 4);
          targetLookAt.current.set(coords.x, coords.y + 0.5, coords.z);
        }
        break;

      case 'DEFAULT':
      default: {
        // Idle cinematic floating + mouse parallax
        const parallaxX = reducedMotion ? 0 : mousePosition.current.x * 2.5;
        const parallaxY = reducedMotion ? 0 : -mousePosition.current.y * 1.5;
        const idleFloat = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;

        targetCamPos.current.set(parallaxX, 8 + parallaxY + idleFloat, 22);
        targetLookAt.current.set(0, 1.5, 0);
        break;
      }
    }

    // 2. Smoothly lerp camera position and lookAt target
    const lerpSpeed = delta * 3.5;
    camera.position.lerp(targetCamPos.current, lerpSpeed);
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

// Spatial 3D coordinates matching the Phase 2 circular arrangement
export function getPortalCoordinates(worldId: string): { x: number; y: number; z: number } {
  switch (worldId) {
    case 'mystery':
      return { x: 0, y: 1.5, z: -14 }; // Top / North
    case 'cinema':
      return { x: -11, y: 1.5, z: -7 }; // Top-Left / North-West
    case 'ai':
      return { x: 11, y: 1.5, z: -7 }; // Top-Right / North-East
    case 'arcade':
      return { x: -11, y: 1.5, z: 7 }; // Bottom-Left / South-West
    case 'music':
      return { x: 11, y: 1.5, z: 7 }; // Bottom-Right / South-East
    case 'challenge':
      return { x: 0, y: 1.5, z: 12 }; // Bottom / South
    default:
      return { x: 0, y: 1.5, z: 0 };
  }
}
