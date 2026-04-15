import { darkPalette, lightPalette } from "./colors";

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 36
};

export const radius = {
  sm: 14,
  md: 20,
  lg: 28,
  pill: 999
};

export const typography = {
  display: "Avenir Next",
  body: "System"
};

export const createTheme = (mode: "light" | "dark") => {
  const colors = mode === "dark" ? darkPalette : lightPalette;

  return {
    mode,
    colors,
    spacing,
    radius,
    typography,
    gradients: {
      hero: ["#FF885A", "#FFB36C", "#6EC8FF"],
      accent: ["#6CE0B6", "#47A6FF"],
      dusk: ["#111827", "#14223A", "#22385E"]
    },
    shadows: {
      card: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 1,
        shadowRadius: 28,
        elevation: 14
      }
    }
  };
};

export type AppTheme = ReturnType<typeof createTheme>;
