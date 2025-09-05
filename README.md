# To-Do List App (Expo + TypeScript)

Run locally:
1. `npm install`
2. `npx expo start`
3. Open Expo Go (v53) on your device and scan the QR code

# 📝 To-Do List App (React Native)

A simple **To-Do List mobile application** built with **React Native** and **Expo**.  
The app allows users to register/login, manage tasks, and persist data locally using `AsyncStorage`.  

This project was developed as part of a **developer exercise**, showcasing task management, local storage, navigation, and clean UI/UX with **dark theme styling**.

---

## 🚀 Features

### 🔑 Authentication
- User registration and login
- Passwords securely hashed with **SHA-256**
- Session management (persist logged-in user)

### ✅ Task Management
- Add new tasks (with **title**, optional description, and **due date**)
- Mark tasks as **complete/incomplete**
- Delete tasks
- Tasks are **sorted by due date**

### 📅 Calendar Integration
- Built-in calendar to **filter tasks by day**
- Default selection = **today**
- Days with tasks are highlighted with **markers**
- Task list updates when a day is selected

### 💾 Data Persistence
- All data stored locally using **AsyncStorage**
- Tasks and users persist between app launches

### 🎨 UI/UX
- Simple, clean **dark theme**:
  - Background: `black`
  - Primary buttons: `blue`
  - Text: white
  - Secondary text: gray
- Task states visually distinguished:
  - Completed → strikethrough + gray
  - Incomplete → blue highlight

### 🔔 Notifications
- In-app toast notifications using **sonner-native**
- Success, error, and info messages with custom colors

---

## 📂 Project Structure

.
├── src
│ ├── components
│ │ └── AppNavigator.tsx # Navigation setup
│ ├── screens
│ │ ├── login.tsx # User login
│ │ ├── sign.tsx # User registration
│ │ ├── task-list.tsx # View, toggle, delete, and filter tasks
│ │ └── add-task-screen.tsx # Add new task with title, description, and due date
│ ├── storage
│ │ └── storage.ts # AsyncStorage helpers (users, tasks, session)
│ └── utils
│ └── notifications.ts # Toast notifications
├── App.tsx # Entry point, navigation + toaster provider
├── package.json
└── README.md

---

## 🛠️ Tech Stack

- [React Native](https://reactnative.dev/) (Expo)
- [React Navigation](https://reactnavigation.org/) for screen navigation
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) for persistence
- [expo-crypto](https://docs.expo.dev/versions/latest/sdk/crypto/) for password hashing
- [twrnc](https://github.com/jaredh159/tailwind-rn) for Tailwind-based styling
- [react-native-calendars](https://github.com/wix/react-native-calendars) for calendar integration
- [sonner-native](https://github.com/emilkowalski/sonner) for toast notifications
- TypeScript for type safety

---

## 📦 Installation & Running

1. **Clone repository**
   ```bash
   git clone https://github.com/k33ngtomide/teyd.git
   cd teyd
Install dependencies




🧑‍💻 Usage
  Sign up with a username & password (stored locally with hash).
  Login to start managing tasks.

On the Task List screen:
  View today’s tasks by default.
  Select another date from the calendar to filter tasks.
  Toggle completion by tapping a task.
  Delete a task with the delete button.

On the Add Task screen:
  Add a new task with title, optional description, and due date.
  Save to persist the task locally.

✨ Bonus Features
  Calendar filter & task markers
  Dark mode UI
  Toast notifications for feedback
  Secure password storage (SHA-256 hashing)


👤 Author
Sodiq Akintomide Muiliyu
📧 msodiqakintomide@gmail.com
github/k33ngtomide




