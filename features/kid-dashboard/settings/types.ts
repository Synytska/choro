export type PetVariantId = "nova" | "mango" | "bubble";

export type PetVariant = {
  id: PetVariantId;
  color: string;
  secondaryColor: string;
  eyeColor: string;
  accentColor: string;
};

export type PetHatchCardProps = {
  childId?: string;
  level?: number;
  petName?: string;
  xpTotal?: number;
};

export type PetStage = "egg" | "hatching" | "baby" | "child" | "teen" | "adult";
export type PetAction = "feed" | "play" | "clean" | "love" | "sleep";

export type CareStats = {
  hunger: number;
  happiness: number;
  energy: number;
  cleanliness: number;
};
