import { useQuery } from "@tanstack/react-query";

import { rewardsApi } from "../api/rewards.api";

export function useRewardDetails(id: string) {
  return useQuery({
    queryKey: ["rewards", "details", id],
    queryFn: () => rewardsApi.getRewardDetails(id),
    enabled: Boolean(id),
  });
}
