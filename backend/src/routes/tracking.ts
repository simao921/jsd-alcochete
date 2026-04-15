import { Router } from "express";

import { adminDb, firebaseAdminReady } from "../lib/firebaseAdmin.js";
import { SnapshotSchema } from "../lib/schemas.js";
import { requireUser } from "../middleware/auth.js";

export const trackingRouter = Router();

trackingRouter.get("/snapshot", requireUser, async (req, res) => {
  if (!firebaseAdminReady || !adminDb || !req.user) {
    return res.json({ snapshot: null, mode: "preview" });
  }

  const document = await adminDb.collection("snapshots").doc(req.user.uid).get();
  return res.json({ snapshot: document.exists ? document.data() : null, mode: "firebase" });
});

trackingRouter.post("/snapshot", requireUser, async (req, res) => {
  const payload = SnapshotSchema.safeParse(req.body);

  if (!payload.success) {
    return res.status(400).json({ error: "Invalid snapshot payload." });
  }

  if (!firebaseAdminReady || !adminDb || !req.user) {
    return res.json({ ok: true, mode: "preview" });
  }

  await adminDb.collection("snapshots").doc(req.user.uid).set(payload.data, { merge: true });
  return res.json({ ok: true, mode: "firebase" });
});
