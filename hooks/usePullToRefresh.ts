import { useCallback, useState } from "react";

type UsePullToRefreshOptions = {
  onRefresh: () => Promise<unknown>;
  shouldRefresh?: () => boolean;
};

export function usePullToRefresh({ onRefresh, shouldRefresh }: UsePullToRefreshOptions) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    if (shouldRefresh && !shouldRefresh()) return;

    setRefreshing(true);

    void onRefresh().finally(() => {
      setRefreshing(false);
    });
  }, [onRefresh, shouldRefresh]);

  return {
    refreshing,
    onRefresh: handleRefresh,
  };
}
