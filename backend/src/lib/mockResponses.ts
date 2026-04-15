export const fallbackMealPlan = {
  title: "Adaptive Performance Day",
  summary: {
    calories: 1980,
    protein: 155,
    carbs: 184,
    fats: 61
  },
  rationale:
    "Balanced satiety, high protein, and carb timing around training keep energy high while supporting consistency.",
  meals: [
    {
      title: "Greek yogurt performance bowl",
      time: "07:30",
      calories: 450,
      ingredients: ["Greek yogurt", "Oats", "Blueberries", "Honey", "Chia"],
      cookingSteps: ["Layer yogurt and oats.", "Top with blueberries, honey and chia."],
      macros: { protein: 34, carbs: 52, fats: 11 }
    },
    {
      title: "Chicken rice recovery plate",
      time: "13:00",
      calories: 680,
      ingredients: ["Chicken breast", "Rice", "Olive oil", "Broccoli", "Avocado"],
      cookingSteps: ["Grill the chicken.", "Cook the rice.", "Serve with greens and avocado."],
      macros: { protein: 57, carbs: 64, fats: 18 }
    },
    {
      title: "Salmon sweet potato dinner",
      time: "19:30",
      calories: 590,
      ingredients: ["Salmon", "Sweet potato", "Asparagus", "Lemon"],
      cookingSteps: ["Roast the salmon and potato.", "Steam asparagus and finish with lemon."],
      macros: { protein: 46, carbs: 38, fats: 24 }
    }
  ]
};

export const fallbackChatReply =
  "Foca-te numa refeicao pos-treino com 30 a 40g de proteina, um carboidrato facil de digerir e agua suficiente para acelerar recuperacao. Se quiseres, eu converto isto num plano completo para hoje.";

export const fallbackVisionResult = {
  detectedFoods: ["Grilled chicken", "Rice", "Broccoli"],
  estimatedCalories: 540,
  protein: 42,
  carbs: 48,
  fats: 15,
  confidence: 0.86,
  coachingTip: "Boa base pos-treino. Se o objetivo for perda de gordura, controla o azeite e a porcao de arroz."
};
