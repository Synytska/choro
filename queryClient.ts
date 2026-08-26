import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { Query } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const REACT_QUERY_CACHE_KEY = "@choro/react-query-cache";

const shouldPersistQuery = (query: Query) => {
  const [scope] = query.queryKey;

  return query.state.status === "success" && scope !== "auth";
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: DAY_IN_MS,
      staleTime: 1000 * 30,
    },
  },
});

export const queryClientPersister = createAsyncStoragePersister({
  key: REACT_QUERY_CACHE_KEY,
  storage: AsyncStorage,
  throttleTime: 1000,
});

export const queryClientPersistOptions = {
  buster: "choro-v1",
  dehydrateOptions: {
    shouldDehydrateQuery: shouldPersistQuery,
  },
  maxAge: DAY_IN_MS,
  persister: queryClientPersister,
};
