import { useAppColors } from "@/hooks/use-app-colors";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type IconProps = {
  style?: StyleProp<ViewStyle>;
  color?: string;
};

const MinusIcon = ({ style, color }: IconProps) => {
  const colors = useAppColors();
  const svgColor = color ?? colors.darkBlue;

  return (
    <Svg style={[styles.icon, style]} viewBox="0 0 20 20" fill="none">
      <Path
        d="M4.16602 10H15.834"
        stroke={svgColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

export default MinusIcon;
