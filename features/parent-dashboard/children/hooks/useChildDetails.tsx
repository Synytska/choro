import { useQuery } from "@tanstack/react-query";

import { childrenDashboardApi } from "../api/children-dashboard.api";

export function useChildDetails(id: string) {
  return useQuery({
    queryKey: ["child", id],
    queryFn: () => childrenDashboardApi.getChildDetails(id),
    enabled: Boolean(id),
  });
}
