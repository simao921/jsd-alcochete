import { useColorScheme } from "react-native";

import { useAppStore } from "@/store/appStore";
import { createTheme } from "@/theme";

export const useAppTheme = () => {
  const systemScheme = useColorScheme();
  const themePreference = useAppStore((state) => state.themePreference);

  const mode =
    themePreference === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : themePreference;

  return {
    isDark: mode === "dark",
    theme: createTheme(mode)
  };
};
