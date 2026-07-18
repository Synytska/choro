import { useQuery } from "@tanstack/react-query";

import { selectAuthUserId, selectAuthUserLoginCode } from "@/store/features/auth/selectors";
import { useAppSelector } from "@/store/hooks";

import { kidDashboardApi } from "../api/kid-dashboard.api";

export function useKidDashboard() {
  const childId = useAppSelector(selectAuthUserId);
  const loginCode = useAppSelector(selectAuthUserLoginCode);

  return useQuery({
    queryKey: ["kid", "dashboard", childId],
    queryFn: () =>
      kidDashboardApi.getDashboardData({
        childId: childId!,
        loginCode: loginCode!,
      }),
    enabled: Boolean(childId && loginCode),
  });
}
