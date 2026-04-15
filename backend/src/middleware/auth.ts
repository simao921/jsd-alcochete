import type { NextFunction, Request, Response } from "express";

import { adminAuth, firebaseAdminReady } from "../lib/firebaseAdmin.js";

const resolveUser = async (req: Request) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ") || !firebaseAdminReady || !adminAuth) {
    req.user = undefined;
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email
    };
  } catch {
    req.user = undefined;
  }
};

export const attachOptionalUser = async (req: Request, _res: Response, next: NextFunction) => {
  await resolveUser(req);
  next();
};

export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  await resolveUser(req);

  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
};
