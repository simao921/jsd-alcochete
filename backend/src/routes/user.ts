import { Router } from "express";

import { adminDb, firebaseAdminReady } from "../lib/firebaseAdmin.js";
import { ProfileSchema } from "../lib/schemas.js";
import { requireUser } from "../middleware/auth.js";

export const userRouter = Router();

userRouter.get("/profile", requireUser, async (req, res) => {
  if (!firebaseAdminReady || !adminDb || !req.user) {
    return res.json({ profile: null, mode: "preview" });
  }

  const document = await adminDb.collection("users").doc(req.user.uid).get();
  return res.json({ profile: document.exists ? document.data() : null, mode: "firebase" });
});

userRouter.patch("/profile", requireUser, async (req, res) => {
  const payload = ProfileSchema.safeParse(req.body);

  if (!payload.success) {
    return res.status(400).json({ error: "Invalid profile payload." });
  }

  if (!firebaseAdminReady || !adminDb || !req.user) {
    return res.json({ ok: true, mode: "preview" });
  }

  await adminDb.collection("users").doc(req.user.uid).set(payload.data, { merge: true });
  return res.json({ ok: true, mode: "firebase" });
});
