import * as Haptics from "expo-haptics";

export const tapFeedback = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
export const successFeedback = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
