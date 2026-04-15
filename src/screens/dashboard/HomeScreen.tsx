import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { ArrowRight, Droplets, MoonStar, Footprints, Sparkles, ScanSearch, BrainCircuit, Trophy, Zap } from "lucide-react-native";

import { AnimatedScreen } from "@/components/AnimatedScreen";
import { GlassCard } from "@/components/GlassCard";
import { MacroProgress } from "@/components/MacroProgress";
import { MetricRing } from "@/components/MetricRing";
import { SectionHeader } from "@/components/SectionHeader";
import { DemoModeBadge } from "@/components/DemoModeBadge";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { loadDashboardSnapshot, saveDashboardSnapshot } from "@/services/tracking/trackingService";
import { mockDashboard } from "@/utils/mockData";
import type { DashboardSnapshot } from "@/types";
import { formatCalories } from "@/utils/formatting";
import { FloatingActionCard } from "@/components/FloatingActionCard";

export const HomeScreen = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<any>();
  const userProfile = useAuthStore((state) => state.userProfile);
  const authMode = useAuthStore((state) => state.authMode);
  const hydrationMl = useAppStore((state) => state.hydrationMl);
  const addWater = useAppStore((state) => state.addWater);
  const streak = useAppStore((state) => state.streak);
  const xp = useAppStore((state) => state.xp);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(mockDashboard);

  useEffect(() => {
    loadDashboardSnapshot({ ...mockDashboard, hydrationMl, streak, xp }).then(setSnapshot);
  }, [hydrationMl, streak, xp]);

  useEffect(() => {
    saveDashboardSnapshot({ ...snapshot, hydrationMl, streak, xp }).catch(() => undefined);
  }, [hydrationMl, snapshot, streak, xp]);

  return (
    <AnimatedScreen>
      <AnimatedReveal delay={40}>
        <SectionHeader
          eyebrow={authMode === "demo" ? "Daily command center • demo" : "Daily command center"}
          title={`Hi ${userProfile?.fullName?.split(" ")[0] || "Athlete"}`}
          subtitle="Your adaptive dashboard blends calories, macros, habits and momentum in one premium glance."
        />
      </AnimatedReveal>

      {authMode === "demo" ? (
        <AnimatedReveal delay={100}>
          <DemoModeBadge label="Premium demo profile loaded" />
        </AnimatedReveal>
      ) : null}

      <AnimatedReveal delay={140}>
        <GlassCard style={styles.heroCard}>
          <LinearGradient colors={theme.gradients.dusk as [string, string, ...string[]]} style={styles.heroGradient}>
            <View style={styles.heroTop}>
              <MetricRing label="kcal left" value={snapshot.goalCalories - snapshot.consumedCalories} total={snapshot.goalCalories} />
              <View style={styles.heroTextBlock}>
                <Text style={[styles.heroCaption, { color: "rgba(255,255,255,0.68)" }]}>Today</Text>
                <Text style={[styles.heroValue, { color: "#FFF" }]}>{formatCalories(snapshot.consumedCalories)}</Text>
                <Text style={[styles.heroSubtext, { color: "rgba(255,255,255,0.76)" }]}>
                  Consumed of {formatCalories(snapshot.goalCalories)}
                </Text>
              </View>
            </View>

            <View style={styles.heroMetaRow}>
              <HeroChip icon={<Zap size={14} color="#FFF" />} label={`${Math.round((snapshot.consumedCalories / snapshot.goalCalories) * 100)}% target hit`} />
              <HeroChip icon={<Trophy size={14} color="#FFF" />} label={`${streak} day streak`} />
            </View>

            <View style={styles.macroStack}>
              <MacroProgress label="Protein" value={snapshot.macros.protein} target={155} color={theme.colors.secondary} />
              <MacroProgress label="Carbs" value={snapshot.macros.carbs} target={210} color={theme.colors.accent} />
              <MacroProgress label="Fats" value={snapshot.macros.fats} target={70} color={theme.colors.primary} />
            </View>
          </LinearGradient>
        </GlassCard>
      </AnimatedReveal>

      <AnimatedReveal delay={200}>
        <View style={styles.featureStack}>
          <FloatingActionCard
            title="Camera meal scanner"
            subtitle="Capture a plate and estimate calories and macros in seconds."
            icon={<ScanSearch size={20} color={theme.colors.primary} />}
            onPress={() => navigation.navigate("Scanner")}
          />
          <FloatingActionCard
            title="Adaptive AI coaching"
            subtitle="Streaming guidance for meals, recovery, cravings and training decisions."
            icon={<BrainCircuit size={20} color={theme.colors.secondary} />}
            onPress={() => navigation.navigate("Chat")}
          />
        </View>
      </AnimatedReveal>

      <AnimatedReveal delay={260}>
        <View style={styles.row}>
          <MiniStat icon={<Droplets size={18} color={theme.colors.secondary} />} label="Hydration" value={`${hydrationMl} ml`} />
          <MiniStat icon={<Footprints size={18} color={theme.colors.accent} />} label="Steps" value={snapshot.stepCount.toString()} />
          <MiniStat icon={<MoonStar size={18} color={theme.colors.primary} />} label="Sleep" value={`${snapshot.sleepHours} h`} />
        </View>
      </AnimatedReveal>

      <AnimatedReveal delay={300}>
        <GlassCard>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Quick actions</Text>
            <Text style={[styles.cardBadge, { color: theme.colors.secondary }]}>Daily momentum</Text>
          </View>
          <View style={styles.actionRow}>
            <ActionPill label="+250ml water" onPress={() => addWater(250)} />
            <ActionPill label="+500ml water" onPress={() => addWater(500)} />
            <ActionPill label="Open scanner" onPress={() => navigation.navigate("Scanner")} />
          </View>
        </GlassCard>
      </AnimatedReveal>

      <AnimatedReveal delay={360}>
        <GlassCard style={styles.highlightCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Momentum engine</Text>
            <Text style={[styles.cardBadge, { color: theme.colors.primary }]}>{streak} day streak</Text>
          </View>
          <Text style={[styles.copy, { color: theme.colors.textMuted }]}>
            You are stacking consistency. Complete one more workout or hydration goal to push your XP multiplier.
          </Text>
          <View style={styles.inlineMetrics}>
            <Text style={[styles.metricValue, { color: theme.colors.text }]}>{xp} XP</Text>
            <Text style={[styles.metricHint, { color: theme.colors.textMuted }]}>Level 7 nutrition discipline</Text>
          </View>
        </GlassCard>
      </AnimatedReveal>

      <AnimatedReveal delay={420}>
        <GlassCard>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Smart calorie tracker</Text>
            <Text style={[styles.cardBadge, { color: theme.colors.secondary }]}>AI-ready</Text>
          </View>
          <Text style={[styles.copy, { color: theme.colors.textMuted }]}>
            Add meals manually, search a food database, scan barcode or estimate a plate with the camera pipeline.
          </Text>
          <View style={styles.actionRow}>
            <ActionPill label="Manual add" />
            <ActionPill label="Food search" />
            <ActionPill label="Scan meal" />
          </View>
        </GlassCard>
      </AnimatedReveal>

      <AnimatedReveal delay={480}>
        <Pressable onPress={() => navigation.navigate("Progress")}>
          {({ pressed }) => (
            <GlassCard style={{ opacity: pressed ? 0.9 : 1 }}>
              <View style={styles.cardHeader}>
                <View style={styles.inlineMetrics}>
                  <Sparkles size={18} color={theme.colors.primary} />
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Open body progress</Text>
                </View>
                <ArrowRight size={18} color={theme.colors.textMuted} />
              </View>
              <Text style={[styles.copy, { color: theme.colors.textMuted }]}>
                Weight trends, before and after placeholders, recovery metrics and weekly adherence.
              </Text>
            </GlassCard>
          )}
        </Pressable>
      </AnimatedReveal>
    </AnimatedScreen>
  );
};

