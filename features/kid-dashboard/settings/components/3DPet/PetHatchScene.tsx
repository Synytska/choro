import { Canvas } from "@react-three/fiber/native";
import { Suspense } from "react";

import { Palette } from "@/constants/theme";

import { PetAction, PetVariant } from "../../types";
import { PetHatchModel } from "./PetHatchModel";

export function PetHatchScene({
  action,
  level,
  variant,
}: {
  action: PetAction | null;
  level: number;
  variant: PetVariant;
}) {
  return (
    <Canvas camera={{ position: [0, 1.1, 5.2], fov: 42 }}>
      <color attach="background" args={[Palette.darkBlue]} />
      <ambientLight intensity={0.72} />
      <pointLight position={[2.4, 4, 4]} intensity={58} color={Palette.white} />
      <pointLight position={[-3, 0.2, 2]} intensity={28} color={variant.accentColor} />
      <mesh position={[0, -1.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.35, 54]} />
        <meshStandardMaterial color={Palette.darkBlue} roughness={0.8} />
      </mesh>
      <Suspense fallback={null}>
        <PetHatchModel action={action} level={level} variant={variant} />
      </Suspense>
    </Canvas>
  );
}
