import { useQuery } from "@tanstack/react-query";

import { childrenDashboardApi } from "../api/children-dashboard.api";

export function useChildren() {
  return useQuery({
    queryKey: ["children", "dashboard"],
    queryFn: childrenDashboardApi.getDashboardData,
  });
}
