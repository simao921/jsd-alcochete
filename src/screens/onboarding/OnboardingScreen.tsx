import { useMemo } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useAuthStore } from "@/store/authStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { activityLevels, dietPreferences, genders, goals, onboardingSlides } from "@/utils/constants";
import { AnimatedScreen } from "@/components/AnimatedScreen";
import { GradientButton } from "@/components/GradientButton";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppTheme } from "@/hooks/useAppTheme";

export const OnboardingScreen = () => {
  const { theme } = useAppTheme();
  const heroGradient = theme.gradients.hero as [string, string, ...string[]];
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const { step, setStep, updateField, togglePreference, reset, ...values } = useOnboardingStore();

  const steps = useMemo(
    () => [
      {
        title: onboardingSlides[0].title,
        subtitle: onboardingSlides[0].subtitle,
        content: (
          <LinearGradient colors={heroGradient} style={styles.heroCard}>
            <Text style={styles.heroMetric}>AI nutrition, workouts and habits</Text>
            <Text style={styles.heroText}>An onboarding flow that calibrates your meal plans, coach answers and daily streak system from day one.</Text>
          </LinearGradient>
        )
      },
      {
        title: "Let's map your body",
        subtitle: "These details personalize calories, protein targets and progress projections.",
        content: (
          <View style={styles.formGrid}>
            <Field label="Age" value={values.age} onChangeText={(value) => updateField("age", value)} placeholder="27" />
            <Field label="Weight (kg)" value={values.weight} onChangeText={(value) => updateField("weight", value)} placeholder="78" />
            <Field label="Height (cm)" value={values.height} onChangeText={(value) => updateField("height", value)} placeholder="178" />
          </View>
        )
      },
      {
        title: "Goal and lifestyle",
        subtitle: "The AI will tune macros and workout style around this baseline.",
        content: (
          <View style={styles.stack}>
            <ChoiceGrid
              title="Goal"
              items={goals.map((item) => item.label)}
              selected={goals.find((item) => item.value === values.goal)?.label}
              onSelect={(label) => updateField("goal", goals.find((item) => item.label === label)?.value ?? "maintain")}
            />
            <ChoiceGrid
              title="Activity"
              items={activityLevels.map((item) => item.label)}
              selected={activityLevels.find((item) => item.value === values.activityLevel)?.label}
              onSelect={(label) =>
                updateField("activityLevel", activityLevels.find((item) => item.label === label)?.value ?? "moderate")
              }
            />
            <ChoiceGrid
              title="Gender"
              items={genders.map((item) => item.label)}
              selected={genders.find((item) => item.value === values.gender)?.label}
              onSelect={(label) => updateField("gender", genders.find((item) => item.label === label)?.value ?? "prefer-not")}
            />
          </View>
        )
      },
      {
        title: "Food style",
        subtitle: "Pick the nutrition filters the AI must respect.",
        content: (
          <View style={styles.chips}>
            {dietPreferences.map((preference) => {
              const selected = values.dietaryPreferences.includes(preference);
              return (
                <Pressable key={preference} onPress={() => togglePreference(preference)}>
                  <View
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? theme.colors.primary : theme.colors.surfaceAlt
                      }
                    ]}
                  >
                    <Text style={[styles.chipLabel, { color: selected ? "#FFF" : theme.colors.text }]}>{preference}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )
      }
    ],
    [heroGradient, setStep, theme, togglePreference, updateField, values.activityLevel, values.age, values.dietaryPreferences, values.gender, values.goal, values.height, values.weight]
  );

  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setStep(step + 1);
      return;
    }

    updateProfile({
      age: values.age,
      weight: values.weight,
      height: values.height,
      gender: values.gender,
      goal: values.goal,
      activityLevel: values.activityLevel,
      dietaryPreferences: values.dietaryPreferences
    });
    completeOnboarding();
    reset();
  };

  return (
    <AnimatedScreen>
      <SectionHeader eyebrow="Onboarding" title={steps[step].title} subtitle={steps[step].subtitle} />

      <View style={styles.progressRow}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                flex: index === step ? 1.4 : 1,
                opacity: index <= step ? 1 : 0.35,
                backgroundColor: index <= step ? theme.colors.primary : theme.colors.overlay
              }
            ]}
          />
        ))}
      </View>

      <GlassCard>
        <View key={`step-${step}`}>
          {steps[step].content}
        </View>
      </GlassCard>

      <GradientButton label={isLastStep ? "Continue to secure login" : "Continue"} onPress={handleNext} />
    </AnimatedScreen>
  );
};

const Field = ({
  label,
  value,
  onChangeText,
  placeholder
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) => {
  const { theme, isDark } = useAppTheme();

  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: theme.colors.textMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        keyboardType="numeric"
        style={[
          styles.input,
          {
            color: theme.colors.text,
            backgroundColor: isDark ? theme.colors.surfaceAlt : "#FFF"
          }
        ]}
      />
    </View>
  );
};

const ChoiceGrid = ({
  title,
  items,
  selected,
  onSelect
}: {
  title: string;
  items: string[];
  selected?: string;
  onSelect: (label: string) => void;
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.stack}>
      <Text style={[styles.fieldLabel, { color: theme.colors.textMuted }]}>{title}</Text>
      <View style={styles.chips}>
        {items.map((item) => {
          const active = item === selected;
          return (
            <Pressable key={item} onPress={() => onSelect(item)}>
              <View
                style={[
                  styles.choiceCard,
                  {
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                    backgroundColor: active ? theme.colors.surfaceAlt : "transparent"
                  }
                ]}
              >
                <Text style={[styles.choiceLabel, { color: theme.colors.text }]}>{item}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressRow: {
    flexDirection: "row",
    gap: 8
  },
  progressDot: {
    height: 8,
    borderRadius: 999
  },
  heroCard: {
    minHeight: 220,
    borderRadius: 24,
    padding: 22,
    justifyContent: "flex-end",
    gap: 12
  },
  heroMetric: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  heroText: {
    color: "#FFF",
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "700"
  },
  formGrid: {
    gap: 14
  },
  field: {
    gap: 8
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700"
  },
  input: {
    minHeight: 56,
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "600"
  },
  stack: {
    gap: 12
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: "700"
  },
  choiceCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  choiceLabel: {
    fontSize: 14,
    fontWeight: "700"
  }
});
