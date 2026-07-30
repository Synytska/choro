import { useMutation, useQueryClient } from "@tanstack/react-query";

import { levelUpCoins } from "@/lib/constants";
import { selectAuthUserLoginCode } from "@/store/features/auth/selectors";
import { hideCelebration } from "@/store/features/celebration/celebrationSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { levelUpApi } from "../api/level-up.api";

export function useClaimLevelUpBonus() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const loginCode = useAppSelector(selectAuthUserLoginCode);

  return useMutation({
    mutationFn: ({ childId, level }: { childId: string; level: number }) => {
      if (!loginCode) {
        throw new Error("Child login code is missing");
      }

      return levelUpApi.claimLevelUpBonus({
        childId,
        level,
        loginCode,
      });
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["kid", "dashboard", variables.childId],
      });

      dispatch(hideCelebration());
    },
    onError: (error) => {
      console.log(`Claim ${levelUpCoins} level-up coins error:`, error);
    },
  });
}
