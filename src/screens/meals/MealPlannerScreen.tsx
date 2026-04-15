import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Heart, Camera, WandSparkles, ScanSearch } from "lucide-react-native";

import { AnimatedScreen } from "@/components/AnimatedScreen";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { generateMealPlan } from "@/services/ai/aiService";
import type { MealPlan, PlanMode, UserProfile } from "@/types";
import { createMockMealPlan } from "@/utils/mockData";
import { formatCalories, formatMacro } from "@/utils/formatting";

export const MealPlannerScreen = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<any>();
  const profile: UserProfile = useAuthStore((state) => state.userProfile) ?? {
    age: "",
    weight: "",
    height: "",
    gender: "prefer-not",
    goal: "maintain",
    activityLevel: "moderate",
    dietaryPreferences: []
  };
  const favoritePlanIds = useAppStore((state) => state.favoritePlanIds);
  const toggleFavoritePlan = useAppStore((state) => state.toggleFavoritePlan);
  const [mode, setMode] = useState<PlanMode>("daily");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MealPlan>(() => createMockMealPlan(profile, "daily"));

  const refreshPlan = async () => {
    try {
      setLoading(true);
      const nextPlan = await generateMealPlan({
        profile,
        mode,
        request: mode === "daily" ? "Create a premium one day plan." : "Create a premium seven day plan."
      });
      setPlan(nextPlan);
    } catch (error) {
      Alert.alert("Meal planner", error instanceof Error ? error.message : "Nao foi possivel gerar um novo plano.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPlan().catch(() => undefined);
  }, [mode]);

  const isFavorite = favoritePlanIds.includes(plan.id);

  return (
    <AnimatedScreen>
      <AnimatedReveal delay={40}>
        <SectionHeader
          eyebrow="AI Meal Planner"
          title="Adaptive meal intelligence"
          subtitle="Daily and weekly plans with calories, macros, ingredients and cooking steps."
        />
      </AnimatedReveal>

      <AnimatedReveal delay={100}>
        <View style={styles.toggleRow}>
          {(["daily", "weekly"] as PlanMode[]).map((item) => {
            const active = item === mode;
            return (
              <Pressable key={item} onPress={() => setMode(item)}>
                <View
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: active ? theme.colors.primary : theme.colors.surfaceAlt
                    }
                  ]}
                >
                  <Text style={[styles.toggleLabel, { color: active ? "#FFF" : theme.colors.text }]}>{item === "daily" ? "Daily" : "Weekly"}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </AnimatedReveal>

      <AnimatedReveal delay={160}>
        <View style={styles.quickActions}>
          <Pressable onPress={() => navigation.navigate("Scanner")}>
            <View style={[styles.quickAction, { backgroundColor: theme.colors.surfaceAlt }]}>
              <Camera size={16} color={theme.colors.primary} />
              <Text style={[styles.quickActionLabel, { color: theme.colors.text }]}>Scan plate</Text>
            </View>
          </Pressable>
          <Pressable onPress={refreshPlan}>
            <View style={[styles.quickAction, { backgroundColor: theme.colors.surfaceAlt }]}>
              <ScanSearch size={16} color={theme.colors.secondary} />
              <Text style={[styles.quickActionLabel, { color: theme.colors.text }]}>Refresh plan</Text>
            </View>
          </Pressable>
        </View>
      </AnimatedReveal>

      <AnimatedReveal delay={220}>
        <GlassCard style={styles.planHero}>
          <LinearGradient colors={theme.gradients.hero as [string, string, ...string[]]} style={styles.planHeroGradient}>
            <View style={styles.rowBetween}>
              <View style={styles.stack}>
                <Text style={styles.planEyebrow}>{mode === "daily" ? "Daily protocol" : "Weekly protocol"}</Text>
                <Text style={styles.planTitleHero}>{plan.title}</Text>
                <Text style={styles.planCopyHero}>{plan.rationale}</Text>
              </View>
              <Pressable onPress={() => toggleFavoritePlan(plan.id)}>
                <Heart size={22} color="#FFF" fill={isFavorite ? "#FFF" : "transparent"} />
              </Pressable>
            </View>

            <View style={styles.summaryRow}>
              <Summary label="Calories" value={formatCalories(plan.summary.calories)} inverse />
              <Summary label="Protein" value={formatMacro(plan.summary.protein)} inverse />
              <Summary label="Carbs" value={formatMacro(plan.summary.carbs)} inverse />
              <Summary label="Fats" value={formatMacro(plan.summary.fats)} inverse />
            </View>
          </LinearGradient>
        </GlassCard>
      </AnimatedReveal>

      <AnimatedReveal delay={280}>
        <GradientButton label="Regenerate with variation" loading={loading} onPress={refreshPlan} />
      </AnimatedReveal>

      {plan.meals.map((meal, index) => (
        <AnimatedReveal key={meal.id} delay={340 + index * 60}>
          <GlassCard style={styles.mealCard}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={[styles.mealTitle, { color: theme.colors.text }]}>{meal.title}</Text>
                <Text style={[styles.mealTime, { color: theme.colors.textMuted }]}>
                  {meal.time} • {meal.calories} kcal
                </Text>
              </View>
              <View style={[styles.iconBadge, { backgroundColor: theme.colors.surfaceAlt }]}>
                <WandSparkles size={16} color={theme.colors.primary} />
              </View>
            </View>
            <Text style={[styles.blockLabel, { color: theme.colors.textMuted }]}>Ingredients</Text>
            <Text style={[styles.planCopy, { color: theme.colors.text }]}>{meal.ingredients.join(" • ")}</Text>
            <Text style={[styles.blockLabel, { color: theme.colors.textMuted }]}>Cooking steps</Text>
            <Text style={[styles.planCopy, { color: theme.colors.text }]}>{meal.cookingSteps.join(" ")}</Text>
          </GlassCard>
        </AnimatedReveal>
      ))}
    </AnimatedScreen>
  );
};

const Summary = ({ label, value, inverse }: { label: string; value: string; inverse?: boolean }) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryLabel, { color: inverse ? "rgba(255,255,255,0.74)" : theme.colors.textMuted }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: inverse ? "#FFF" : theme.colors.text }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: "row",
    gap: 10
  },
  toggle: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16
  },
  quickActions: {
    flexDirection: "row",
    gap: 10
  },
  quickAction: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: "700"
  },
  planHero: {
    padding: 0,
    overflow: "hidden"
  },
  planHeroGradient: {
    padding: 20
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "800"
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  stack: {
    flex: 1,
    gap: 8
  },
  planEyebrow: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.9
  },
  planTitle: {
    fontSize: 22,
    fontWeight: "800"
  },
  planTitleHero: {
    color: "#FFF",
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "900"
  },
  planCopy: {
    fontSize: 14,
    lineHeight: 22
  },
  planCopyHero: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    lineHeight: 22
  },
  summaryRow: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14
  },
  summaryItem: {
    minWidth: "45%",
    gap: 4
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "700"
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "800"
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "800"
  },
  mealCard: {
    borderRadius: 30
  },
  mealTime: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600"
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  blockLabel: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8
  }
});
