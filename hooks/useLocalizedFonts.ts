import { useTranslation } from "react-i18next";

import { Fonts } from "@/constants/theme";
import { normalizeLanguage } from "@/lib/utils/utils";

export function useLocalizedFonts() {
  const { i18n } = useTranslation();
  const useFallback = normalizeLanguage(i18n.language) === "uk";

  const font = (value: string) => (useFallback ? Fonts.kidFallback : value);

  return {
    kid: font(Fonts.kid),
    mono: font(Fonts.mono),
    rounded: font(Fonts.rounded),
    sans: Fonts.sans,
    serif: Fonts.serif,
  };
}
