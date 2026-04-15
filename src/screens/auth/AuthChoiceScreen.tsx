import type { ReactNode } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import { useState } from "react";
import { Mail, Lock, Chrome, Facebook, Apple } from "lucide-react-native";

import { AnimatedScreen } from "@/components/AnimatedScreen";
import { GradientButton } from "@/components/GradientButton";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import { registerWithEmail, signInWithEmail } from "@/services/auth/authService";
import { signInWithApple, signInWithFacebook, signInWithGoogle } from "@/services/auth/socialAuth";
import { firebaseReady } from "@/services/firebase/config";
import { useAuthStore } from "@/store/authStore";
import { tapFeedback } from "@/utils/haptics";

export const AuthChoiceScreen = () => {
  const { theme, isDark } = useAppTheme();
  const enterDemoMode = useAuthStore((state) => state.enterDemoMode);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const runAuthAction = async (action: () => unknown | Promise<unknown>, key: string) => {
    try {
      setLoading(key);
      tapFeedback();
      await action();
    } catch (error) {
      Alert.alert("Authentication", error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <AnimatedScreen>
      <SectionHeader
        eyebrow="Secure Access"
        title={firebaseReady ? "Sign in with real providers" : "Enter the premium live demo"}
        subtitle={
          firebaseReady
            ? "Firebase-backed auth is wired for email, Google, Facebook and Apple."
            : "As chaves reais ainda nao estao ligadas, por isso podes entrar num demo premium com dados e IA mock prontos."
        }
      />

      {firebaseReady ? (
        <>
          <GlassCard>
            <View style={styles.stack}>
              <Field
                icon={<Mail size={18} color={theme.colors.textMuted} />}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                secure={false}
                isDark={isDark}
                theme={theme}
              />
              <Field
                icon={<Lock size={18} color={theme.colors.textMuted} />}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secure
                isDark={isDark}
                theme={theme}
              />

              <GradientButton
                label={isRegisterMode ? "Create account" : "Continue with email"}
                loading={loading === "email"}
                onPress={() =>
                  runAuthAction(
                    () => (isRegisterMode ? registerWithEmail(email, password) : signInWithEmail(email, password)),
                    "email"
                  )
                }
              />

              <Pressable onPress={() => setIsRegisterMode((value) => !value)}>
                <Text style={[styles.switchText, { color: theme.colors.textMuted }]}>
                  {isRegisterMode ? "Already have an account? Sign in" : "Need an account? Create one"}
                </Text>
              </Pressable>
            </View>
          </GlassCard>

          <View style={styles.socialStack}>
            <SocialButton
              label="Continue with Google"
              icon={<Chrome size={18} color={theme.colors.text} />}
              onPress={() => runAuthAction(signInWithGoogle, "google")}
            />
            <SocialButton
              label="Continue with Facebook"
              icon={<Facebook size={18} color={theme.colors.text} />}
              onPress={() => runAuthAction(signInWithFacebook, "facebook")}
            />
            {Platform.OS === "ios" ? (
              <SocialButton
                label="Continue with Apple"
                icon={<Apple size={18} color={theme.colors.text} />}
                onPress={() => runAuthAction(signInWithApple, "apple")}
              />
            ) : null}
          </View>
        </>
      ) : (
        <GlassCard>
          <View style={styles.stack}>
            <Text style={[styles.demoTitle, { color: theme.colors.text }]}>Everything unlocked for preview</Text>
            <Text style={[styles.demoCopy, { color: theme.colors.textMuted }]}>
              Vais entrar com um perfil premium mock, métricas preenchidas, planos de refeição, chat contextual e scanner pronto para testar a experiência toda.
            </Text>
            <GradientButton label="Explore demo experience" loading={loading === "demo"} onPress={() => runAuthAction(enterDemoMode, "demo")} />
          </View>
        </GlassCard>
      )}

      <Text style={[styles.footer, { color: theme.colors.textMuted }]}>
        {firebaseReady
          ? "Para Google e Facebook nativos, usa development build ou build de producao. No Expo Go, estes fluxos podem nao abrir."
          : "O modo demo desbloqueia onboarding, dashboard, meal planner, scanner, chat e progresso sem precisares de credenciais reais."}
      </Text>
    </AnimatedScreen>
  );
};

const Field = ({
  icon,
  value,
  onChangeText,
  placeholder,
  secure,
  isDark,
  theme
}: {
  icon: ReactNode;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secure: boolean;
  isDark: boolean;
  theme: ReturnType<typeof useAppTheme>["theme"];
}) => (
  <View
    style={[
      styles.fieldRow,
      {
        backgroundColor: isDark ? theme.colors.surfaceAlt : "#FFF"
      }
    ]}
  >
    {icon}
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textMuted}
      secureTextEntry={secure}
      autoCapitalize="none"
      style={[styles.input, { color: theme.colors.text }]}
    />
  </View>
);

const SocialButton = ({
  label,
  icon,
  onPress
}: {
  label: string;
  icon: ReactNode;
  onPress: () => void;
}) => {
  const { theme, isDark } = useAppTheme();

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          style={[
            styles.socialButton,
            {
              backgroundColor: isDark ? theme.colors.surface : "#FFF",
              borderColor: theme.colors.border,
              transform: [{ scale: pressed ? 0.985 : 1 }]
            }
          ]}
        >
          {icon}
          <Text style={[styles.socialLabel, { color: theme.colors.text }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  stack: {
    gap: 14
  },
  fieldRow: {
    minHeight: 58,
    borderRadius: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600"
  },
  switchText: {
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600"
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: "800"
  },
  demoCopy: {
    fontSize: 14,
    lineHeight: 21
  },
  socialStack: {
    gap: 12
  },
  socialButton: {
    minHeight: 58,
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  socialLabel: {
    fontSize: 15,
    fontWeight: "700"
  },
  footer: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center"
  }
});
