import { CareStats, PetStage } from "./types";

export const getStageRadius = (stage: PetStage) => {
  switch (stage) {
    case "adult":
      return 1.2;
    case "teen":
      return 1.08;
    case "child":
      return 0.96;
    case "baby":
      return 0.82;
    default:
      return 0.9;
  }
};

export const getPetStage = (level: number): PetStage => {
  if (level >= 9) return "adult";
  if (level >= 6) return "teen";
  if (level >= 4) return "child";
  if (level >= 3) return "baby";
  if (level >= 2) return "hatching";

  return "egg";
};

export const getInitialCareStats = (level: number): CareStats => ({
  hunger: Math.min(100, 58 + level * 3),
  happiness: Math.min(100, 62 + level * 3),
  energy: Math.min(100, 60 + level * 2),
  cleanliness: Math.min(100, 55 + level * 3),
});
