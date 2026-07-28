// app/i18n/index.ts
import * as Localization from "expo-localization";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/lib/locales/en/translation.json";
import uk from "@/lib/locales/uk/translation.json";

const resources = {
  en: { translation: en },
  uk: { translation: uk },
};

const i18nInstance = i18next;

i18nInstance.use(initReactI18next).init({
  resources,
  lng: Localization.getLocales()[0]?.languageCode || "en",
  fallbackLng: "en",
  supportedLngs: ["en", "uk"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18nInstance;
