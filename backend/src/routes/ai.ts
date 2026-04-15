import { Router } from "express";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

import { env } from "../config/env.js";
import { openai } from "../lib/openai.js";
import { MealPlanSchema, VisionMealSchema } from "../lib/schemas.js";
import { fallbackChatReply, fallbackMealPlan, fallbackVisionResult } from "../lib/mockResponses.js";

export const aiRouter = Router();

const chatBodySchema = z.object({
  prompt: z.string(),
  conversation: z.array(z.object({ role: z.enum(["user", "assistant"]), text: z.string() })).default([])
});

aiRouter.post("/meal-plan", async (req, res) => {
  try {
    const payload = z.object({ prompt: z.string(), mode: z.enum(["daily", "weekly"]).default("daily") }).safeParse(req.body);

    if (!payload.success) {
      return res.status(400).json({ error: "Invalid meal plan payload." });
    }

    if (!openai) {
      return res.json(fallbackMealPlan);
    }

    const response = await openai.responses.parse({
      model: env.openAiModel,
      input: [
        {
          role: "developer",
          content:
            "You are NutriAI Pro. Return premium, practical nutrition plans. Be realistic, supportive, and optimize for adherence."
        },
        {
          role: "user",
          content: payload.data.prompt
        }
      ],
      text: {
        format: zodTextFormat(MealPlanSchema, "meal_plan")
      }
    });

    return res.json(response.output_parsed ?? fallbackMealPlan);
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Meal plan generation failed." });
  }
});

aiRouter.post("/chat", async (req, res) => {
  try {
    const payload = chatBodySchema.safeParse(req.body);

    if (!payload.success) {
      return res.status(400).json({ error: "Invalid chat payload." });
    }

    if (!openai) {
      return res.json({ text: fallbackChatReply });
    }

    const response = await openai.responses.create({
      model: env.openAiModel,
      reasoning: { effort: "low" },
      input: [
        {
          role: "developer",
          content:
            "You are NutriAI Pro, a premium AI nutrition and fitness coach. Be concise, practical and motivating."
        },
        ...payload.data.conversation.map((message) => ({
          role: message.role,
          content: message.text
        })),
        {
          role: "user",
          content: payload.data.prompt
        }
      ]
    });

    return res.json({ text: response.output_text || fallbackChatReply });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Chat generation failed." });
  }
});

aiRouter.post("/chat/stream", async (req, res) => {
  const payload = chatBodySchema.safeParse(req.body);

  if (!payload.success) {
    return res.status(400).json({ error: "Invalid chat payload." });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (data: unknown) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    if (!openai) {
      for (const token of fallbackChatReply.split(" ")) {
        send({ type: "delta", delta: `${token} ` });
        await delay(20);
      }
      send({ type: "done" });
      return res.end();
    }

    const stream = openai.responses
      .stream({
        model: env.openAiModel,
        reasoning: { effort: "low" },
        input: [
          {
            role: "developer",
            content:
              "You are NutriAI Pro, a premium AI nutrition and fitness coach. Be concise, practical and motivating."
          },
          ...payload.data.conversation.map((message) => ({
            role: message.role,
            content: message.text
          })),
          {
            role: "user",
            content: payload.data.prompt
          }
        ]
      })
      .on("response.output_text.delta", (event) => {
        send({ type: "delta", delta: event.delta });
      })
      .on("error", (error) => {
        send({ type: "error", error: error instanceof Error ? error.message : "Streaming failed." });
      })
      .on("response.completed", () => {
        send({ type: "done" });
        res.end();
      });

    await stream.finalResponse();
  } catch (error) {
    send({ type: "error", error: error instanceof Error ? error.message : "Streaming failed." });
    return res.end();
  }
});

aiRouter.post("/vision/meal", async (req, res) => {
  try {
    const payload = z
      .object({
        imageBase64: z.string().min(1),
        mimeType: z.string().default("image/jpeg")
      })
      .safeParse(req.body);

    if (!payload.success) {
      return res.status(400).json({ error: "Invalid image payload." });
    }

    if (!openai) {
      return res.json(fallbackVisionResult);
    }

    const response = await openai.responses.parse({
      model: env.openAiVisionModel,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Analyze this meal photo for calorie and macro estimation. Return JSON only with foods, estimated calories, macros, confidence, and one coaching tip."
            },
            {
              type: "input_image",
              image_url: `data:${payload.data.mimeType};base64,${payload.data.imageBase64}`,
              detail: "auto"
            }
          ]
        }
      ],
      text: {
        format: zodTextFormat(VisionMealSchema, "meal_scan")
      }
    });

    return res.json(response.output_parsed ?? fallbackVisionResult);
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Vision analysis failed." });
  }
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
