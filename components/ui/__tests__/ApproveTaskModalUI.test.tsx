import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { Mock } from "jest-mock";
import type { ReactNode } from "react";

import { taskStatus } from "@/lib/constants";

import { ApproveTaskModalUI } from "../ApproveTaskModalUI";

type AnyMock = Mock<(...args: any[]) => any>;

jest.mock("expo-image", () => ({
  Image: () => {
    const { View } = jest.requireActual("react-native") as typeof import("react-native");

    return <View testID="proof-image" />;
  },
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      language: "en",
    },
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        "common.cancel": "Cancel",
        "kid.home.photoProof": "Photo Proof",
        "parent.tasks.approveTask": "Approve Task",
        "parent.tasks.rewardCoins": "Reward Coins",
        "parent.tasks.reviewProof": "Review proof",
        "parent.tasks.submittedBy": `Submitted by ${params?.name ?? ""}`,
      };

      return translations[key] ?? key;
    },
  }),
}));

jest.mock("@/hooks/use-app-colors", () => ({
  useAppColors: () => ({
    blue: "#2563EB",
    darkGrey: "#6B7280",
    darkNavy: "#111827",
    lightBlue: "#DBEAFE",
    lightGreen: "#DCFCE7",
    lightYellow: "#FEF3C7",
    middleGrey: "#D1D5DB",
    orange: "#F97316",
    parentBackground: "#F8F9FB",
    white: "#FFFFFF",
  }),
}));

jest.mock("@/features/parent-dashboard/tasks/hooks/useUpdateTaskStatus", () => ({
  useUpdateTaskStatus: jest.fn(),
}));

jest.mock("../PageView", () => {
  return function MockPageView({
    buttons = [],
    children,
  }: {
    buttons?: { disabled?: boolean; onPress: () => void; title: string }[];
    children: ReactNode;
  }) {
    const { Pressable, Text, View } = jest.requireActual(
      "react-native",
    ) as typeof import("react-native");

    return (
      <View>
        {children}
        {buttons.map((button) => (
          <Pressable key={button.title} disabled={button.disabled} onPress={button.onPress}>
            <Text>{button.title}</Text>
          </Pressable>
        ))}
      </View>
    );
  };
});

const { useUpdateTaskStatus } = jest.requireMock(
  "@/features/parent-dashboard/tasks/hooks/useUpdateTaskStatus",
) as {
  useUpdateTaskStatus: AnyMock;
};

const { useRouter } = jest.requireMock("expo-router") as {
  useRouter: AnyMock;
};

describe("ApproveTaskModalUI", () => {
  const mutate = jest.fn();
  const back = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mutate.mockImplementation((...args: unknown[]) => {
      const options = args[1] as { onSuccess?: () => void } | undefined;

      options?.onSuccess?.();
    });
    useUpdateTaskStatus.mockReturnValue({
      isPending: false,
      mutate,
    });
    useRouter.mockReturnValue({
      back,
    });
  });

  it("renders task proof details", () => {
    render(
      <ApproveTaskModalUI
        child={{ id: "child-1", name: "Alex" } as any}
        task={
          {
            id: "task-1",
            title: "Make the bed",
            description: "Straighten the blanket",
            emoji: "🛏️",
            coinReward: 5,
            proofPhotoUrl: "https://example.com/proof.jpg",
            status: taskStatus.review,
          } as any
        }
      />,
    );

    expect(screen.getByText("Review proof")).toBeTruthy();
    expect(screen.getByText("Submitted by Alex")).toBeTruthy();
    expect(screen.getByText("Make the bed")).toBeTruthy();
    expect(screen.getByText("Straighten the blanket")).toBeTruthy();
    expect(screen.getAllByTestId("proof-image").length).toBeGreaterThan(0);
  });

  it("approves a review task and closes the modal", () => {
    render(
      <ApproveTaskModalUI
        child={{ id: "child-1", name: "Alex" } as any}
        task={
          {
            id: "task-1",
            title: "Make the bed",
            coinReward: 5,
            status: taskStatus.review,
          } as any
        }
      />,
    );

    fireEvent.press(screen.getByText("Approve Task"));

    expect(mutate).toHaveBeenCalledWith(
      {
        taskId: "task-1",
        status: taskStatus.done,
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );
    expect(back).toHaveBeenCalledTimes(1);
  });
});
