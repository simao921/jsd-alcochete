export const estimateMealFromImage = async () => {
  return {
    detectedFoods: ["Grilled chicken", "Rice", "Broccoli"],
    estimatedCalories: 540,
    confidence: 0.86
  };
};

export const lookupBarcode = async (barcode: string) => {
  return {
    barcode,
    title: "Protein yogurt",
    serving: "1 pot",
    calories: 146,
    protein: 20,
    carbs: 8,
    fats: 2
  };
};
