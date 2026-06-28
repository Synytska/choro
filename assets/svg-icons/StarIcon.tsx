import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Svg, {
  Defs,
  FeBlend,
  FeColorMatrix,
  FeComposite,
  FeFlood,
  FeGaussianBlur,
  FeOffset,
  Filter,
  G,
  Path,
  Rect,
} from "react-native-svg";

import { useAppColors } from "@/hooks/use-app-colors";

type IconProps = {
  style?: StyleProp<ViewStyle>;
  color?: string;
};

const StarIcon = ({ style, color }: IconProps) => {
  const colors = useAppColors();
  const svgColor = color ?? colors.yellow;

  return (
    <Svg style={[styles.icon, style]} viewBox="0 0 38 38" fill="none">
      <G filter="url(#filter0_d_51_87)">
        <Rect
          x="10"
          y="10"
          width="18"
          height="18"
          rx="3"
          fill={svgColor}
          shape-rendering="crispEdges"
        />
        <Path
          d="M18.8328 13.0502C18.7825 13.0829 18.7419 13.1298 18.7156 13.1855L17.3303 16.1295C17.2389 16.3235 17.104 16.4913 16.9371 16.6184C16.7702 16.7456 16.5763 16.8283 16.3722 16.8594L13.2735 17.3344C13.2145 17.3432 13.159 17.3691 13.1134 17.4093C13.0678 17.4495 13.0339 17.5023 13.0155 17.5617C12.9971 17.6211 12.995 17.6847 13.0095 17.7453C13.0239 17.806 13.0542 17.8611 13.0971 17.9045L15.3385 20.1929C15.4864 20.344 15.5971 20.5305 15.661 20.7365C15.7248 20.9425 15.74 21.1616 15.705 21.3751L15.1765 24.6085C15.1662 24.67 15.1726 24.7333 15.1949 24.7911C15.2172 24.849 15.2545 24.8991 15.3026 24.9358C15.3508 24.9726 15.4078 24.9944 15.4671 24.9988C15.5265 25.0032 15.5858 24.9901 15.6384 24.9609L18.4084 23.4332C18.5909 23.3327 18.794 23.2801 19.0002 23.2801C19.2064 23.2801 19.4095 23.3327 19.5921 23.4332L22.3626 24.9609C22.4152 24.9903 22.4747 25.0035 22.5341 24.9992C22.5936 24.9949 22.6507 24.9731 22.6989 24.9363C22.7472 24.8996 22.7846 24.8494 22.8069 24.7914C22.8292 24.7335 22.8356 24.6701 22.8252 24.6085L22.296 21.3745C22.2613 21.1611 22.2765 20.9421 22.3403 20.7362C22.4042 20.5304 22.5148 20.3439 22.6626 20.1929L24.904 17.9039C24.9465 17.8604 24.9765 17.8054 24.9907 17.7449C25.005 17.6845 25.0028 17.6211 24.9844 17.562C24.9661 17.5028 24.9323 17.4502 24.8869 17.4101C24.8415 17.37 24.7863 17.344 24.7276 17.3351L21.6283 16.8594C21.4244 16.828 21.2308 16.7452 21.0641 16.6181C20.8975 16.4909 20.7627 16.3233 20.6714 16.1295L19.2855 13.1855C19.2592 13.1298 19.2186 13.0829 19.1683 13.0502C19.1179 13.0174 19.0598 13 19.0005 13C18.9413 13 18.8832 13.0174 18.8328 13.0502Z"
          fill="#0D0D0D"
        />
      </G>
      <Defs>
        <Filter
          id="filter0_d_51_87"
          x="0"
          y="0"
          width="38"
          height="38"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <FeFlood flood-opacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset />
          <FeGaussianBlur stdDeviation="5" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.898039 0 0 0 0 0 0 0 0 0.4 0" />
          <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_51_87" />
          <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_51_87" result="shape" />
        </Filter>
      </Defs>
    </Svg>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 38,
    height: 38,
  },
});

export default StarIcon;
