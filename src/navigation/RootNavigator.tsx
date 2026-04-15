import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Sparkles, MessageCircleMore, Dumbbell, UserRound } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/store/authStore";
import { SplashScreen } from "@/screens/SplashScreen";
import { OnboardingScreen } from "@/screens/onboarding/OnboardingScreen";
import { AuthChoiceScreen } from "@/screens/auth/AuthChoiceScreen";
import { HomeScreen } from "@/screens/dashboard/HomeScreen";
import { MealPlannerScreen } from "@/screens/meals/MealPlannerScreen";
import { ChatAssistantScreen } from "@/screens/chat/ChatAssistantScreen";
import { WorkoutPlannerScreen } from "@/screens/workouts/WorkoutPlannerScreen";
import { ProgressScreen } from "@/screens/progress/ProgressScreen";
import { ProfileScreen } from "@/screens/profile/ProfileScreen";
import { ScannerScreen } from "@/screens/tracker/ScannerScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabs = [
  { name: "Home", component: HomeScreen, icon: Home },
  { name: "Meals", component: MealPlannerScreen, icon: Sparkles },
  { name: "Chat", component: ChatAssistantScreen, icon: MessageCircleMore },
  { name: "Workouts", component: WorkoutPlannerScreen, icon: Dumbbell },
  { name: "Profile", component: ProfileScreen, icon: UserRound }
] as const;

const AppTabs = () => {
  const { theme, isDark } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tabConfig = tabs.find((tab) => tab.name === route.name);
        const Icon = tabConfig?.icon ?? Home;

        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            left: 18,
            right: 18,
            bottom: 18,
            height: 72,
            borderRadius: 28,
            paddingTop: 10,
            backgroundColor: isDark ? "rgba(16, 24, 43, 0.88)" : "rgba(255,255,255,0.94)",
            borderTopWidth: 0,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 1,
            shadowRadius: 28,
            shadowOffset: { width: 0, height: 20 },
            elevation: 18
          },
          tabBarButton: ({ children, onPress, style, accessibilityState, accessibilityLabel, testID }) => (
            <Pressable
              accessibilityLabel={accessibilityLabel}
              accessibilityRole="button"
              accessibilityState={accessibilityState}
              testID={testID}
              onPress={onPress}
              android_ripple={undefined}
              style={[style, styles.tabButton]}
            >
              {children}
            </Pressable>
          ),
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabIcon,
                {
                  backgroundColor: focused ? theme.colors.primary : "transparent"
                }
              ]}
            >
              <Icon color={focused ? "#FFF" : theme.colors.textMuted} size={20} />
            </View>
          )
        };
      }}
    >
      {tabs.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  const { theme } = useAppTheme();
  const [showSplash, setShowSplash] = useState(true);
  const status = useAuthStore((state) => state.status);
  const hasCompletedOnboarding = useAuthStore((state) => state.hasCompletedOnboarding);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const content = useMemo(() => {
    if (showSplash || status === "loading") {
      return <SplashScreen />;
    }

    if (!hasCompletedOnboarding) {
      return <OnboardingScreen />;
    }

    if (status !== "authenticated") {
      return <AuthChoiceScreen />;
    }

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background
          }
        }}
      >
        <Stack.Screen name="Tabs" component={AppTabs} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
      </Stack.Navigator>
    );
  }, [hasCompletedOnboarding, showSplash, status, theme.colors.background]);

  return content;
};

const styles = StyleSheet.create({
  tabButton: {
    borderRadius: 22
  },
  tabIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  }
});
