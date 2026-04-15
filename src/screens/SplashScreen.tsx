import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles, Flame, Droplets } from "lucide-react-native";

export const SplashScreen = () => {
  const orbScale = useRef(new Animated.Value(0.92)).current;
  const orbOpacity = useRef(new Animated.Value(0.1)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    const sequence = Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(orbScale, {
            toValue: 1.06,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          }),
          Animated.timing(orbScale, {
            toValue: 0.96,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          })
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(orbOpacity, {
            toValue: 0.24,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          }),
          Animated.timing(orbOpacity, {
            toValue: 0.12,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          })
        ])
      ),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 700,
          delay: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 700,
          delay: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        })
      ])
    ]);

    sequence.start();
    return () => sequence.stop();
  }, [orbOpacity, orbScale, titleOpacity, titleY]);

  return (
    <LinearGradient colors={["#040713", "#0A1428", "#12345A", "#0C2A32"]} style={styles.container}>
      <Animated.View
        style={[
          styles.ambientHalo,
          {
            opacity: orbOpacity,
            transform: [{ scale: orbScale }]
          }
        ]}
      />
      <View style={styles.logoOrb}>
        <Sparkles color="#FFF" size={38} />
      </View>

      <Animated.Text style={[styles.title, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
        NutriAI Pro
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
        Premium nutrition intelligence for everyday performance.
      </Animated.Text>

      <View style={styles.metrics}>
        <MetricChip icon={<Flame size={16} color="#FF885A" />} label="Adaptive calories" />
        <MetricChip icon={<Droplets size={16} color="#47E0B0" />} label="Hydration loops" />
      </View>
    </LinearGradient>
  );
};

const MetricChip = ({ icon, label }: { icon: ReactNode; label: string }) => (
  <View style={styles.chip}>
    {icon}
    <Text style={styles.chipText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 16
  },
  ambientHalo: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 160,
    backgroundColor: "rgba(110, 200, 255, 0.22)"
  },
  logoOrb: {
    width: 108,
    height: 108,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  title: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "800"
  },
  subtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 280
  },
  metrics: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  chipText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700"
  }
});
