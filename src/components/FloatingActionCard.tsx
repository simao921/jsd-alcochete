import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

export const FloatingActionCard = ({
  title,
  subtitle,
  icon,
  onPress
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  onPress: () => void;
}) => {
  const { theme } = useAppTheme();

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          style={[styles.card, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}
        >
          <View style={[styles.iconWrap, { backgroundColor: theme.colors.overlay }]}>{icon}</View>
          <View style={styles.textWrap}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: 90,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  textWrap: {
    flex: 1,
    gap: 4
  },
  title: {
    fontSize: 15,
    fontWeight: "800"
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18
  }
});
