import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, ViewStyle } from "react-native";

export const AnimatedReveal = ({
  children,
  delay = 0,
  distance = 18,
  duration = 520,
  style
}: PropsWithChildren<{ delay?: number; distance?: number; duration?: number; style?: StyleProp<ViewStyle> }>) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      })
    ]);

    animation.start();

    return () => animation.stop();
  }, [delay, distance, duration, opacity, translateY]);

  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
};
