import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Vector2D } from './inputTypes';

interface VirtualJoystickProps {
  onMove: (vec: Vector2D) => void;
  onEnd: () => void;
  size?: number;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onMove,
  onEnd,
  size = 120
}) => {
  const [active, setActive] = useState(false);
  const [knobPos, setKnobPos] = useState<Vector2D>({ x: 0, y: 0 });
  const baseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  const radius = size / 2;
  const maxRadius = radius * 0.75;

  const handleTouch = useCallback((clientX: number, clientY: number) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;

    const distance = Math.hypot(deltaX, deltaY);
    if (distance > maxRadius) {
      const angle = Math.atan2(deltaY, deltaX);
      deltaX = Math.cos(angle) * maxRadius;
      deltaY = Math.sin(angle) * maxRadius;
    }

    setKnobPos({ x: deltaX, y: deltaY });

    // Normalized vector (-1 to 1)
    const normX = deltaX / maxRadius;
    const normY = deltaY / maxRadius;

    // Dead zone check (0.1)
    if (Math.hypot(normX, normY) < 0.1) {
      onMove({ x: 0, y: 0 });
    } else {
      onMove({ x: normX, y: normY });
    }
  }, [maxRadius, onMove]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setActive(true);
    handleTouch(touch.clientX, touch.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        handleTouch(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setActive(false);
        setKnobPos({ x: 0, y: 0 });
        onEnd();
        break;
      }
    }
  };

  useEffect(() => {
    const handleGlobalEnd = () => {
      if (touchIdRef.current !== null) {
        touchIdRef.current = null;
        setActive(false);
        setKnobPos({ x: 0, y: 0 });
        onEnd();
      }
    };
    window.addEventListener('touchend', handleGlobalEnd);
    window.addEventListener('touchcancel', handleGlobalEnd);
    return () => {
      window.removeEventListener('touchend', handleGlobalEnd);
      window.removeEventListener('touchcancel', handleGlobalEnd);
    };
  }, [onEnd]);

  return (
    <div
      ref={baseRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: `2px solid ${active ? 'rgba(0, 240, 255, 0.7)' : 'rgba(255, 229, 0, 0.4)'}`,
        boxShadow: active ? '0 0 25px rgba(0, 240, 255, 0.4)' : '0 0 15px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none',
        userSelect: 'none'
      }}
    >
      {/* Direction Crosshairs */}
      <div style={{ position: 'absolute', width: '2px', height: '60%', background: 'rgba(255,255,255,0.1)' }} />
      <div style={{ position: 'absolute', height: '2px', width: '60%', background: 'rgba(255,255,255,0.1)' }} />

      {/* Center Joystick Knob */}
      <div
        style={{
          width: `${size * 0.42}px`,
          height: `${size * 0.42}px`,
          borderRadius: '50%',
          background: active
            ? 'linear-gradient(135deg, #00f0ff, #0077ff)'
            : 'linear-gradient(135deg, #ffe500, #ff8800)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          transition: active ? 'none' : 'transform 0.15s ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid rgba(255, 255, 255, 0.8)'
        }}
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
      </div>
    </div>
  );
};
