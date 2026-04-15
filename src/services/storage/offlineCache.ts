import AsyncStorage from "@react-native-async-storage/async-storage";

export const writeJson = async <T>(key: string, value: T) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const readJson = async <T>(key: string, fallback: T): Promise<T> => {
  const storedValue = await AsyncStorage.getItem(key);
  return storedValue ? (JSON.parse(storedValue) as T) : fallback;
};
