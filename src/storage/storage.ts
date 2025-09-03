// storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

export type User = {
  username: string;
  passwordHash: string;
};

// Key constants
const USERS_KEY = "users"; // list of all registered users
const LOGGED_IN_KEY = "logged_user";

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

// Add new user
export const addUser = async (
  username: string,
  password: string
): Promise<boolean> => {
  const users = await getUsers();
  const exists = users.some((u) => u.username === username);
  if (exists) return false;

  const passwordHash = await hashPassword(password);
  const newUser: User = { username, passwordHash };
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  return true;
};

// Check password
export const checkPassword = async (
  username: string,
  password: string
): Promise<boolean> => {
  const users = await getUsers();
  const user = users.find((u) => u.username === username);
  if (!user) return false;
  const passwordHash = await hashPassword(password);
  return user.passwordHash === passwordHash;
};

// Set logged in user
export const setLoggedInUser = async (username: string) => {
  await AsyncStorage.setItem(LOGGED_IN_KEY, username);
};

// Get logged in user
export const getLoggedInUser = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(LOGGED_IN_KEY);
};

// Clear logged in user
export const clearLoggedInUser = async () => {
  await AsyncStorage.removeItem(LOGGED_IN_KEY);
};
