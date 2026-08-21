import { useMemo } from "react";
import * as THREE from "three";

import { Palette } from "@/constants/theme";

import { PetAction, PetStage, PetVariant } from "../../types";
import { getStageRadius } from "../../utils";
import { Eye } from "./Eye";

export function PetBody({
  action,
  stage,
  variant,
}: {
  action: PetAction | null;
  stage: PetStage;
  variant: PetVariant;
}) {
  const radius = getStageRadius(stage);
  const hasWings = stage === "child" || stage === "teen" || stage === "adult";
  const hasHorns = stage === "teen" || stage === "adult";

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();

    shape.moveTo(0, 0.25);
    shape.bezierCurveTo(0, 0.5, -0.5, 0.5, -0.5, 0);
    shape.bezierCurveTo(-0.5, -0.4, 0, -0.7, 0, -1);
    shape.bezierCurveTo(0, -0.7, 0.5, -0.4, 0.5, 0);
    shape.bezierCurveTo(0.5, 0.5, 0, 0.5, 0, 0.25);

    return shape;
  }, []);

  const appleShape = useMemo(() => {
    const shape = new THREE.Shape();

    shape.moveTo(0, -0.5);

    shape.bezierCurveTo(-0.55, -0.4, -0.65, 0.15, -0.3, 0.45);
    shape.bezierCurveTo(-0.1, 0.65, -0.05, 0.35, 0, 0.25);

    shape.bezierCurveTo(0.05, 0.35, 0.1, 0.65, 0.3, 0.45);
    shape.bezierCurveTo(0.65, 0.15, 0.55, -0.4, 0, -0.5);

    return shape;
  }, []);

  const wingShape = useMemo(() => {
    const shape = new THREE.Shape();

    shape.moveTo(0, 0);

    shape.bezierCurveTo(-0.15, 0.25, -0.2, 0.65, 0.05, 0.95);

    shape.bezierCurveTo(0.28, 0.72, 0.38, 0.35, 0.18, 0.05);

    shape.bezierCurveTo(0.12, -0.02, 0.06, -0.02, 0, 0);

    return shape;
  }, []);

  return (
    <group position={[0, -0.78, 0]}>
      <mesh position={[0, radius, 0]} scale={[1, 1.08, 0.95]}>
        <sphereGeometry args={[radius, 44, 44]} />
        <meshStandardMaterial color={variant.color} roughness={0.46} metalness={0.08} />
      </mesh>

      <mesh position={[0, radius * 0.86, radius * 0.72]} scale={[1, 1.08, 0.32]}>
        <sphereGeometry args={[radius * 0.66, 32, 32]} />
        <meshStandardMaterial color={variant.secondaryColor} roughness={0.55} />
      </mesh>

      <Eye x={-radius * 0.38} radius={radius} variant={variant} />
      <Eye x={radius * 0.38} radius={radius} variant={variant} />

      <mesh position={[0, radius * 0.96, radius * 0.95]}>
        <sphereGeometry args={[radius * 0.08, 16, 16]} />
        <meshStandardMaterial color={Palette.darkNavy} roughness={0.3} />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * radius * 0.55, radius * 0.9, radius * 0.78]}
          scale={[1.25, 0.75, 0.25]}
        >
          <sphereGeometry args={[radius * 0.13, 16, 16]} />
          <meshBasicMaterial color={Palette.logoDotRed} />
        </mesh>
      ))}

      {[-1, 1].map((side) => (
        <mesh
          key={`ear-${side}`}
          position={[side * radius * 0.62, radius * 1.72, -0.03]}
          rotation={[-0.18, 0, side * -0.35]}
        >
          <coneGeometry args={[radius * 0.28, radius * 0.7, 18]} />
          <meshStandardMaterial color={variant.color} roughness={0.5} />
        </mesh>
      ))}

      {hasHorns &&
        [-1, 1].map((side) => (
          <mesh
            key={`horn-${side}`}
            position={[side * radius * 0.28, radius * 1.86, 0.08]}
            rotation={[0, 0, side * -0.18]}
          >
            <coneGeometry args={[radius * 0.12, radius * 0.5, 16]} />
            <meshStandardMaterial color={Palette.yellow} metalness={0.45} roughness={0.25} />
          </mesh>
        ))}

      {[-1, 1].map((side) => (
        <mesh
          key={`foot-${side}`}
          position={[side * radius * 0.42, 0.08, radius * 0.38]}
          scale={[1.2, 0.58, 1.35]}
        >
          <sphereGeometry args={[radius * 0.22, 18, 18]} />
          <meshStandardMaterial color={variant.color} roughness={0.52} />
        </mesh>
      ))}

      {[-1, 1].map((side) => (
        <mesh
          key={`arm-${side}`}
          position={[side * radius * 0.88, radius * 0.66, radius * 0.18]}
          rotation={[0, 0, side * 0.42]}
          scale={[1, 1.45, 1]}
        >
          <sphereGeometry args={[radius * 0.19, 18, 18]} />
          <meshStandardMaterial color={variant.color} roughness={0.52} />
        </mesh>
      ))}

      {hasWings &&
        [-1, 1].map((side) => (
          <mesh
            key={`wing-${side}`}
            position={[side * radius * 0.82, radius * 1.05, radius * 0.08]}
            rotation={[0, 0, side * -0.7]}
            scale={[side * radius * 0.9, radius * (stage === "adult" ? 1.3 : 0.95), 1]}
          >
            <shapeGeometry args={[wingShape]} />

            <meshStandardMaterial
              color={variant.secondaryColor}
              roughness={0.35}
              metalness={0.12}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

      <group position={[0, radius * 0.42, -radius * 0.8]} rotation={[-0.8, 0, 0]}>
        <mesh position={[0, -0.26, 0]}>
          <cylinderGeometry args={[radius * 0.08, radius * 0.18, radius * 0.62, 16]} />
          <meshStandardMaterial color={variant.color} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.66, -0.18]}>
          <sphereGeometry args={[radius * 0.2, 16, 16]} />
          <meshStandardMaterial color={variant.secondaryColor} roughness={0.5} />
        </mesh>
      </group>

      {action === "love" && (
        <group position={[0, 0, radius * 2.2]}>
          {[-0.42, 0, 0.42].map((x, index) => (
            <mesh
              scale={[0.22, 0.22, 0.22]}
              key={x}
              position={[x, radius * (1.4 + index * 0.08), 0.25]}
            >
              <shapeGeometry args={[heartShape]} />
              <meshBasicMaterial color={Palette.error} />
            </mesh>
          ))}
        </group>
      )}

      {action === "feed" && (
        <mesh position={[0.96, radius * 1.6, 1.8]} scale={[0.42, 0.42, 0.42]}>
          <shapeGeometry args={[appleShape]} />
          <meshStandardMaterial
            color={Palette.error}
            emissive={Palette.error}
            emissiveIntensity={0.2}
          />
        </mesh>
      )}

      {action === "clean" &&
        [-0.6, -0.25, 0.22, 0.58].map((x, index) => (
          <mesh key={x} position={[x, radius * (1.4 + index * 0.08), 0.88]}>
            <sphereGeometry args={[0.08 + index * 0.012, 14, 14]} />
            <meshStandardMaterial color={Palette.skyBlue} transparent opacity={0.72} />
          </mesh>
        ))}

      {action === "play" && (
        <mesh position={[-0.9, 0.36, 0.8]}>
          <sphereGeometry args={[0.22, 22, 22]} />
          <meshStandardMaterial
            color={Palette.yellow}
            emissive={Palette.yellow}
            emissiveIntensity={0.18}
          />
        </mesh>
      )}
    </group>
  );
}
