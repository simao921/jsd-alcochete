import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export const AtmosphericBackground = () => {
  const orbA = useRef(new Animated.Value(0)).current;
  const orbB = useRef(new Animated.Value(0)).current;
  const orbC = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLoop = (value: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          })
        ])
      );

    const animations = [createLoop(orbA, 4800), createLoop(orbB, 6200), createLoop(orbC, 5600)];
    animations.forEach((animation) => animation.start());

    return () => animations.forEach((animation) => animation.stop());
  }, [orbA, orbB, orbC]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.orb,
          styles.orange,
          {
            transform: [
              {
                translateX: orbA.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-26, 22]
                })
              },
              {
                translateY: orbA.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-12, 20]
                })
              },
              {
                scale: orbA.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.94, 1.08]
                })
              }
            ],
            opacity: orbA.interpolate({
              inputRange: [0, 1],
              outputRange: [0.24, 0.42]
            })
          }
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.blue,
          {
            transform: [
              {
                translateX: orbB.interpolate({
                  inputRange: [0, 1],
                  outputRange: [22, -28]
                })
              },
              {
                translateY: orbB.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, -24]
                })
              },
              {
                scale: orbB.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.98, 1.12]
                })
              }
            ],
            opacity: orbB.interpolate({
              inputRange: [0, 1],
              outputRange: [0.16, 0.3]
            })
          }
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.green,
          {
            transform: [
              {
                translateX: orbC.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, -18]
                })
              },
              {
                translateY: orbC.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 16]
                })
              },
              {
                scale: orbC.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.92, 1.08]
                })
              }
            ],
            opacity: orbC.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.22]
            })
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  orb: {
    position: "absolute",
    borderRadius: 999
  },
  orange: {
    width: 220,
    height: 220,
    left: -60,
    top: -10,
    backgroundColor: "rgba(255, 136, 90, 0.24)"
  },
  blue: {
    width: 260,
    height: 260,
    right: -120,
    top: 180,
    backgroundColor: "rgba(91, 176, 255, 0.18)"
  },
  green: {
    width: 180,
    height: 180,
    right: 12,
    top: 56,
    backgroundColor: "rgba(71, 224, 176, 0.12)"
  }
});
