import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { Mock } from "jest-mock";
import type { ReactNode } from "react";

import { taskStatus } from "@/lib/constants";

import ParentChildrenUI from "../index";

type AnyMock = Mock<(...args: any[]) => any>;

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      language: "en",
    },
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        "common.cancel": "Cancel",
        "common.children": "Children",
        "common.delete": "Delete",
        "parent.children.total": `${params?.amount ?? 0}`,
        "parent.children.yearsOld": `${params?.age ?? 0} years old`,
      };

      return translations[key] ?? key;
    },
  }),
}));

jest.mock("@/components/ui/PageView", () => {
  const { View } = jest.requireActual("react-native") as typeof import("react-native");

  return function MockPageView({ children }: { children: ReactNode }) {
    return <View>{children}</View>;
  };
});

jest.mock("@/components/ui/Header", () => ({
  Header: ({ icon, title }: { icon?: ReactNode; title: string }) => {
    const { Text, View } = jest.requireActual("react-native") as typeof import("react-native");

    return (
      <View>
        <Text>{title}</Text>
        {icon}
      </View>
    );
  },
}));

jest.mock("@/components/ui/SwipeToDelete", () => {
  const { View } = jest.requireActual("react-native") as typeof import("react-native");

  return function MockSwipeToDelete({ children }: { children: ReactNode }) {
    return <View>{children}</View>;
  };
});

jest.mock("@/hooks/useSwipeToDeleteList", () => ({
  useSwipeToDeleteList: () => ({
    closeAllSwipeables: jest.fn(),
    handleSwipeEnd: jest.fn(),
    handleSwipeOpen: jest.fn(),
    handleSwipeStart: jest.fn(),
    isScrollEnabled: true,
    setSwipeableRef: () => jest.fn(),
  }),
}));

jest.mock("../hooks/useChildren", () => ({
  useChildren: jest.fn(),
}));

jest.mock("../hooks/useDeleteChild", () => ({
  useDeleteChild: jest.fn(),
}));

const { useChildren } = jest.requireMock("../hooks/useChildren") as {
  useChildren: AnyMock;
};

const { useDeleteChild } = jest.requireMock("../hooks/useDeleteChild") as {
  useDeleteChild: AnyMock;
};

const { router: mockRouter } = jest.requireMock("expo-router") as {
  router: {
    push: AnyMock;
  };
};

describe("ParentChildrenUI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDeleteChild.mockReturnValue({
      isPending: false,
      mutate: jest.fn(),
    });
  });

  it("shows approve badges only for children with review tasks", () => {
    useChildren.mockReturnValue({
      data: {
        children: [
          {
            id: "child-1",
            name: "Alex",
            age: 8,
            coins: 145,
            avatarId: null,
            avatarUrl: null,
          },
          {
            id: "child-2",
            name: "Sofia",
            age: 7,
            coins: 82,
            avatarId: null,
            avatarUrl: null,
          },
        ],
        tasks: [
          {
            id: "task-1",
            childId: "child-1",
            title: "Make the bed",
            time: "09:00",
            status: taskStatus.review,
          },
          {
            id: "task-2",
            childId: "child-1",
            title: "Clean the room",
            time: "10:00",
            status: taskStatus.review,
          },
          {
            id: "task-3",
            childId: "child-2",
            title: "Walk the dog",
            time: "11:00",
            status: taskStatus.pending,
          },
        ],
      },
    });

    render(<ParentChildrenUI />);

    expect(screen.getByText("Alex")).toBeTruthy();
    expect(screen.getByText("Sofia")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.queryByText("1")).toBeNull();
  });

  it("opens child details when a child card is pressed", () => {
    useChildren.mockReturnValue({
      data: {
        children: [
          {
            id: "child-1",
            name: "Alex",
            age: 8,
            coins: 145,
            avatarId: null,
            avatarUrl: null,
          },
        ],
        tasks: [],
      },
    });

    render(<ParentChildrenUI />);

    fireEvent.press(screen.getByText("Alex"));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/(role-parent)/children/[id]",
      params: { id: "child-1" },
    });
  });
});
