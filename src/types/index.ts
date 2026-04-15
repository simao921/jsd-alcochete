export type Goal = "lose-fat" | "gain-muscle" | "maintain";
export type ActivityLevel = "light" | "moderate" | "high" | "athlete";
export type Gender = "male" | "female" | "non-binary" | "prefer-not";
export type ThemePreference = "system" | "light" | "dark";
export type PlanMode = "daily" | "weekly";
export type AuthMode = "firebase" | "demo" | null;

export interface UserProfile {
  id?: string;
  email?: string | null;
  fullName?: string | null;
  photoURL?: string | null;
  age: string;
  weight: string;
  height: string;
  gender: Gender;
  goal: Goal;
  activityLevel: ActivityLevel;
  dietaryPreferences: string[];
}

export interface MacroSummary {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealItem {
  id: string;
  title: string;
  time: string;
  calories: number;
  ingredients: string[];
  cookingSteps: string[];
  macros: Omit<MacroSummary, "calories">;
}

export interface MealPlan {
  id: string;
  mode: PlanMode;
  title: string;
  summary: MacroSummary;
  meals: MealItem[];
  rationale: string;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  reps: string;
  rest: string;
  focus: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  location: "home" | "gym";
  duration: number;
  intensity: string;
  exercises: WorkoutExercise[];
}

export interface ProgressPoint {
  label: string;
  value: number;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  createdAt: string;
}

export interface DashboardSnapshot {
  goalCalories: number;
  consumedCalories: number;
  hydrationMl: number;
  stepCount: number;
  sleepHours: number;
  macros: MacroSummary;
  streak: number;
  xp: number;
}

export interface MealVisionResult {
  detectedFoods: string[];
  estimatedCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: number;
  coachingTip: string;
}
