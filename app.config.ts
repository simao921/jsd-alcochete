import type { ConfigContext, ExpoConfig } from "expo/config";

const googleIosScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_ID;
const facebookAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID;
const facebookClientToken = process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN;
const googlePlugin: [string, Record<string, string>] | null = googleIosScheme
  ? [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: googleIosScheme
      }
    ]
  : null;
const facebookPlugin:
  | [
      string,
      {
        appID: string;
        clientToken: string;
        displayName: string;
        scheme: string;
        advertiserIDCollectionEnabled: boolean;
        autoLogAppEventsEnabled: boolean;
        isAutoInitEnabled: boolean;
      }
    ]
  | null = facebookAppId && facebookClientToken
  ? [
      "react-native-fbsdk-next",
      {
        appID: facebookAppId,
        clientToken: facebookClientToken,
        displayName: "NutriAI Pro",
        scheme: `fb${facebookAppId}`,
        advertiserIDCollectionEnabled: false,
        autoLogAppEventsEnabled: false,
        isAutoInitEnabled: true
      }
    ]
  : null;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "NutriAI Pro",
  slug: "nutriai-pro",
  scheme: "nutriaipro",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  splash: {
    resizeMode: "contain",
    backgroundColor: "#070B17"
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.nutriai.pro",
    supportsTablet: true,
    usesAppleSignIn: true,
    infoPlist: googleIosScheme
      ? {
          CFBundleURLTypes: [
            {
              CFBundleURLSchemes: [googleIosScheme]
            }
          ]
        }
      : undefined
  },
  android: {
    package: "com.nutriai.pro",
    adaptiveIcon: {
      backgroundColor: "#070B17"
    }
  },
  plugins: [
    "expo-secure-store",
    "expo-localization",
    "expo-notifications",
    "expo-apple-authentication",
    [
      "expo-camera",
      {
        cameraPermission:
          "NutriAI Pro uses the camera to scan meals, barcodes, and progress photos."
      }
    ],
    ...(googlePlugin ? [googlePlugin] : []),
    ...(facebookPlugin ? [facebookPlugin] : [])
  ],
  extra: {
    ...config.extra,
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID
    }
  }
});
