import React, { useMemo } from 'react';

interface BuildingData {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
  hasSpire: boolean;
}

export const UniverseCity: React.FC = () => {
  const buildings = useMemo<BuildingData[]>(() => {
    const list: BuildingData[] = [];
    const colors = ['#0f172a', '#1e1b4b', '#172554', '#042f2e', '#18181b'];
    const totalBuildings = 36;

    for (let i = 0; i < totalBuildings; i++) {
      const angle = (i / totalBuildings) * Math.PI * 2 + (Math.random() * 0.1);
      const radius = 24 + Math.random() * 12;

      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const width = 2.0 + Math.random() * 2.2;
      const depth = 2.0 + Math.random() * 2.2;
      const height = 6 + Math.random() * 16;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const hasSpire = Math.random() > 0.4;

      list.push({ x, z, width, depth, height, color, hasSpire });
    }
    return list;
  }, []);

  return (
    <group position={[0, -0.5, 0]}>
      {buildings.map((b, idx) => (
        <group key={idx} position={[b.x, b.height / 2, b.z]}>
          {/* Main Building Body */}
          <mesh>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial
              color={b.color}
              roughness={0.6}
              metalness={0.7}
            />
          </mesh>

          {/* Glowing Windows Band */}
          <mesh position={[0, b.height * 0.15, 0]}>
            <boxGeometry args={[b.width * 1.02, 0.4, b.depth * 1.02]} />
            <meshBasicMaterial
              color={idx % 2 === 0 ? '#00F0FF' : '#FFE500'}
              transparent
              opacity={0.8}
            />
          </mesh>

          <mesh position={[0, b.height * 0.35, 0]}>
            <boxGeometry args={[b.width * 1.02, 0.4, b.depth * 1.02]} />
            <meshBasicMaterial
              color="#A855F7"
              transparent
              opacity={0.7}
            />
          </mesh>

          {/* Roof Spire Beacon */}
          {b.hasSpire && (
            <group position={[0, b.height / 2 + 1.5, 0]}>
              <mesh>
                <cylinderGeometry args={[0.05, 0.2, 3, 8]} />
                <meshBasicMaterial color="#00F0FF" />
              </mesh>
              <mesh position={[0, 1.5, 0]}>
                <sphereGeometry args={[0.2, 12, 12]} />
                <meshBasicMaterial color="#FFE500" />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
};
