import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "@/hooks/useAppTheme";

export const GlassCard = ({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) => {
  const { theme, isDark } = useAppTheme();

  return (
    <View style={[styles.wrapper, theme.shadows.card, style]}>
      <BlurView intensity={isDark ? 45 : 75} tint={isDark ? "dark" : "light"} style={styles.blur}>
        <LinearGradient
          colors={[theme.colors.glass, isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.85)", theme.colors.overlay]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.fill, { borderColor: theme.colors.border }]}
        >
          <View style={styles.highlight} />
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 28,
    overflow: "hidden"
  },
  blur: {
    borderRadius: 28,
    overflow: "hidden"
  },
  fill: {
    borderWidth: 1,
    padding: 18,
    overflow: "hidden"
  },
  highlight: {
    position: "absolute",
    top: -10,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.18)"
  }
});
