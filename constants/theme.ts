/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

//TODO: Move here all necessary colors
export const Palette = {
  black: "#000000",
  white: "#FFFFFF",
  darkNavy: "#111827",
  parentBackground: "#F8F9FB",
  logoDotRed: "#FB7185",
  lightGrey: "#F3F4F6",
  middleGrey: "#E5E7EB",
  disabledGrey: "#d7d7da",
  darkGrey: "#6B7280",
  darkBlue: "#0a0a1a",
  borderBlue: "#1F2937",
  green: "#39FF14",
  yellow: "#FFE500",
  lightYellow: "#FEF3C7",
  skyBlue: "#00D4FF",
  cyan: "#00ffe1",
  lime: "#00ff4c",
  pink: "#ff00d9",
  blue: "#5146E8",
  orange: "#FF6B00",
  darkGreen: "#059669",
  error: "#EF4444",
};

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    input: "#fff",
    parentBackground: "#F8F9FB",
    tint: tintColorLight,
    icon: "#6B7280",
    iconBackground: "#F3F4F6",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    disabled: "#F3F4F6",
    disabledText: "#d7d7da",
    switchOff: "#E5E7EB",
    border: "#F3F4F6",

    black: "#000000",
    white: "#fff",
    lightGrey: "#F3F4F6",
    middleGrey: "#E5E7EB",
    disabledGrey: "#d7d7da",
    darkGrey: "#6B7280",
    logoNavy: "#111827",
    logoDotRed: "#FB7185",
    error: "#EF4444",
    green: "#39FF14",
    darkNavy: "#111827",
    yellow: "#FFE500",
    lightYellow: "#FEF3C7",
    skyBlue: "#00D4FF",
    blue: "#5146E8",
    darkBlue: "#0a0a1a",
    darkGreen: "#059669",
    progressGreen: "#70bc623c",
    greenDone: "#417d37",
    lightGreen: "#DCFCE7",
    orange: "#FF6B00",
    lightBlue: "#EEF0FF",
    borderBlue: "#1F2937",
    review: "#91d0d893",
  },
  dark: {
    text: "#ECEDEE",
    background: "#1F2937",
    input: "#1F2937",
    parentBackground: "#F8F9FB",
    tint: tintColorDark,
    icon: "#9BA1A6",
    iconBackground: "#1F2937",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    disabled: "#0a0a1a",
    disabledText: "#1F2937",
    switchOff: "#1F2937",
    border: "#6B7280",

    black: "#000000",
    white: "#fff",
    lightGrey: "#F3F4F6",
    middleGrey: "#E5E7EB",
    disabledGrey: "#d7d7da",
    darkGrey: "#6B7280",
    logoNavy: "#111827",
    logoDotRed: "#FB7185",
    error: "#EF4444",
    green: "#39FF14",
    darkNavy: "#111827",
    yellow: "#FFE500",
    lightYellow: "#FEF3C7",
    skyBlue: "#00D4FF",
    blue: "#5146E8",
    darkBlue: "#0a0a1a",
    darkGreen: "#059669",
    progressGreen: "#70bc623c",
    greenDone: "#417d37",
    lightGreen: "#DCFCE7",
    orange: "#FF6B00",
    lightBlue: "#EEF0FF",
    borderBlue: "#1F2937",
    review: "#91d0d893",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
    kid: "Jersey20_400Regular",
    kidFallback: "Rubik_800ExtraBold",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
    kid: "Jersey20_400Regular",
    kidFallback: "Rubik_800ExtraBold",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    kid: "Jersey20_400Regular",
    kidFallback: "Rubik_800ExtraBold",
  },
});
