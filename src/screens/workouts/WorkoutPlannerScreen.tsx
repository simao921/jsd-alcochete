import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Bolt, Check, Clock3, MapPin } from "lucide-react-native";

import { AnimatedScreen } from "@/components/AnimatedScreen";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAppStore } from "@/store/appStore";
import { mockWorkouts } from "@/utils/mockData";

export const WorkoutPlannerScreen = () => {
  const { theme } = useAppTheme();
  const addXp = useAppStore((state) => state.addXp);
  const completedWorkoutIds = useAppStore((state) => state.completedWorkoutIds);
  const completedExerciseIds = useAppStore((state) => state.completedExerciseIds);
  const toggleExerciseComplete = useAppStore((state) => state.toggleExerciseComplete);
  const toggleWorkoutComplete = useAppStore((state) => state.toggleWorkoutComplete);
  const [locationFilter, setLocationFilter] = useState<"all" | "home" | "gym">("all");

  const workouts = useMemo(
    () => mockWorkouts.filter((workout) => locationFilter === "all" || workout.location === locationFilter),
    [locationFilter]
  );

  const handleWorkoutComplete = (workoutId: string) => {
    const completed = completedWorkoutIds.includes(workoutId);
    toggleWorkoutComplete(workoutId);
    if (!completed) {
      addXp(45);
    }
  };

  return (
    <AnimatedScreen>
      <AnimatedReveal delay={40}>
        <SectionHeader
          eyebrow="Workout Lab"
          title="Plans for gym and home"
          subtitle="Completion tracking, exercise checkoffs and progression-focused structure."
        />
      </AnimatedReveal>

      <AnimatedReveal delay={100}>
        <View style={styles.filterRow}>
          {(["all", "gym", "home"] as const).map((item) => {
            const active = item === locationFilter;
            return (
              <Pressable key={item} onPress={() => setLocationFilter(item)}>
                <View style={[styles.filterChip, { backgroundColor: active ? theme.colors.primary : theme.colors.surfaceAlt }]}>
                  <Text style={[styles.filterLabel, { color: active ? "#FFF" : theme.colors.text }]}>{item.toUpperCase()}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </AnimatedReveal>

      {workouts.map((workout, index) => {
        const completedWorkout = completedWorkoutIds.includes(workout.id);

        return (
          <AnimatedReveal key={workout.id} delay={160 + index * 60}>
            <GlassCard>
              <View style={styles.headline}>
                <Text style={[styles.title, { color: theme.colors.text }]}>{workout.title}</Text>
                <Text style={[styles.pill, { color: completedWorkout ? theme.colors.success : theme.colors.primary }]}>
                  {completedWorkout ? "Done" : workout.intensity}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Meta icon={<MapPin size={14} color={theme.colors.textMuted} />} label={workout.location} />
                <Meta icon={<Clock3 size={14} color={theme.colors.textMuted} />} label={`${workout.duration} min`} />
                <Meta icon={<Bolt size={14} color={theme.colors.textMuted} />} label={workout.exercises.length.toString()} />
              </View>

              <View style={styles.exerciseStack}>
                {workout.exercises.map((exercise) => {
                  const completedExercise = completedExerciseIds.includes(exercise.id);
                  return (
                    <Pressable key={exercise.id} onPress={() => toggleExerciseComplete(exercise.id)}>
                      <View
                        style={[
                          styles.exerciseCard,
                          {
                            backgroundColor: completedExercise ? theme.colors.overlay : theme.colors.surfaceAlt,
                            borderColor: completedExercise ? theme.colors.success : "transparent"
                          }
                        ]}
                      >
                        <View style={[styles.checkWrap, { backgroundColor: completedExercise ? theme.colors.success : theme.colors.overlay }]}>
                          <Check size={14} color={completedExercise ? "#FFF" : theme.colors.textMuted} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.exerciseTitle, { color: theme.colors.text }]}>{exercise.name}</Text>
                          <Text style={[styles.exerciseHint, { color: theme.colors.textMuted }]}>{exercise.focus}</Text>
                        </View>
                        <View style={styles.exerciseStats}>
                          <Text style={[styles.exerciseTitle, { color: theme.colors.text }]}>{exercise.reps}</Text>
                          <Text style={[styles.exerciseHint, { color: theme.colors.textMuted }]}>{exercise.rest}</Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <GradientButton
                label={completedWorkout ? "Completed today" : "Mark workout as complete"}
                onPress={() => handleWorkoutComplete(workout.id)}
                style={{ marginTop: 16 }}
              />
            </GlassCard>
          </AnimatedReveal>
        );
      })}
    </AnimatedScreen>
  );
};

const Meta = ({ icon, label }: { icon: ReactNode; label: string }) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.metaItem}>
      {icon}
      <Text style={[styles.metaText, { color: theme.colors.textMuted }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    gap: 10
  },
  filterChip: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6
  },
  headline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    flex: 1
  },
  pill: {
    fontSize: 13,
    fontWeight: "800"
  },
  metaRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 12
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  metaText: {
    fontSize: 13,
    fontWeight: "700"
  },
  exerciseStack: {
    marginTop: 18,
    gap: 10
  },
  exerciseCard: {
    padding: 14,
    borderRadius: 18,
    flexDirection: "row",
    gap: 10,
    borderWidth: 1
  },
  checkWrap: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  exerciseTitle: {
    fontSize: 15,
    fontWeight: "800"
  },
  exerciseHint: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600"
  },
  exerciseStats: {
    alignItems: "flex-end"
  }
});
