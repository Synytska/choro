import { useEffect, useRef } from "react";

import { useKidDashboard } from "@/features/kid-dashboard/home/hooks/useKidDashboard";
import { selectAuthUserId } from "@/store/features/auth/selectors";
import { showCoinGain } from "@/store/features/celebration/celebrationSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function CoinGainWatcher() {
  const dispatch = useAppDispatch();
  const childId = useAppSelector(selectAuthUserId);
  const { data } = useKidDashboard();
  const previousCoinsRef = useRef<number | null>(null);
  const coinBalance = data?.child?.coinBalance ?? data?.child?.coins;

  useEffect(() => {
    if (typeof coinBalance !== "number") return;

    if (previousCoinsRef.current === null) {
      previousCoinsRef.current = coinBalance;
      return;
    }

    if (coinBalance > previousCoinsRef.current && childId) {
      dispatch(
        showCoinGain({
          childId,
          amount: coinBalance - previousCoinsRef.current,
        }),
      );
    }

    previousCoinsRef.current = coinBalance;
  }, [childId, coinBalance, dispatch]);

  return null;
}
