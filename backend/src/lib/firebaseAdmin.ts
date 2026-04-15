import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import { env, hasFirebaseAdmin } from "../config/env.js";

const app =
  hasFirebaseAdmin && getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: env.firebaseProjectId,
          clientEmail: env.firebaseClientEmail,
          privateKey: env.firebasePrivateKey
        })
      })
    : getApps()[0];

export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app ? getFirestore(app) : null;
export const firebaseAdminReady = Boolean(app);
