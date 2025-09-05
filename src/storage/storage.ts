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

// storage.ts
export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string; // ISO string
};



const TASKS_KEY_PREFIX = "tasks_"; // tasks will be saved per user

// Get all tasks for a user
export const getTasks = async (username: string): Promise<Task[]> => {
  const data = await AsyncStorage.getItem(`${TASKS_KEY_PREFIX}${username}`);
  return data ? JSON.parse(data) : [];
};

// Save tasks for a user
export const saveTasks = async (username: string, tasks: Task[]) => {
  await AsyncStorage.setItem(
    `${TASKS_KEY_PREFIX}${username}`,
    JSON.stringify(tasks)
  );
};

// Add task with due date
export const addTask = async (
  username: string,
  task: Omit<Task, "id" | "completed">
): Promise<Task> => {
  const tasks = await getTasks(username);
  const newTask: Task = {
    id: Date.now().toString(),
    title: task.title,
    description: task.description,
    completed: false,
    dueDate: task.dueDate,
  };
  const updated = [...tasks, newTask];
  await saveTasks(username, updated);
  return newTask;
};

// Get tasks sorted by due date (incomplete first, earliest due date first)
export const getSortedTasks = async (username: string): Promise<Task[]> => {
  const tasks = await getTasks(username);
  return tasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1; // incomplete first
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });
};

// Toggle task complete/incomplete
export const toggleTask = async (username: string, taskId: string) => {
  const tasks = await getTasks(username);
  const updated = tasks.map((t) =>
    t.id === taskId ? { ...t, completed: !t.completed } : t
  );
  await saveTasks(username, updated);
  return updated;
};

// Delete task
export const deleteTask = async (username: string, taskId: string) => {
  const tasks = await getTasks(username);
  const updated = tasks.filter((t) => t.id !== taskId);
  await saveTasks(username, updated);
  return updated;
};