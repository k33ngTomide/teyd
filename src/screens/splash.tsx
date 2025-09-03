// splash.tsx
import React, { useEffect, useRef } from "react";
import { View, Image, Animated, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getLoggedInUser } from "../storage/storage";

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start zoom in-out animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Check user data after short delay
    const checkUser = async () => {
      try {
        const userData = await getLoggedInUser();
        setTimeout(() => {
          if (userData) {
            console.log("User data found:", userData);
            navigation.replace("TaskList");
          } else {
            navigation.navigate("Signup");
          }
        }, 2000);
      } catch (error) {
        console.error("Error fetching user data", error);
        navigation.navigate("Login");
      }
    };

    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/icon.png")}
        style={[styles.icon, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // you can adjust to dark/light later
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 150,
    height: 100,
    borderRadius: 50,
  },
});
