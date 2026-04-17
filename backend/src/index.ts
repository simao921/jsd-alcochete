import express from "express";
import cors from "cors";

import { env, hasFirebaseAdmin, hasOpenAi } from "./config/env.js";
import { aiRouter } from "./routes/ai.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    openai: hasOpenAi,
    firebaseAdmin: hasFirebaseAdmin,
    timestamp: new Date().toISOString()
  });
});

app.use("/ai", aiRouter);

app.listen(env.port, () => {
  console.log(
    `JSD Alcochete backend running on http://localhost:${env.port} | openai=${hasOpenAi} | firebaseAdmin=${hasFirebaseAdmin}`
  );
});
