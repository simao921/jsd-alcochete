import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Polyline } from "react-native-svg";

import { AnimatedScreen } from "@/components/AnimatedScreen";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import { mockProgress } from "@/utils/mockData";
import { loadWeightLog, saveWeightLog } from "@/services/tracking/trackingService";

export const ProgressScreen = () => {
  const { theme } = useAppTheme();
  const [weightLog, setWeightLog] = useState(mockProgress);
  const [draftWeight, setDraftWeight] = useState("");

  useEffect(() => {
    loadWeightLog(mockProgress).then(setWeightLog);
  }, []);

  const addWeightEntry = async () => {
    const value = Number(draftWeight.replace(",", "."));
    if (!value) {
      return;
    }

    const next = [...weightLog, { label: `W${weightLog.length + 1}`, value }].slice(-8);
    setWeightLog(next);
    setDraftWeight("");
    await saveWeightLog(next);
  };

  const points = weightLog
    .map((point, index) => `${index * 65 + 10},${120 - (point.value - 81.5) * 58}`)
    .join(" ");
  const startWeight = weightLog[0]?.value ?? 0;
  const currentWeight = weightLog[weightLog.length - 1]?.value ?? 0;
  const delta = (currentWeight - startWeight).toFixed(1);
  const bestWeek = useMemo(
    () => weightLog.reduce((best, item) => (item.value < best.value ? item : best), weightLog[0] ?? { label: "W1", value: 0 }),
    [weightLog]
  );

  return (
    <AnimatedScreen>
      <AnimatedReveal delay={40}>
        <SectionHeader
          eyebrow="Progress"
          title="Body and habit trends"
          subtitle="Weekly weight data, recovery habits and visual checkpoints for real users."
        />
      </AnimatedReveal>

      <AnimatedReveal delay={110}>
        <GlassCard>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Quick check-in</Text>
          <View style={styles.entryRow}>
            <TextInput
              value={draftWeight}
              onChangeText={setDraftWeight}
              placeholder="New weight in kg"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="decimal-pad"
              style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.surfaceAlt }]}
            />
            <Pressable onPress={addWeightEntry}>
              <View style={[styles.addButton, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.addButtonLabel}>Save</Text>
              </View>
            </Pressable>
          </View>
        </GlassCard>
      </AnimatedReveal>

      <AnimatedReveal delay={170}>
        <GlassCard>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Weight trend</Text>
          <Svg width="100%" height={140} viewBox="0 0 280 140">
            <Polyline points={points} fill="none" stroke={theme.colors.primary} strokeWidth={4} strokeLinecap="round" />
          </Svg>
          <View style={styles.labels}>
            {weightLog.map((point) => (
              <View key={point.label} style={styles.labelItem}>
                <Text style={[styles.axisLabel, { color: theme.colors.textMuted }]}>{point.label}</Text>
                <Text style={[styles.axisValue, { color: theme.colors.text }]}>{point.value}kg</Text>
              </View>
            ))}
          </View>
        </GlassCard>
      </AnimatedReveal>

      <AnimatedReveal delay={230}>
        <GlassCard>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Trend summary</Text>
          <View style={styles.habitRow}>
            <Habit label="Current" value={`${currentWeight}kg`} />
            <Habit label="Change" value={`${delta}kg`} />
            <Habit label="Best" value={`${bestWeek.value}kg`} />
          </View>
        </GlassCard>
      </AnimatedReveal>

      <AnimatedReveal delay={290}>
        <GlassCard>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Before / after vault</Text>
          <Text style={[styles.copy, { color: theme.colors.textMuted }]}>
            Production flow prepared for secure progress photos, body measurements and month-over-month comparisons.
          </Text>
          <View style={styles.photoRow}>
            <View style={[styles.photoPlaceholder, { backgroundColor: theme.colors.surfaceAlt }]} />
            <View style={[styles.photoPlaceholder, { backgroundColor: theme.colors.surfaceAlt }]} />
          </View>
        </GlassCard>
      </AnimatedReveal>

      <AnimatedReveal delay={350}>
        <GlassCard>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Habit consistency</Text>
          <View style={styles.habitRow}>
            <Habit label="Water" value="6/8" />
            <Habit label="Sleep" value="7.4h" />
            <Habit label="Steps" value="8.4k" />
          </View>
        </GlassCard>
      </AnimatedReveal>
    </AnimatedScreen>
  );
};

const Habit = ({ label, value }: { label: string; value: string }) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.habitCard}>
      <Text style={[styles.axisLabel, { color: theme.colors.textMuted }]}>{label}</Text>
      <Text style={[styles.axisValue, { color: theme.colors.text }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 20,
    fontWeight: "800"
  },
  entryRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10
  },
  input: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: "600"
  },
  addButton: {
    minWidth: 82,
    minHeight: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  addButtonLabel: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "800"
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  labelItem: {
    alignItems: "center",
    gap: 4
  },
  axisLabel: {
    fontSize: 12,
    fontWeight: "700"
  },
  axisValue: {
    fontSize: 14,
    fontWeight: "800"
  },
  copy: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21
  },
  photoRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12
  },
  photoPlaceholder: {
    flex: 1,
    height: 180,
    borderRadius: 22
  },
  habitRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 12
  },
  habitCard: {
    flex: 1,
    gap: 6
  }
});
