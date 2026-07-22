/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    parentBackground: "#F8F9FB",
    tint: tintColorLight,
    icon: "#6B7280",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
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
    //TODO: Decide which orange to use
    //  orange: "#FF7B54",
    lightBlue: "#EEF0FF",
    borderBlue: "#1F2937",
    review: "#91d0d893",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    parentBackground: "#F8F9FB",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
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
    orange: "#F59E0B",
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
