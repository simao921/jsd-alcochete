import "react-native-gesture-handler";

import { useEffect } from "react";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "@/navigation/RootNavigator";
import { subscribeToAuthChanges } from "@/services/auth/authService";
import { firebaseReady } from "@/services/firebase/config";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/store/authStore";
import { i18n } from "@/services/localization/i18n";

export default function App() {
  const { isDark, theme } = useAppTheme();
  const setAuthState = useAuthStore((state) => state.setAuthState);
  const authMode = useAuthStore((state) => state.authMode);

  useEffect(() => {
    if (authMode === "demo") {
      return;
    }

    if (!firebaseReady) {
      setAuthState({ uid: null });
      return;
    }

    return subscribeToAuthChanges(setAuthState);
  }, [authMode, setAuthState]);

  useEffect(() => {
    i18n.locale = "pt-PT";
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={isDark ? navDarkTheme(theme.colors.background) : navLightTheme(theme.colors.background)}>
          <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const navDarkTheme = (background: string) => ({
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background,
    card: background,
    border: "transparent"
  }
});

const navLightTheme = (background: string) => ({
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background,
    card: background,
    border: "transparent"
  }
});
