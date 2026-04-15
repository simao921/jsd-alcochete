import express from "express";
import cors from "cors";

import { env, hasFirebaseAdmin, hasOpenAi } from "./config/env.js";
import { aiRouter } from "./routes/ai.js";
import { userRouter } from "./routes/user.js";
import { trackingRouter } from "./routes/tracking.js";
import { attachOptionalUser } from "./middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(attachOptionalUser);

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    openai: hasOpenAi,
    firebaseAdmin: hasFirebaseAdmin,
    timestamp: new Date().toISOString()
  });
});

app.use("/ai", aiRouter);
app.use("/user", userRouter);
app.use("/tracking", trackingRouter);

app.listen(env.port, () => {
  console.log(
    `NutriAI Pro backend running on http://localhost:${env.port} | openai=${hasOpenAi} | firebaseAdmin=${hasFirebaseAdmin}`
  );
});
