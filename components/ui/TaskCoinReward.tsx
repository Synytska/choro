/**
 * Coin reward control rendered inside selected task rows.
 *
 * Props:
 * - value: current coin amount for the task.
 * - onIncrease/onDecrease: parent-owned handlers, so add/edit modals can save the value later.
 */
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { AppIcon, Icons } from "./AppIcon";
import { Stepper } from "./Stepper";

type TaskCoinRewardProps = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function TaskCoinReward({ value, onIncrease, onDecrease }: TaskCoinRewardProps) {
  const colors = useAppColors();
  const { t } = useTranslation();

  return (
    <View>
      <View style={[styles.divider, { backgroundColor: colors.lightGrey }]} />
      <View style={styles.coinWrapper}>
        <View style={styles.taskDetails}>
          <AppIcon icon={Icons.coins} size={16} color={colors.orange} />
          <Text>{t("common.reward")}</Text>
        </View>
        <Stepper
          value={value}
          increase={onIncrease}
          decrease={onDecrease}
          buttonSize={24}
          valueStyle={styles.value}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 10,
  },
  taskDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coinWrapper: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    lineHeight: 20,
  },
});
