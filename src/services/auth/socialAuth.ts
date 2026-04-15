import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { FacebookAuthProvider, GoogleAuthProvider, OAuthProvider, signInWithCredential } from "firebase/auth";

import { firebaseAuth, firebaseReady } from "@/services/firebase/config";

export const configureGoogleAuth = () => {
  try {
    const { GoogleSignin } = require("@react-native-google-signin/google-signin");
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true
    });
  } catch {
    // Native module unavailable in Expo Go.
  }
};

export const initializeFacebookSdk = () => {
  try {
    const { Settings } = require("react-native-fbsdk-next");
    Settings.initializeSDK();
  } catch {
    // Native module unavailable in Expo Go.
  }
};

const ensureFirebaseReady = () => {
  if (!firebaseReady) {
    throw new Error("Firebase nao configurado para autenticacao social.");
  }
};

export const signInWithGoogle = async () => {
  ensureFirebaseReady();
  configureGoogleAuth();
  const { GoogleSignin } = require("@react-native-google-signin/google-signin");
  await GoogleSignin.hasPlayServices();
  const response = (await GoogleSignin.signIn()) as any;
  const idToken = response?.data?.idToken ?? response?.idToken;

  if (!idToken) {
    throw new Error("Google nao retornou idToken. Verifique os client IDs.");
  }

  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(firebaseAuth, credential);
  return result.user;
};

export const signInWithFacebook = async () => {
  ensureFirebaseReady();
  initializeFacebookSdk();
  const { AccessToken, LoginManager } = require("react-native-fbsdk-next");
  const loginResult = await LoginManager.logInWithPermissions(["public_profile", "email"]);

  if (loginResult.isCancelled) {
    throw new Error("Login com Facebook cancelado.");
  }

  const accessToken = await AccessToken.getCurrentAccessToken();
  if (!accessToken?.accessToken) {
    throw new Error("Facebook nao retornou access token.");
  }

  const credential = FacebookAuthProvider.credential(accessToken.accessToken);
  const result = await signInWithCredential(firebaseAuth, credential);
  return result.user;
};

const createNonce = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const signInWithApple = async () => {
  ensureFirebaseReady();
  const rawNonce = createNonce();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);

  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL
    ],
    nonce: hashedNonce
  });

  if (!appleCredential.identityToken) {
    throw new Error("Apple nao retornou identity token.");
  }

  const provider = new OAuthProvider("apple.com");
  const credential = provider.credential({
    idToken: appleCredential.identityToken,
    rawNonce
  });

  const result = await signInWithCredential(firebaseAuth, credential);
  return result.user;
};
