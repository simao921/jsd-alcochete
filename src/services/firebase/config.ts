import Constants from "expo-constants";
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const extra = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId: extra.firebaseAppId
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);
const safeFirebaseConfig = hasFirebaseConfig
  ? firebaseConfig
  : {
      apiKey: "preview-api-key",
      authDomain: "preview.firebaseapp.com",
      projectId: "preview-project",
      storageBucket: "preview.appspot.com",
      messagingSenderId: "000000000000",
      appId: "1:000000000000:web:preview"
    };

export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(safeFirebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseReady = hasFirebaseConfig;
