import { ActivityIndicator, Animated, Easing, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";

import { useAppTheme } from "@/hooks/useAppTheme";

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
}

export const GradientButton = ({ label, onPress, loading, style }: Props) => {
  const { theme } = useAppTheme();
  const gradientColors = theme.gradients.hero as [string, string, ...string[]];
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1800,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: true
      })
    );

    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  return (
    <Pressable onPress={onPress} disabled={loading}>
      {({ pressed }) => (
        <Animated.View
          style={[
            style,
            {
              opacity: loading ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.982 : 1 }, { translateY: pressed ? 1 : 0 }]
            }
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Animated.View
              pointerEvents="none"
              style={[
                styles.shimmer,
                {
                  transform: [
                    {
                      translateX: shimmer.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-220, 220]
                      })
                    },
                    { rotate: "-18deg" }
                  ]
                }
              ]}
            />
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.label}>{label}</Text>
            )}
          </LinearGradient>
        </Animated.View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  shimmer: {
    position: "absolute",
    top: -16,
    bottom: -16,
    width: 74,
    backgroundColor: "rgba(255,255,255,0.18)"
  },
  label: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700"
  }
});
