import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { useAppColors } from "@/hooks/use-app-colors";

type IconProps = {
  style?: StyleProp<ViewStyle>;
  textColor?: string;
  dotColor?: string;
};

const LogoSmall = ({ style, textColor, dotColor }: IconProps) => {
  const colors = useAppColors();
  const logoTextColor = textColor ?? colors.logoNavy;
  const logoDotColor = dotColor ?? colors.logoDotRed;

  return (
    <Svg style={[styles.icon, style]} viewBox="0 0 48 48" fill="none">
      <Rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke={logoTextColor} />
      <Path
        d="M32.4853 32.4853C30.8071 34.1635 28.6689 35.3064 26.3411 35.7694C24.0133 36.2324 21.6005 35.9948 19.4078 35.0866C17.2151 34.1783 15.3409 32.6402 14.0224 30.6668C12.7038 28.6935 12 26.3734 12 24C12 21.6266 12.7038 19.3065 14.0224 17.3332C15.3409 15.3598 17.2151 13.8217 19.4078 12.9134C21.6005 12.0052 24.0133 11.7676 26.3411 12.2306C28.6689 12.6936 30.8071 13.8365 32.4853 15.5147"
        stroke={logoTextColor}
        strokeWidth="4"
      />
      <Circle cx="24" cy="24" r="3.5" fill={logoDotColor} />
    </Svg>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 48,
    height: 48,
  },
});

export default LogoSmall;
