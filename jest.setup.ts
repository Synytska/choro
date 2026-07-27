import { jest } from "@jest/globals";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import React from "react";
import { Text } from "react-native";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
}));

const MockIcon = ({ name }: { name?: string }) => React.createElement(Text, null, name);

jest.mock("@expo/vector-icons", () => ({
  AntDesign: MockIcon,
  EvilIcons: MockIcon,
  Feather: MockIcon,
  FontAwesome: MockIcon,
  FontAwesome5: MockIcon,
  FontAwesome6: MockIcon,
  Ionicons: MockIcon,
  MaterialIcons: MockIcon,
}));

jest.mock("@expo/vector-icons/MaterialIcons", () => ({
  __esModule: true,
  default: MockIcon,
}));

jest.mock("react-native-reanimated", () => {
  const mockReanimated = jest.requireActual("react-native-reanimated/mock") as {
    default: {
      call: () => void;
    };
  };

  mockReanimated.default.call = () => {};

  return mockReanimated;
});
