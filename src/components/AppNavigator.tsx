// AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/splash";
import LoginScreen from "../screens/login";
import SignupScreen from "../screens/signup";
import AddTaskScreen from "../screens/add-task-screen";
import TaskListScreen from "../screens/task-list";
import ViewAllTasksScreen from "../screens/all-tasks";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  TaskList: undefined;
  AddTask: undefined;
  AllTasks: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const animations = [
  "slide_from_right",
  "slide_from_left",
  "slide_from_bottom",
  "fade",
] as const;

function getRandomAnimation() {
  const index = Math.floor(Math.random() * animations.length);
  return animations[index];
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="TaskList" component={TaskListScreen} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
        <Stack.Screen name="AllTasks" component={ViewAllTasksScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
