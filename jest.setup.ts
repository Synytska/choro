import { jest } from "@jest/globals";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("react-native-reanimated", () => {
  const mockReanimated = jest.requireActual("react-native-reanimated/mock") as {
    default: {
      call: () => void;
    };
  };

  mockReanimated.default.call = () => {};

  return mockReanimated;
});
