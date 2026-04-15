import Constants from "expo-constants";

import type { ChatMessage, MealPlan, UserProfile } from "@/types";
import { buildChatPrompt, buildMealPlannerPrompt } from "@/services/ai/prompts";
import { apiRequest, getApiUrl } from "@/services/api/client";
import { createMockChatReply, createMockMealPlan } from "@/utils/mockData";

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl as string | undefined;

export const generateMealPlan = async ({
  profile,
  mode,
  request
}: {
  profile: UserProfile;
  mode: "daily" | "weekly";
  request: string;
}): Promise<MealPlan> => {
  if (!apiBaseUrl) {
    await delay(700);
    return createMockMealPlan(profile, mode);
  }

  try {
    const data = await apiRequest<Omit<MealPlan, "id" | "mode">>("/ai/meal-plan", {
      method: "POST",
      body: JSON.stringify({
        mode,
        prompt: buildMealPlannerPrompt(profile, request)
      })
    });
    return {
      id: `${mode}-${Date.now()}`,
      mode,
      ...data
    } as MealPlan;
  } catch {
    await delay(500);
    return createMockMealPlan(profile, mode);
  }
};

export const streamAssistantReply = async ({
  profile,
  message,
  onChunk,
  conversation = []
}: {
  profile: UserProfile;
  message: string;
  onChunk: (partial: string) => void;
  conversation?: { role: "user" | "assistant"; text: string }[];
}) => {
  if (!apiBaseUrl) {
    return streamMockReply(profile, message, onChunk);
  }

  try {
    const response = await fetch(getApiUrl("/ai/chat/stream"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: buildChatPrompt(profile, message),
        conversation
      })
    });

    if (!response.ok || !response.body) {
      const data = await apiRequest<{ text: string }>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          prompt: buildChatPrompt(profile, message),
          conversation
        })
      });
      onChunk(data.text);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let assembled = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const line = event
          .split("\n")
          .find((candidate) => candidate.startsWith("data: "));

        if (!line) {
          continue;
        }

        const payload = JSON.parse(line.slice(6)) as { type: string; delta?: string; error?: string };

        if (payload.type === "delta" && payload.delta) {
          assembled += payload.delta;
          onChunk(assembled.trim());
        }

        if (payload.type === "error") {
          throw new Error(payload.error || "Erro ao receber stream da IA.");
        }
      }
    }
  } catch {
    await streamMockReply(profile, message, onChunk);
  }
};

export const createMessage = (role: ChatMessage["role"], text: string): ChatMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  role,
  text,
  createdAt: new Date().toISOString()
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const streamMockReply = async (profile: UserProfile, message: string, onChunk: (partial: string) => void) => {
  const mockReply = createMockChatReply(profile, message);
  let assembled = "";

  for (const token of mockReply.split(" ")) {
    assembled += `${token} `;
    onChunk(assembled.trim());
    await delay(36);
  }
};
