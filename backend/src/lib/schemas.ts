import { z } from "zod";

export const MealSchema = z.object({
  title: z.string(),
  time: z.string(),
  calories: z.number(),
  ingredients: z.array(z.string()),
  cookingSteps: z.array(z.string()),
  macros: z.object({
    protein: z.number(),
    carbs: z.number(),
    fats: z.number()
  })
});

export const MealPlanSchema = z.object({
  title: z.string(),
  summary: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fats: z.number()
  }),
  rationale: z.string(),
  meals: z.array(MealSchema)
});

export const VisionMealSchema = z.object({
  detectedFoods: z.array(z.string()),
  estimatedCalories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fats: z.number(),
  confidence: z.number(),
  coachingTip: z.string()
});

export const ProfileSchema = z.object({
  age: z.string(),
  weight: z.string(),
  height: z.string(),
  gender: z.string(),
  goal: z.string(),
  activityLevel: z.string(),
  dietaryPreferences: z.array(z.string()),
  email: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
  photoURL: z.string().nullable().optional()
});

export const SnapshotSchema = z.object({
  goalCalories: z.number(),
  consumedCalories: z.number(),
  hydrationMl: z.number(),
  stepCount: z.number(),
  sleepHours: z.number(),
  macros: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fats: z.number()
  }),
  streak: z.number(),
  xp: z.number()
});
