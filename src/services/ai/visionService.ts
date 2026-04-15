import { apiRequest } from "@/services/api/client";
import { createMockVisionResult } from "@/utils/mockData";

export interface MealVisionResult {
  detectedFoods: string[];
  estimatedCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: number;
  coachingTip: string;
}

export const analyzeMealPhoto = async (imageBase64: string, mimeType = "image/jpeg") => {
  try {
    return await apiRequest<MealVisionResult>("/ai/vision/meal", {
      method: "POST",
      body: JSON.stringify({
        imageBase64,
        mimeType
      })
    });
  } catch {
    return createMockVisionResult();
  }
};
