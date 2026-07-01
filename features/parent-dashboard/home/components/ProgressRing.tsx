import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useAppColors } from "@/hooks/use-app-colors";

export function ProgressRing({
  color,
  progress,
  ringSize,
  ringWidth,
  showPercent = false,
}: {
  color: string;
  progress: number;
  ringSize?: number;
  ringWidth?: number;
  showPercent?: boolean;
}) {
  const size = ringSize || 44;
  const strokeWidth = ringWidth || 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const colors = useAppColors();
  const { t } = useTranslation();

  const dynamicStyles = StyleSheet.create({
    ringWrapper: {
      width: size,
      height: size,
    },
    percent: {
      fontSize: size / 4,
    },
    done: {
      color: colors.darkGrey,
    },
  });

  return (
    <View style={[styles.ringWrapper, dynamicStyles.ringWrapper]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeOpacity={0.18}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </Svg>

      {showPercent && (
        <View style={styles.label}>
          <Text style={[styles.percent, dynamicStyles.percent]}>{Math.round(progress * 100)}%</Text>

          <Text style={[styles.done, dynamicStyles.done]}>{t("common.done")}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ringWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    alignItems: "center",
  },
  percent: {
    fontWeight: "800",
  },
  done: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    textTransform: "uppercase",
  },
});
