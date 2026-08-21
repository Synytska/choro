import "@/lib/threeNativeWarnings";

import { PetVariant } from "../../types";

export function EggShell({ cracked = false, variant }: { cracked?: boolean; variant: PetVariant }) {
  const spots = [
    [-0.35, 0.15, 0.82],
    [0.44, -0.14, 0.78],
    [0.38, 0.82, 0.78],
  ];

  return (
    <group>
      <mesh position={[0, -0.86, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.28, 18, 40]} />
        <meshStandardMaterial color="#5a3a24" roughness={0.9} />
      </mesh>

      <mesh scale={[0.86, 1.18, 0.86]} position={[0, 0.12, 0]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.32} metalness={0.06} />
      </mesh>

      <mesh scale={[0.89, 1.2, 0.89]} position={[0, 0.12, 0]}>
        <sphereGeometry args={[1.01, 48, 48]} />
        <meshStandardMaterial color={variant.secondaryColor} transparent opacity={0.16} />
      </mesh>

      {cracked &&
        spots.map(([x, y, z], index) => (
          <mesh key={`${x}-${y}-${z}`} position={[x, y, z]} scale={[1, 1, 0.24]}>
            <sphereGeometry args={[index === 2 ? 0.16 : 0.2, 18, 18]} />
            <meshStandardMaterial color={variant.color} roughness={0.45} />
          </mesh>
        ))}

      {cracked && (
        <group position={[0, 0.6, 0.9]}>
          <mesh position={[0, 0.18, 0]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.035, 0.32, 0.03]} />
            <meshBasicMaterial color={variant.accentColor} />
          </mesh>

          <mesh position={[0.02, -0.25, 0]} rotation={[0, 0, -0.55]}>
            <boxGeometry args={[0.035, 0.42, 0.03]} />
            <meshBasicMaterial color={variant.accentColor} />
          </mesh>

          <mesh position={[-0.06, -0.75, 0]} rotation={[0, 0, 0.35]}>
            <boxGeometry args={[0.035, 0.42, 0.03]} />
            <meshBasicMaterial color={variant.accentColor} />
          </mesh>
        </group>
      )}
    </group>
  );
}
