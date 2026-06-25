import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ChildGender = "girl" | "boy" | "other" | null;

type OnboardingTask = {
  id: string;
  title: string;
  selected: boolean;
};

type OnboardingPrize = {
  name: string;
  coinAmount: string;
  imageUri: string | null;
};

type OnboardingState = {
  currentStep: number;
  totalSteps: number;
  childName: string;
  childAge: number | null;
  childGender: ChildGender;
  childCode: string;
  tasks: OnboardingTask[];
  prize: OnboardingPrize;
};

const initialState: OnboardingState = {
  currentStep: 1,
  totalSteps: 7,
  childName: "Alex",
  childAge: 8,
  childGender: "girl",
  childCode: "69HE1B34327",
  tasks: [
    { id: "arrange-toys", title: "Arrange the toys", selected: true },
    { id: "make-bed", title: "Make the bed", selected: true },
    { id: "brush-teeth", title: "Brush your teeth", selected: false },
    { id: "serve-table", title: "Serve a table", selected: false },
    { id: "wash-dishes", title: "Wash the dishes", selected: false },
    { id: "take-trash", title: "Take out the trash", selected: false },
    { id: "clean-room", title: "Clean the room", selected: false },
    { id: "water-flowers", title: "Water the flowers", selected: false },
  ],
  prize: {
    name: "New skateboard",
    coinAmount: "120",
    imageUri: null,
  },
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setChildName: (state, action: PayloadAction<string>) => {
      state.childName = action.payload;
    },
    setChildAge: (state, action: PayloadAction<number | null>) => {
      state.childAge = action.payload;
    },
    setChildGender: (state, action: PayloadAction<ChildGender>) => {
      state.childGender = action.payload;
    },
    setChildCode: (state, action: PayloadAction<string>) => {
      state.childCode = action.payload;
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((item) => item.id === action.payload);

      if (task) {
        task.selected = !task.selected;
      }
    },
    setTaskSelected: (
      state,
      action: PayloadAction<{ id: string; selected: boolean }>,
    ) => {
      const task = state.tasks.find((item) => item.id === action.payload.id);

      if (task) {
        task.selected = action.payload.selected;
      }
    },
    setPrize: (state, action: PayloadAction<Partial<OnboardingPrize>>) => {
      state.prize = {
        ...state.prize,
        ...action.payload,
      };
    },
    resetOnboarding: () => initialState,
  },
});

export const {
  resetOnboarding,
  setChildAge,
  setChildCode,
  setChildGender,
  setChildName,
  setCurrentStep,
  setPrize,
  setTaskSelected,
  toggleTask,
} = onboardingSlice.actions;

export const onboardingReducer = onboardingSlice.reducer;
