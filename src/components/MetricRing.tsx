import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useAppTheme } from "@/hooks/useAppTheme";

const size = 126;
const stroke = 12;
const radius = (size - stroke) / 2;
const circumference = radius * 2 * Math.PI;

export const MetricRing = ({ label, value, total }: { label: string; value: number; total: number }) => {
  const { theme } = useAppTheme();
  const progress = Math.min(value / total, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={theme.colors.overlay} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.primary}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: size,
    height: size,
    alignItems: "center",
    justifyContent: "center"
  },
  center: {
    position: "absolute",
    alignItems: "center",
    gap: 2
  },
  value: {
    fontSize: 28,
    fontWeight: "800"
  },
  label: {
    fontSize: 12,
    fontWeight: "600"
  }
});
