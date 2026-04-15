import { StyleSheet, Text, View } from "react-native";
import { Sparkles } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

export const DemoModeBadge = ({ label = "Demo mode active" }: { label?: string }) => {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.colors.surfaceAlt,
          borderColor: theme.colors.border
        }
      ]}
    >
      <Sparkles size={14} color={theme.colors.primary} />
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.2
  }
});
