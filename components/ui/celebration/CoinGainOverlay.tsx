import { useCallback } from "react";

import { hideCoinGain } from "@/store/features/celebration/celebrationSlice";
import { selectCoinGainCelebration } from "@/store/features/celebration/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { CoinRainOverlay } from "./CoinRainOverlay";

export function CoinGainOverlay() {
  const dispatch = useAppDispatch();
  const celebration = useAppSelector(selectCoinGainCelebration);

  const onFinish = useCallback(() => {
    dispatch(hideCoinGain());
  }, [dispatch]);

  if (!celebration) {
    return null;
  }

  return <CoinRainOverlay active amount={celebration.amount} onFinish={onFinish} />;
}
