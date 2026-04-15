import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Send, Sparkles } from "lucide-react-native";

import { AnimatedReveal } from "@/components/AnimatedReveal";
import { ChatBubble } from "@/components/ChatBubble";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { AnimatedScreen } from "@/components/AnimatedScreen";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/store/authStore";
import { createMessage, streamAssistantReply } from "@/services/ai/aiService";
import { starterMessages, starterPrompts } from "@/utils/mockData";
import type { UserProfile } from "@/types";

export const ChatAssistantScreen = () => {
  const { theme, isDark } = useAppTheme();
  const profile: UserProfile = useAuthStore((state) => state.userProfile) ?? {
    age: "",
    weight: "",
    height: "",
    gender: "prefer-not",
    goal: "maintain",
    activityLevel: "moderate",
    dietaryPreferences: []
  };
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(starterMessages);

  const handleSend = async (prompt?: string) => {
    const content = (prompt ?? input).trim();
    if (!content || loading) {
      return;
    }

    const userMessage = createMessage("user", content);
    const assistantMessage = createMessage("assistant", "");
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput("");
    setLoading(true);

    try {
      await streamAssistantReply({
        profile,
        message: content,
        conversation: messages.map((entry) => ({ role: entry.role, text: entry.text })),
        onChunk: (partial) =>
          setMessages((current) =>
            current.map((message) => (message.id === assistantMessage.id ? { ...message, text: partial } : message))
          )
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <AnimatedScreen style={{ paddingBottom: 24 }}>
        <AnimatedReveal delay={40}>
          <SectionHeader
            eyebrow="AI Coach"
            title="Context-aware conversation"
            subtitle="Fast nutrition and workout answers that know your goal, preferences and activity level."
          />
        </AnimatedReveal>

        <AnimatedReveal delay={120}>
          <GlassCard style={styles.heroCard}>
            <LinearGradient colors={theme.gradients.dusk as [string, string, ...string[]]} style={styles.heroGradient}>
              <Text style={styles.heroEyebrow}>Live nutrition reasoning</Text>
              <Text style={styles.heroTitle}>Ask for meals, recovery, cravings, supplements or training strategy.</Text>
            </LinearGradient>
          </GlassCard>
        </AnimatedReveal>

        <AnimatedReveal delay={180}>
          <ScrollView contentContainerStyle={styles.chatStack} showsVerticalScrollIndicator={false}>
            {messages.map((message) => (
              <ChatBubble key={message.id} role={message.role} text={message.text || "Thinking..."} />
            ))}
          </ScrollView>
        </AnimatedReveal>

        <AnimatedReveal delay={240}>
          <View style={styles.promptRow}>
            {starterPrompts.map((prompt) => (
              <Pressable key={prompt} onPress={() => handleSend(prompt)}>
                <View style={[styles.promptChip, { backgroundColor: theme.colors.surfaceAlt }]}>
                  <Sparkles size={14} color={theme.colors.primary} />
                  <Text style={[styles.promptLabel, { color: theme.colors.text }]}>{prompt}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={300}>
          <GlassCard>
            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor: isDark ? theme.colors.surfaceAlt : "#FFF"
                }
              ]}
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ask for meal ideas, macros, supplements, workouts..."
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.input, { color: theme.colors.text }]}
                multiline
              />
              <Pressable onPress={() => handleSend()}>
                <View style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}>
                  <Send size={18} color="#FFF" />
                </View>
              </Pressable>
            </View>
          </GlassCard>
        </AnimatedReveal>
      </AnimatedScreen>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    padding: 0,
    overflow: "hidden"
  },
  heroGradient: {
    padding: 18,
    gap: 8
  },
  heroEyebrow: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: "#FFF",
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800"
  },
  chatStack: {
    gap: 12
  },
  promptRow: {
    gap: 10
  },
  promptChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18
  },
  promptLabel: {
    fontSize: 13,
    fontWeight: "700"
  },
  inputWrap: {
    minHeight: 72,
    borderRadius: 22,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12
  },
  input: {
    flex: 1,
    minHeight: 46,
    fontSize: 15
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  }
});
