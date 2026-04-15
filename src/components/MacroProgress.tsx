import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

export const MacroProgress = ({
  label,
  value,
  target,
  color
}: {
  label: string;
  value: number;
  target: number;
  color: string;
}) => {
  const { theme } = useAppTheme();
  const progress = Math.min(value / target, 1);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>{value}/{target}g</Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.colors.overlay }]}>
        <View style={[styles.fill, { backgroundColor: color, width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 8
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  label: {
    fontSize: 13,
    fontWeight: "700"
  },
  track: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: 999
  }
});
