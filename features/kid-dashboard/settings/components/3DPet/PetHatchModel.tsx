import { useFrame } from "@react-three/fiber/native";
import { useRef } from "react";
import { type Group } from "three";

import { PetAction, PetVariant } from "../../types";
import { getPetStage } from "../../utils";
import { EggShell } from "./EggShell";
import { PetBody } from "./PetBody";

export function PetHatchModel({
  action,
  level,
  variant,
}: {
  action: PetAction | null;
  level: number;
  variant: PetVariant;
}) {
  const groupRef = useRef<Group>(null);
  const stage = getPetStage(level);
  const isSleeping = action === "sleep";

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const bounceSpeed = isSleeping ? 0.9 : action ? 3.2 : 1.7;

    groupRef.current.rotation.y = Math.sin(time * 0.65) * 0.22;
    groupRef.current.position.y = Math.sin(time * bounceSpeed) * (isSleeping ? 0.025 : 0.06);
    groupRef.current.rotation.z = isSleeping ? 0.64 : Math.sin(time * 1.3) * 0.03;
  });

  if (stage === "egg" || stage === "hatching") {
    return (
      <group ref={groupRef}>
        <EggShell cracked={stage === "hatching"} variant={variant} />
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <PetBody action={action} stage={stage} variant={variant} />
    </group>
  );
}
