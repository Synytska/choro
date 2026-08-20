import { Palette } from "@/constants/theme";

import { CareStats, PetAction, PetVariant } from "./types";

export const actionConfig: { id: PetAction; icon: string; stat: keyof CareStats; value: number }[] =
  [
    { id: "feed", icon: "🍎", stat: "hunger", value: 18 },
    { id: "play", icon: "⚡", stat: "happiness", value: 15 },
    { id: "clean", icon: "🫧", stat: "cleanliness", value: 20 },
    { id: "love", icon: "💗", stat: "happiness", value: 12 },
    { id: "sleep", icon: "🌙", stat: "energy", value: 20 },
  ];

export const petVariants: PetVariant[] = [
  {
    id: "nova",
    color: Palette.green,
    secondaryColor: Palette.yellow,
    eyeColor: "#00d4ff",
    accentColor: Palette.green,
  },
  {
    id: "mango",
    color: Palette.orange,
    secondaryColor: "#fff4b8",
    eyeColor: "#5146e8",
    accentColor: Palette.orange,
  },
  {
    id: "bubble",
    color: Palette.pink,
    secondaryColor: "#f0abfc",
    eyeColor: "#ffe500",
    accentColor: Palette.pink,
  },
];
