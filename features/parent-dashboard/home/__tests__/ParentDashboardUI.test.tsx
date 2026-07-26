import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import type { Mock } from "jest-mock";
import type { ReactNode } from "react";
import type { Text as TextType, View as ViewType } from "react-native";

import ParentDashboardUI from "../index";

type AnyMock = Mock<(...args: any[]) => any>;
const { Text, View } = jest.requireActual("react-native") as {
  Text: typeof TextType;
  View: typeof ViewType;
};

jest.mock("@expo/vector-icons", () => {
  const MockIcon = ({ name }: { name?: string }) => <Text>{name}</Text>;

  return {
    AntDesign: MockIcon,
    EvilIcons: MockIcon,
    Feather: MockIcon,
    FontAwesome: MockIcon,
    FontAwesome5: MockIcon,
    FontAwesome6: MockIcon,
    Ionicons: MockIcon,
    MaterialIcons: MockIcon,
  };
});

jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const MockMaterialIcons = ({ name }: { name?: string }) => <Text>{name}</Text>;

  MockMaterialIcons.glyphMap = {};

  return {
    __esModule: true,
    default: MockMaterialIcons,
  };
});

jest.mock("moti/skeleton", () => {
  const MockSkeleton = ({ children, height, width }: any) => (
    <View style={{ height, width }} testID="moti-skeleton">
      {children}
    </View>
  );

  function MockSkeletonGroup({ children }: { children: ReactNode }) {
    return <View>{children}</View>;
  }

  MockSkeleton.Group = MockSkeletonGroup;

  return {
    Skeleton: MockSkeleton,
  };
});

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        "common.children": "Children",
        "common.done": "Done",
        "common.pending": "Pending",
        "common.user": "User",
        "parent.home.activeTasks": "Active Tasks",
        "parent.home.greeting": `Hello, ${params?.name ?? "User"}`,
        "parent.home.seeAll": "See All",
        "parent.home.subtitle": `You have ${params?.amount ?? 0} chores pending`,
      };

      return translations[key] ?? key;
    },
  }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
}));

jest.mock("@/assets/svg-icons/LogoSmall", () => {
  return function MockLogoSmall() {
    return <View testID="logo-small" />;
  };
});

jest.mock("@/hooks/use-app-colors", () => ({
  useAppColors: () => ({
    background: "#FFFFFF",
    parentBackground: "#F8F9FB",
    white: "#FFFFFF",
    darkNavy: "#111827",
    darkGrey: "#6B7280",
    orange: "#F59E0B",
    lightGreen: "#DCFCE7",
    darkGreen: "#059669",
    lightYellow: "#FEF3C7",
    lightBlue: "#EEF0FF",
  }),
}));

jest.mock("@/components/ui/PageView", () => {
  return function MockPageView({ children }: { children: ReactNode }) {
    return <View>{children}</View>;
  };
});

jest.mock("@/features/auth/hooks/useProfile", () => ({
  useProfile: jest.fn(),
}));

jest.mock("@/features/parent-dashboard/children/hooks/useChildren", () => ({
  useChildren: jest.fn(),
}));

const { useProfile } = jest.requireMock("@/features/auth/hooks/useProfile") as {
  useProfile: AnyMock;
};

const { useChildren } = jest.requireMock(
  "@/features/parent-dashboard/children/hooks/useChildren",
) as {
  useChildren: AnyMock;
};

describe("ParentDashboardUI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useProfile.mockReturnValue({
      data: {
        name: "Maria",
      },
    });
  });

  it("renders parent profile, children with coins, tasks, and derived pending count", () => {
    useChildren.mockReturnValue({
      isLoading: false,
      data: {
        children: [
          {
            name: "Alex",
            coins: 145,
            color: "#5146E8",
            progress: 0.5,
          },
          {
            name: "Sofia",
            coins: 82,
            color: "#EC4899",
            progress: 0.25,
          },
        ],
        tasks: [
          {
            title: "Make the bed",
            time: "08:30 AM",
            status: "done",
          },
          {
            title: "Walk the dog",
            time: "05:00 PM",
            status: "pending",
          },
        ],
      },
    });

    render(<ParentDashboardUI />);

    expect(screen.getByText("Hello, Maria")).toBeTruthy();
    expect(screen.getByText("You have 1 chores pending")).toBeTruthy();

    expect(screen.getByText("Children")).toBeTruthy();
    expect(screen.getByText("Alex")).toBeTruthy();
    expect(screen.getByText("145")).toBeTruthy();
    expect(screen.getByText("Sofia")).toBeTruthy();
    expect(screen.getByText("82")).toBeTruthy();

    expect(screen.getByText("Active Tasks")).toBeTruthy();
    expect(screen.getByText("Make the bed")).toBeTruthy();
    expect(screen.getByText("08:30 AM")).toBeTruthy();
    expect(screen.getByText("Walk the dog")).toBeTruthy();
    expect(screen.getByText("05:00 PM")).toBeTruthy();
    expect(screen.getAllByText("Done").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
  });

  it("falls back to default user name when profile name is missing", () => {
    useProfile.mockReturnValue({
      data: null,
    });
    useChildren.mockReturnValue({
      isLoading: false,
      data: {
        children: [],
        tasks: [],
      },
    });

    render(<ParentDashboardUI />);

    expect(screen.getByText("Hello, User")).toBeTruthy();
  });

  it("shows dashboard skeleton while dashboard data is loading", () => {
    useChildren.mockReturnValue({
      isLoading: true,
      data: undefined,
    });

    render(<ParentDashboardUI />);

    expect(screen.getByTestId("parent-dashboard-skeleton")).toBeTruthy();
  });

  it("shows empty states when there are no children and tasks", () => {
    useChildren.mockReturnValue({
      isLoading: false,
      data: {
        children: [],
        tasks: [],
      },
    });

    render(<ParentDashboardUI />);

    expect(screen.getByText("No children yet.")).toBeTruthy();
    expect(screen.getByText("No tasks yet.")).toBeTruthy();
  });
});
