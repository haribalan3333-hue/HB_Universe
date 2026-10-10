import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';
import { WORLDS_DATA } from '../../data/worlds';
import { getPortalCoordinates } from '../Universe/UniverseCamera';
import { characterConfig } from '../../data/skins';
import { HBCharacterModel } from './HBCharacterModel';
import { HBCharacterEffects } from './HBCharacterEffects';
import { HBCharacterHUD } from './HBCharacterHUD';

export const HBCharacter: React.FC = () => {
  const characterGroup = useRef<THREE.Group>(null);
  const [gaitPhase, setGaitPhase] = useState(0);

  const {
    characterPosition,
    characterRotation,
    characterAnimation,
    setCharacterPosition,
    setCharacterRotation,
    setCharacterAnimation,
    joystickVector,
    isRunning,
    setIsRunning,
    setNearbyPortal,
    initiatePortalTravel,
    showSpeech,
    isTraveling,
  } = useUniverseStore();

  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;

      if (e.key === 'Shift') {
        setIsRunning(true);
      }

      // Interact with nearby portal on 'E'
      if (e.key.toLowerCase() === 'e') {
        const store = useUniverseStore.getState();
        if (store.nearbyPortal && !store.isTraveling) {
          if (!store.nearbyPortal.locked && store.unlockedWorlds.includes(store.nearbyPortal.id)) {
            initiatePortalTravel(store.nearbyPortal.id);
          } else {
            if (store.soundEnabled) audioManager.playLockedWorld();
            showSpeech('🔒 ACCESS RESTRICTED • REQ LV ' + store.nearbyPortal.requiredLevel, 2500);
          }
        }
      }

      // Quick celebrate jump on Space
      if (e.code === 'Space') {
        e.preventDefault();
        setCharacterAnimation('CELEBRATE');
        showSpeech('✨ HB PILOT READY! ✨', 2000);
        setTimeout(() => setCharacterAnimation('IDLE'), 2000);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
      if (e.key === 'Shift') {
        setIsRunning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setIsRunning, initiatePortalTravel, showSpeech, setCharacterAnimation]);

  useFrame((state, delta) => {
    if (isTraveling) return; // Lock movement during travel transition

    let moveX = 0;
    let moveZ = 0;

    if (keys.current['w'] || keys.current['arrowup']) moveZ -= 1;
    if (keys.current['s'] || keys.current['arrowdown']) moveZ += 1;
    if (keys.current['a'] || keys.current['arrowleft']) moveX -= 1;
    if (keys.current['d'] || keys.current['arrowright']) moveX += 1;

    if (joystickVector.x !== 0 || joystickVector.y !== 0) {
      moveX += joystickVector.x;
      moveZ += joystickVector.y;
    }

    const isMovingNow = moveX !== 0 || moveZ !== 0;
    const speed = isRunning ? characterConfig.runSpeed : characterConfig.walkSpeed;

    let [currX, currY, currZ] = characterPosition;

    if (isMovingNow) {
      const mag = Math.sqrt(moveX * moveX + moveZ * moveZ);
      const dirX = (moveX / mag) * speed * delta;
      const dirZ = (moveZ / mag) * speed * delta;

      let nextX = currX + dirX;
      let nextZ = currZ + dirZ;

      const distFromCenter = Math.sqrt(nextX * nextX + nextZ * nextZ);
      if (distFromCenter > characterConfig.hubRadiusLimit) {
        const factor = characterConfig.hubRadiusLimit / distFromCenter;
        nextX *= factor;
        nextZ *= factor;
      }

      currX = nextX;
      currZ = nextZ;

      const targetAngle = Math.atan2(moveX, moveZ);
      const angleDiff = targetAngle - characterRotation;
      const smoothedAngle = characterRotation + Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff)) * delta * 12;

      setCharacterPosition([currX, currY, currZ]);
      setCharacterRotation(smoothedAngle);
      setCharacterAnimation(isRunning ? 'RUN' : 'WALK');

      setGaitPhase((prev) => prev + delta * (isRunning ? 18 : 10));
    } else {
      if (characterAnimation === 'WALK' || characterAnimation === 'RUN') {
        setCharacterAnimation('IDLE');
      }
      setGaitPhase(0);
    }

    // Proximity Check for Portal Interactions
    let foundNearby: typeof WORLDS_DATA[0] | null = null;
    for (const w of WORLDS_DATA) {
      const pCoords = getPortalCoordinates(w.id);
      const dx = currX - pCoords.x;
      const dz = currZ - pCoords.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= characterConfig.interactionDistance) {
        foundNearby = w;
        break;
      }
    }
    setNearbyPortal(foundNearby);

    // Update 3D Mesh Transform
    if (characterGroup.current) {
      let jumpOffset = 0;
      if (characterAnimation === 'CELEBRATE') {
        jumpOffset = Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 0.8;
      } else if (characterAnimation === 'IDLE') {
        jumpOffset = Math.sin(state.clock.elapsedTime * 2.5) * 0.03;
      }

      characterGroup.current.position.set(currX, currY + jumpOffset, currZ);
      characterGroup.current.rotation.y = characterRotation;
    }
  });

  return (
    <group ref={characterGroup} position={characterPosition}>
      <HBCharacterModel gait={gaitPhase} />
      <HBCharacterEffects />
      <HBCharacterHUD />
    </group>
  );
};
