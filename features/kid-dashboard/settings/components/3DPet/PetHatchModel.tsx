import { useFrame } from "@react-three/fiber/native";
import { useRef } from "react";
import { type Group } from "three";

import { PetAction, PetVariant } from "../../types";
import { getPetStage } from "../../utils";
import { EggShell } from "./EggShell";
import { PetBody } from "./PetBody";

export function PetHatchModel({
  action,
  growthPulseKey = 0,
  level,
  reduceMotion,
  variant,
}: {
  action: PetAction | null;
  growthPulseKey?: number;
  level: number;
  reduceMotion?: boolean;
  variant: PetVariant;
}) {
  const groupRef = useRef<Group>(null);
  const lastGrowthPulseKey = useRef(growthPulseKey);
  const growthPulseStartedAt = useRef<number | null>(null);
  const stage = getPetStage(level);
  const isSleeping = action === "sleep";

  useFrame((state) => {
    if (!groupRef.current || reduceMotion) return;

    const time = state.clock.elapsedTime;
    const bounceSpeed = isSleeping ? 0.9 : action ? 3.2 : 1.7;

    if (growthPulseKey && growthPulseKey !== lastGrowthPulseKey.current) {
      lastGrowthPulseKey.current = growthPulseKey;
      growthPulseStartedAt.current = time;
    }

    const growthPulseProgress =
      growthPulseStartedAt.current === null
        ? 1
        : Math.min(1, (time - growthPulseStartedAt.current) / 1.2);
    const growthPulse = growthPulseProgress < 1 ? Math.sin(growthPulseProgress * Math.PI) : 0;

    groupRef.current.rotation.y = Math.sin(time * 0.65) * 0.22;
    groupRef.current.position.y =
      Math.sin(time * bounceSpeed) * (isSleeping ? 0.025 : 0.06) + growthPulse * 0.22;
    groupRef.current.rotation.z = isSleeping ? 0.64 : Math.sin(time * 1.3) * 0.03;
    groupRef.current.scale.setScalar(1 + growthPulse * 0.16);
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
