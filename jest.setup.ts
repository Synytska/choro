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

jest.mock("moti/skeleton", () => {
  const React = jest.requireActual("react") as typeof import("react");
  const { View } = jest.requireActual("react-native") as typeof import("react-native");

  const MockSkeleton = ({
    children,
    height,
    width,
  }: {
    children?: React.ReactNode;
    height?: number;
    width?: number | string;
  }) => {
    return React.createElement(View, { testID: "moti-skeleton" }, children);
  };

  const MockSkeletonGroup = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(View, null, children);

  MockSkeleton.Group = MockSkeletonGroup;

  return {
    Skeleton: MockSkeleton,
  };
});

jest.mock("react-native-reanimated", () => {
  const mockReanimated = jest.requireActual("react-native-reanimated/mock") as {
    default: {
      call: () => void;
    };
  };

  mockReanimated.default.call = () => {};

  return mockReanimated;
});

jest.mock("expo-apple-authentication", () => {
  const React = jest.requireActual("react") as typeof import("react");
  const { Pressable } = jest.requireActual("react-native") as typeof import("react-native");
  const isAvailableAsync = jest.fn() as jest.MockedFunction<() => Promise<boolean>>;

  isAvailableAsync.mockResolvedValue(true);

  return {
    AppleAuthenticationButton: ({ onPress }: { onPress: () => void }) =>
      React.createElement(Pressable, { onPress, testID: "apple-auth-button" }),
    AppleAuthenticationButtonStyle: {
      BLACK: 2,
      WHITE: 0,
      WHITE_OUTLINE: 1,
    },
    AppleAuthenticationButtonType: {
      CONTINUE: 1,
      SIGN_IN: 0,
      SIGN_UP: 2,
    },
    AppleAuthenticationScope: {
      EMAIL: 1,
      FULL_NAME: 0,
    },
    isAvailableAsync,
    signInAsync: jest.fn(),
  };
});
