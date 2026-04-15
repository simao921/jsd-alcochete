import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

export const SectionHeader = ({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      {eyebrow ? <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>{eyebrow}</Text> : null}
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 6
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800"
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22
  }
});
