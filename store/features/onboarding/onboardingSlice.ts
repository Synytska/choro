import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { defaultChildAvatarId, taskCategories } from "@/lib/constants";
import { OnboardingTask } from "@/lib/types";

export type ChildGender = "girl" | "boy";
export const genders: ChildGender[] = ["boy", "girl"];

const tasks = [
  {
    id: "toys",
    emoji: "🧸",
    title: "Arrange the toys",
    selected: false,
    coins: 1,
    category: taskCategories.organization,
  },
  {
    id: "bed",
    emoji: "🛏️",
    title: "Make the bed",
    selected: false,
    coins: 1,
    category: taskCategories.organization,
  },
  {
    id: "teeth",
    emoji: "🪥",
    title: "Brush your teeth",
    selected: false,
    coins: 1,
    category: taskCategories.helping,
  },
  {
    id: "table",
    emoji: "🍽️",
    title: "Serve a table",
    selected: false,
    coins: 1,
    category: taskCategories.cooking,
  },
  {
    id: "dishes",
    emoji: "🧽",
    title: "Wash the dishes",
    selected: false,
    coins: 1,
    category: taskCategories.cleaning,
  },
  {
    id: "trash",
    emoji: "🗑️",
    title: "Take out the trash",
    selected: false,
    coins: 1,
    category: taskCategories.cleaning,
  },
  {
    id: "room",
    emoji: "🧹",
    title: "Clean the room",
    selected: false,
    coins: 1,
    category: taskCategories.cleaning,
  },
  {
    id: "flowers",
    emoji: "🌻",
    title: "Water the flowers",
    selected: false,
    coins: 1,
    category: taskCategories.helping,
  },
];

type OnboardingPrize = {
  name: string;
  coinAmount: string;
  icon: string;
  imageUri: string | null;
  imageMimeType: string | null;
};

type OnboardingState = {
  currentStep: number;
  totalSteps: number;
  childName: string;
  avatarId: string;
  avatarImageUri: string | null;
  avatarImageMimeType: string | null;
  childAge: number;
  childGender: ChildGender;
  childCode: string;
  tasks: OnboardingTask[];
  prize: OnboardingPrize;
};

const initialState: OnboardingState = {
  currentStep: 1,
  totalSteps: 7,
  childName: "",
  avatarId: defaultChildAvatarId,
  avatarImageUri: null,
  avatarImageMimeType: null,
  childAge: 0,
  childGender: "boy",
  childCode: "",
  tasks: tasks,
  prize: {
    name: "",
    coinAmount: "0",
    icon: "",
    imageUri: null,
    imageMimeType: null,
  },
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    updateOnboarding: (state, action: PayloadAction<Partial<OnboardingState>>) => {
      Object.assign(state, action.payload);
    },
    setTaskCoins: (state, action: PayloadAction<{ id: string; coins: number }>) => {
      const task = state.tasks.find((item) => item.id === action.payload.id);

      if (task) {
        task.coins = Math.max(1, action.payload.coins);
      }
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((item) => item.id === action.payload);

      if (task) {
        task.selected = !task.selected;
      }
    },
    setPrize: (state, action: PayloadAction<Partial<OnboardingPrize>>) => {
      state.prize = {
        ...state.prize,
        ...action.payload,
      };
    },
  },
});

export const { setPrize, toggleTask, updateOnboarding, setTaskCoins } = onboardingSlice.actions;

export const onboardingReducer = onboardingSlice.reducer;
