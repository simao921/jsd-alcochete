import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

const translations = {
  en: {
    dashboard: "Dashboard",
    meals: "Meals",
    chat: "Coach",
    workouts: "Workouts",
    profile: "Profile"
  },
  pt: {
    dashboard: "Painel",
    meals: "Refeicoes",
    chat: "Coach",
    workouts: "Treinos",
    profile: "Perfil"
  }
};

export const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = "pt";
i18n.locale = Localization.getLocales()[0]?.languageCode ?? "pt";
