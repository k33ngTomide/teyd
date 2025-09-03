// App.tsx
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/components/AppNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
   <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
          <AppNavigator />
          <Toaster />
      </SafeAreaProvider>
    </GestureHandlerRootView>
)}
