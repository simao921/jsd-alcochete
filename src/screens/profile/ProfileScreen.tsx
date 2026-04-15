import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Bell, Crown, Languages, LogOut, MoonStar } from "lucide-react-native";

import { AnimatedScreen } from "@/components/AnimatedScreen";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { SectionHeader } from "@/components/SectionHeader";
import { DemoModeBadge } from "@/components/DemoModeBadge";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { signOutCurrentUser } from "@/services/auth/authService";

export const ProfileScreen = () => {
  const { theme } = useAppTheme();
  const profile = useAuthStore((state) => state.userProfile);
  const authMode = useAuthStore((state) => state.authMode);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const xp = useAppStore((state) => state.xp);
  const streak = useAppStore((state) => state.streak);

  return (
    <AnimatedScreen>
      <AnimatedReveal delay={40}>
        <SectionHeader
          eyebrow="Profile"
          title={profile?.fullName || "NutriAI member"}
          subtitle={
            authMode === "demo"
              ? "Demo account with premium surfaces, seeded metrics and safe mock AI responses."
              : "Account controls, premium status, reminders and appearance preferences."
          }
        />
      </AnimatedReveal>

      {authMode === "demo" ? (
        <AnimatedReveal delay={90}>
          <DemoModeBadge label="Demo account" />
        </AnimatedReveal>
      ) : null}

      <AnimatedReveal delay={140}>
        <GlassCard>
          <View style={styles.avatar} />
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {profile?.email || (authMode === "demo" ? "demo@nutriai.pro" : "Connect your production auth providers")}
          </Text>
          <Text style={[styles.copy, { color: theme.colors.textMuted }]}>
            Goal: {profile?.goal ?? "maintain"} • Activity: {profile?.activityLevel ?? "moderate"} • Preferences: {profile?.dietaryPreferences.join(", ") || "none"}
          </Text>
          <View style={styles.statsRow}>
            <ProfileStat label="XP" value={xp.toString()} />
            <ProfileStat label="Streak" value={`${streak}d`} />
            <ProfileStat label="Goal" value={profile?.goal ?? "maintain"} />
          </View>
        </GlassCard>
      </AnimatedReveal>

      <AnimatedReveal delay={200}>
        <GlassCard>
          <SettingRow icon={<Crown size={18} color={theme.colors.primary} />} label="Premium tier" value="Unlimited AI + analytics" />
          <SettingRow icon={<Bell size={18} color={theme.colors.secondary} />} label="Smart reminders" value="Meals, water and workouts" />
          <SettingRow icon={<MoonStar size={18} color={theme.colors.textMuted} />} label="Theme mode" value="Cycle appearance" onPress={toggleTheme} />
        </GlassCard>
      </AnimatedReveal>

      <AnimatedReveal delay={260}>
        <GlassCard>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Languages size={18} color={theme.colors.accent} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Language</Text>
            </View>
            <View style={styles.segmentRow}>
              <Segment label="PT" active={language === "pt"} onPress={() => setLanguage("pt")} />
              <Segment label="EN" active={language === "en"} onPress={() => setLanguage("en")} />
            </View>
          </View>
        </GlassCard>
      </AnimatedReveal>

      <AnimatedReveal delay={320}>
        <GradientButton label={authMode === "demo" ? "Exit demo" : "Sign out"} onPress={() => signOutCurrentUser()} />
      </AnimatedReveal>
      <AnimatedReveal delay={380}>
        <View style={styles.signoutHint}>
          <LogOut size={16} color={theme.colors.textMuted} />
          <Text style={[styles.copy, { color: theme.colors.textMuted }]}>Logout keeps onboarding data cached for a smoother next sign-in.</Text>
        </View>
      </AnimatedReveal>
    </AnimatedScreen>
  );
};

const Segment = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => {
  const { theme } = useAppTheme();

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.segment, { backgroundColor: active ? theme.colors.primary : theme.colors.surfaceAlt }]}>
        <Text style={[styles.segmentLabel, { color: active ? "#FFF" : theme.colors.text }]}>{label}</Text>
      </View>
    </Pressable>
  );
};

const ProfileStat = ({ label, value }: { label: string; value: string }) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.profileStat, { backgroundColor: theme.colors.surfaceAlt }]}>
      <Text style={[styles.settingValue, { color: theme.colors.textMuted }]}>{label}</Text>
      <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{value}</Text>
    </View>
  );
};

const SettingRow = ({
  icon,
  label,
  value,
  onPress
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        {icon}
        <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{label}</Text>
      </View>
      <Text onPress={onPress} style={[styles.settingValue, { color: theme.colors.textMuted }]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 26,
    backgroundColor: "rgba(255, 136, 90, 0.2)",
    marginBottom: 16
  },
  name: {
    fontSize: 20,
    fontWeight: "800"
  },
  copy: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21
  },
  statsRow: {
    marginTop: 18,
    flexDirection: "row",
    gap: 10
  },
  profileStat: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    gap: 6
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "700"
  },
  settingValue: {
    fontSize: 13,
    fontWeight: "600"
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8
  },
  segment: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  segmentLabel: {
    fontSize: 12,
    fontWeight: "800"
  },
  signoutHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  }
});
