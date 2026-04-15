import "dotenv/config";

export const env = {
  port: Number(process.env.PORT || 4000),
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-5",
  openAiVisionModel: process.env.OPENAI_VISION_MODEL || process.env.OPENAI_MODEL || "gpt-5",
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "",
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  firebasePrivateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n")
};

export const hasOpenAi = Boolean(env.openAiApiKey);
export const hasFirebaseAdmin =
  Boolean(env.firebaseProjectId) && Boolean(env.firebaseClientEmail) && Boolean(env.firebasePrivateKey);