const HeroChip = ({ icon, label }: { icon: ReactNode; label: string }) => (
  <View style={styles.heroChip}>
    {icon}
    <Text style={styles.heroChipLabel}>{label}</Text>
  </View>
);

const MiniStat = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => {
  const { theme } = useAppTheme();

  return (
    <GlassCard style={styles.miniStat}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={[styles.miniLabel, { color: theme.colors.textMuted }]}>{label}</Text>
      <Text style={[styles.miniValue, { color: theme.colors.text }]}>{value}</Text>
    </GlassCard>
  );
};

const ActionPill = ({ label, onPress }: { label: string; onPress?: () => void }) => {
  const { theme } = useAppTheme();

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={[styles.actionPill, { backgroundColor: theme.colors.surfaceAlt, opacity: pressed ? 0.82 : 1 }]}>
          <Text style={[styles.actionLabel, { color: theme.colors.text }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    padding: 0,
    overflow: "hidden"
  },
  heroGradient: {
    gap: 20,
    padding: 20
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18
  },
  heroTextBlock: {
    flex: 1,
    gap: 4
  },
  heroCaption: {
    fontSize: 13,
    fontWeight: "700"
  },
  heroValue: {
    fontSize: 34,
    fontWeight: "900"
  },
  heroSubtext: {
    fontSize: 14
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  heroChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)"
  },
  heroChipLabel: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800"
  },
  macroStack: {
    gap: 14
  },
  row: {
    flexDirection: "row",
    gap: 12
  },
  featureStack: {
    gap: 12
  },
  miniStat: {
    flex: 1,
    alignItems: "flex-start",
    gap: 10
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: "700"
  },
  miniValue: {
    fontSize: 18,
    fontWeight: "800"
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800"
  },
  highlightCard: {
    borderRadius: 30
  },
  cardBadge: {
    fontSize: 13,
    fontWeight: "800"
  },
  copy: {
    fontSize: 14,
    lineHeight: 21
  },
  inlineMetrics: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  actionRow: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  actionPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "700"
  },
  metricValue: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: "800"
  },
  metricHint: {
    marginTop: 18,
    fontSize: 13,
    fontWeight: "600"
  }
});
