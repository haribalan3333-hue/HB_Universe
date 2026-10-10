import React from 'react';

export const UniverseLighting: React.FC = () => {
  return (
    <>
      {/* Soft ambient space illumination */}
      <ambientLight intensity={0.5} color="#4338ca" />

      {/* Cyber blue rim light */}
      <directionalLight
        position={[15, 25, 15]}
        intensity={1.2}
        color="#00F0FF"
      />

      {/* Warm gold key light for HB Platform */}
      <directionalLight
        position={[-15, 20, -10]}
        intensity={1.0}
        color="#FFE500"
      />

      {/* Center pedestal point light */}
      <pointLight
        position={[0, 3, 0]}
        intensity={2.5}
        distance={25}
        color="#FFE500"
      />

      {/* City skyline distant fill */}
      <pointLight
        position={[0, -5, -30]}
        intensity={1.8}
        distance={60}
        color="#6366f1"
      />
    </>
  );
};
