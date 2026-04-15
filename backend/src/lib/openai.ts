import OpenAI from "openai";

import { env, hasOpenAi } from "../config/env.js";

export const openai = hasOpenAi ? new OpenAI({ apiKey: env.openAiApiKey }) : null;
