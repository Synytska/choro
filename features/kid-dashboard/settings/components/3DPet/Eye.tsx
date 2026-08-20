import { Palette } from "@/constants/theme";

import { PetVariant } from "../../types";

export function Eye({ x, radius, variant }: { x: number; radius: number; variant: PetVariant }) {
  return (
    <group position={[x, radius * 1.1, radius * 0.78]}>
      <mesh>
        <sphereGeometry args={[radius * 0.17, 24, 24]} />
        <meshStandardMaterial color={Palette.blue} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0, radius * 0.07]} scale={[1, 1, 0.45]}>
        <sphereGeometry args={[radius * 0.1, 18, 18]} />
        <meshStandardMaterial
          color={variant.eyeColor}
          emissive={variant.eyeColor}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[-radius * 0.04, radius * 0.05, radius * 0.14]}>
        <sphereGeometry args={[radius * 0.035, 12, 12]} />
        <meshBasicMaterial color={Palette.white} />
      </mesh>
    </group>
  );
}
