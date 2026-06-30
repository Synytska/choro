import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

export function ProgressRing({ color, progress }: { color: string; progress: number }) {
  const size = 44;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.ringWrapper}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  ringWrapper: {
    width: 44,
    height: 44,
  },
});
