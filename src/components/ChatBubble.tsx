import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

export const ChatBubble = ({ role, text }: { role: "user" | "assistant"; text: string }) => {
  const { theme } = useAppTheme();
  const isUser = role === "user";

  return (
    <View
      style={[
        styles.wrapper,
        {
          alignSelf: isUser ? "flex-end" : "flex-start",
          backgroundColor: isUser ? theme.colors.primary : theme.colors.surfaceAlt
        }
      ]}
    >
      <Text style={[styles.text, { color: isUser ? "#FFF" : theme.colors.text }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: "88%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 22
  },
  text: {
    fontSize: 15,
    lineHeight: 22
  }
});
