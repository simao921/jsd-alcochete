import type { ChatMessage, DashboardSnapshot, MealPlan, MealVisionResult, ProgressPoint, UserProfile, WorkoutPlan } from "@/types";

export const mockUserProfile: UserProfile = {
  id: "demo-user",
  email: "demo@nutriai.pro",
  fullName: "Sofia Mendes",
  photoURL: null,
  age: "29",
  weight: "64",
  height: "168",
  gender: "female",
  goal: "lose-fat",
  activityLevel: "moderate",
  dietaryPreferences: ["high-protein", "mediterranean", "quick-meals"]
};

export const createMockMealPlan = (profile: UserProfile, mode: "daily" | "weekly"): MealPlan => ({
  id: `${mode}-${Date.now()}`,
  mode,
  title: mode === "daily" ? "Precision Fuel Day" : "Adaptive Performance Week",
  summary: {
    calories: profile.goal === "lose-fat" ? 1820 : profile.goal === "gain-muscle" ? 2420 : 2140,
    protein: 152,
    carbs: 188,
    fats: 62
  },
  rationale:
    profile.goal === "lose-fat"
      ? "High satiety foods and protein-forward meals to support fat loss without draining energy."
      : profile.goal === "gain-muscle"
        ? "Carb-timed meals and elevated protein to improve training output and recovery."
        : "Balanced energy distribution to keep performance and adherence high.",
  meals: [
    {
      id: "breakfast",
      title: "Protein oat bowl",
      time: "07:30",
      calories: 460,
      ingredients: ["Oats", "Greek yogurt", "Blueberries", "Chia", "Whey protein"],
      cookingSteps: ["Mix oats with yogurt.", "Add whey and berries.", "Top with chia before serving."],
      macros: { protein: 38, carbs: 51, fats: 12 }
    },
    {
      id: "lunch",
      title: "Chicken quinoa power plate",
      time: "12:45",
      calories: 610,
      ingredients: ["Chicken breast", "Quinoa", "Avocado", "Spinach", "Cherry tomatoes"],
      cookingSteps: ["Grill the chicken.", "Cook quinoa.", "Assemble with greens and avocado."],
      macros: { protein: 52, carbs: 49, fats: 21 }
    },
    {
      id: "dinner",
      title: "Salmon recovery dinner",
      time: "19:00",
      calories: 520,
      ingredients: ["Salmon", "Sweet potato", "Broccoli", "Olive oil", "Lemon"],
      cookingSteps: ["Roast salmon and potato.", "Steam broccoli.", "Finish with lemon and olive oil."],
      macros: { protein: 44, carbs: 36, fats: 23 }
    }
  ]
});

export const createMockChatReply = (profile: UserProfile, prompt: string) => {
  const normalizedPrompt = prompt.toLowerCase();

  if (normalizedPrompt.includes("post") || normalizedPrompt.includes("pos treino") || normalizedPrompt.includes("after gym")) {
    return `Depois do treino, para o teu objetivo de ${profile.goal}, eu faria uma refeicao com 30 a 40g de proteina, carboidrato moderado e gordura baixa. Exemplo: iogurte grego com fruta e whey, ou arroz com frango e legumes.`;
  }

  if (normalizedPrompt.includes("1800") || normalizedPrompt.includes("calorie") || normalizedPrompt.includes("kcal")) {
    return `Para um dia de cerca de 1800 kcal, eu dividiria em 3 refeicoes principais e 1 snack: pequeno-almoco proteico, almoco com fonte magra + arroz ou batata, snack funcional e jantar leve com legumes. Se quiseres, eu converto isto numa estrutura refeicao a refeicao.`;
  }

  if (normalizedPrompt.includes("workout") || normalizedPrompt.includes("treino")) {
    return `Como tens atividade ${profile.activityLevel}, eu sugiro 1 bloco principal de forca, 1 acessorio metabolico e finalizacao curta. Mantem progressao semanal simples: mais 1 serie, mais 1 ou 2 reps, ou menos descanso.`;
  }

  return `Para o teu objetivo de ${profile.goal}, eu priorizaria consistencia: proteina alta, horario de refeicoes estavel e 1 refeicao mais saciante no periodo em que tens mais fome. Posso transformar isso num plano diario, ajuste de macros ou estrategia pre e pos treino.`;
};

export const createMockVisionResult = (hint?: string): MealVisionResult => {
  const normalizedHint = hint?.toLowerCase() ?? "";

  if (normalizedHint.includes("salad") || normalizedHint.includes("frango") || normalizedHint.includes("chicken")) {
    return {
      detectedFoods: ["Chicken breast", "Lettuce", "Tomato", "Olive oil"],
      estimatedCalories: 430,
      protein: 39,
      carbs: 14,
      fats: 21,
      confidence: 0.82,
      coachingTip: "Boa refeicao para saciedade. Se isto for pos treino, adiciona uma fonte extra de carboidrato."
    };
  }

  return {
    detectedFoods: ["Rice", "Salmon", "Roasted vegetables"],
    estimatedCalories: 610,
    protein: 41,
    carbs: 56,
    fats: 22,
    confidence: 0.79,
    coachingTip: "Boa base de recuperacao. Se estiveres em corte, reduz ligeiramente o oleo ou a porcao de arroz."
  };
};

export const starterMessages: ChatMessage[] = [
  {
    id: "assistant-welcome",
    role: "assistant",
    text: "Sou o teu coach NutriAI. Posso montar dieta, ajustar macros, sugerir refeicoes pre e pos treino e adaptar tudo ao teu objetivo.",
    createdAt: new Date().toISOString()
  }
];

export const mockWorkouts: WorkoutPlan[] = [
  {
    id: "gym-strength",
    title: "Gym strength split",
    location: "gym",
    duration: 48,
    intensity: "High",
    exercises: [
      { id: "1", name: "Back squat", reps: "4 x 6", rest: "90 sec", focus: "Leg strength" },
      { id: "2", name: "Romanian deadlift", reps: "4 x 8", rest: "75 sec", focus: "Posterior chain" },
      { id: "3", name: "Walking lunges", reps: "3 x 12", rest: "60 sec", focus: "Glutes" }
    ]
  },
  {
    id: "home-conditioning",
    title: "Home metabolic flow",
    location: "home",
    duration: 28,
    intensity: "Medium",
    exercises: [
      { id: "4", name: "Tempo push-ups", reps: "3 x 12", rest: "45 sec", focus: "Upper body" },
      { id: "5", name: "Air squats", reps: "4 x 20", rest: "30 sec", focus: "Leg endurance" },
      { id: "6", name: "Plank shoulder taps", reps: "3 x 30 sec", rest: "20 sec", focus: "Core control" }
    ]
  }
];

export const mockProgress: ProgressPoint[] = [
  { label: "W1", value: 84.4 },
  { label: "W2", value: 83.9 },
  { label: "W3", value: 83.1 },
  { label: "W4", value: 82.7 },
  { label: "W5", value: 82.3 }
];

export const mockDashboard: DashboardSnapshot = {
  goalCalories: 2200,
  consumedCalories: 1465,
  hydrationMl: 1800,
  stepCount: 8410,
  sleepHours: 7.4,
  macros: {
    calories: 1465,
    protein: 112,
    carbs: 135,
    fats: 44
  },
  streak: 12,
  xp: 840
};

export const starterPrompts = [
  "Create a 1800 calorie plan with high protein",
  "What should I eat after leg day?",
  "Build me a home workout for fat loss"
];
