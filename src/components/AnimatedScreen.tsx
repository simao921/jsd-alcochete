import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "@/hooks/useAppTheme";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { AnimatedReveal } from "@/components/AnimatedReveal";

export const AnimatedScreen = ({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) => {
  const { theme, isDark } = useAppTheme();

  return (
    <LinearGradient
      colors={isDark ? ["#040814", "#08111F", "#112443", "#102E3B"] : ["#F7F4EF", "#EEF5FF", "#FFF3E8", "#EEF8F5"]}
      style={styles.container}
    >
      <View style={[styles.noise, { opacity: isDark ? 0.12 : 0.06 }]} />
      <AtmosphericBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <AnimatedReveal style={[styles.inner, style]}>
          {children}
        </AnimatedReveal>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  noise: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.02)"
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 148
  },
  inner: {
    gap: 18
  }
});
