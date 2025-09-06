// __tests__/storage.test.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addUser,
  getUsers,
  checkPassword,
  setLoggedInUser,
  getLoggedInUser,
  clearLoggedInUser,
  addTask,
  getTasks,
  getSortedTasks,
  toggleTask,
  deleteTask,
} from "../src/storage/storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Mock Crypto
jest.mock("expo-crypto", () => ({
  digestStringAsync: jest.fn((algo, str) => Promise.resolve(`hash_${str}`)),
  CryptoDigestAlgorithm: { SHA256: "SHA256" },
}));

describe("User Storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return empty array if no users stored", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const users = await getUsers();
    expect(users).toEqual([]);
  });

  it("should add a new user successfully", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const result = await addUser("alice", "12345");

    expect(result).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it("should reject duplicate usernames", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([{ username: "bob", passwordHash: "hash_pw" }])
    );

    const result = await addUser("bob", "12345");

    expect(result).toEqual({
      error: "Username already exists, login instead",
    });
  });

  it("should validate correct password", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([{ username: "charlie", passwordHash: "hash_secret" }])
    );

    const result = await checkPassword("charlie", "secret");
    expect(result).toBe(true);
  });

  it("should return false if user does not exist", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("[]");

    const result = await checkPassword("ghost", "password");
    expect(result).toBe(false);
  });

  it("should return false if password is wrong", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([{ username: "dave", passwordHash: "hash_good" }])
    );

    const result = await checkPassword("dave", "bad");
    expect(result).toBe(false);
  });

  it("should store and retrieve logged in user", async () => {
    await setLoggedInUser("eve");
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("eve");

    const user = await getLoggedInUser();
    expect(user).toBe("eve");
  });

  it("should return null if no logged in user", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const user = await getLoggedInUser();
    expect(user).toBeNull();
  });

  it("should clear logged in user", async () => {
    await clearLoggedInUser();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("logged_user");
  });
});

describe("Task Storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return empty array if no tasks stored", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const tasks = await getTasks("alice");
    expect(tasks).toEqual([]);
  });

  it("should add a new task", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const task = await addTask("alice", {
      title: "Task 1",
      description: "Desc",
      dueDate: "2025-09-05",
    });

    expect(task).toHaveProperty("id");
    expect(task.completed).toBe(false);
  });

  it("should preserve multiple tasks for same user", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([{ id: "1", title: "Old", completed: false }])
    );

    const task = await addTask("bob", {
      title: "New Task",
      dueDate: "2025-09-05",
    });

    expect(task.title).toBe("New Task");
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it("should get tasks for a user", async () => {
    const mockTasks = [
      { id: "1", title: "Task A", completed: false },
      { id: "2", title: "Task B", completed: true },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockTasks)
    );

    const tasks = await getTasks("charlie");
    expect(tasks).toHaveLength(2);
  });

  it("should sort incomplete tasks before completed", async () => {
    const mockTasks = [
      { id: "1", title: "Complete", completed: true, dueDate: "2025-09-10" },
      { id: "2", title: "Incomplete", completed: false, dueDate: "2025-09-01" },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockTasks)
    );

    const tasks = await getSortedTasks("eve");
    expect(tasks[0].title).toBe("Incomplete");
  });

  it("should sort incomplete tasks by earliest due date", async () => {
    const mockTasks = [
      { id: "1", title: "Later", completed: false, dueDate: "2025-09-20" },
      { id: "2", title: "Sooner", completed: false, dueDate: "2025-09-10" },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockTasks)
    );

    const tasks = await getSortedTasks("alice");
    expect(tasks[0].title).toBe("Sooner");
  });

  it("should not crash if tasks missing dueDate", async () => {
    const mockTasks = [
      { id: "1", title: "No due date", completed: false },
      { id: "2", title: "Also no due", completed: false },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockTasks)
    );

    const tasks = await getSortedTasks("bob");
    expect(tasks).toHaveLength(2);
  });

  it("should toggle task completion state", async () => {
    const mockTasks = [
      { id: "1", title: "Task X", completed: false },
      { id: "2", title: "Task Y", completed: true },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockTasks)
    );

    const updated = await toggleTask("charlie", "1");
    expect(updated.find((t) => t.id === "1")?.completed).toBe(true);
  });

  it("should do nothing if taskId not found", async () => {
    const mockTasks = [{ id: "1", title: "Task X", completed: false }];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockTasks)
    );

    const updated = await toggleTask("charlie", "99");
    expect(updated).toEqual(mockTasks); // unchanged
  });

  it("should delete a task", async () => {
    const mockTasks = [
      { id: "1", title: "Keep me", completed: false },
      { id: "2", title: "Delete me", completed: true },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockTasks)
    );

    const updated = await deleteTask("bob", "2");
    expect(updated).toHaveLength(1);
    expect(updated[0].id).toBe("1");
  });

  it("should do nothing when deleting non-existent task", async () => {
    const mockTasks = [{ id: "1", title: "Only one", completed: false }];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockTasks)
    );

    const updated = await deleteTask("bob", "999");
    expect(updated).toEqual(mockTasks);
  });
});
