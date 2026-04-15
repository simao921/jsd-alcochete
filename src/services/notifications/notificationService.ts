import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export const initializeNotifications = async () => {
  const settings = await Notifications.getPermissionsAsync();

  if (!settings.granted) {
    await Notifications.requestPermissionsAsync();
  }
};

export const scheduleHydrationReminder = async (hour: number, minute: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hydration check",
      body: "Hora de beber agua e manter o streak vivo."
    },
    trigger: { hour, minute, repeats: true } as any
  });
};
