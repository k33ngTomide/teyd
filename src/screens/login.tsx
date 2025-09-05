import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "twrnc";
import {
  getLoggedInUser,
  setLoggedInUser,
  checkPassword,
  getUsers,
} from "../storage/storage";
import { notifyError, notifySuccess } from "../utils/notification";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      notifyError("Username and password are required");
      return;
    }

    const users = await getUsers();
    const user = users.find((user) => user.username === username);
    if (!user) {
      notifyError("User not found, Please sign up if you don’t have an account");
      return;
    }

    const validPassword = await checkPassword(username, password);
    if (!validPassword) {
      notifyError("Invalid username or password");
      return;
    }

    await setLoggedInUser(username);
    notifySuccess(`Welcome back, ${username}!`);
    navigation.navigate("TaskList" as never);
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-[#121212]`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`flex-grow justify-center p-5`}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo and App Name */}
        <View style={tw`items-center mb-10`}>
          <Image
            source={require("../../assets/icon.png")}
            style={tw`w-20 h-20 mb-2 rounded-full`}
          />
        </View>

        {/* Title */}
        <Text style={tw`text-xl font-bold mb-6 text-center text-white`}>
          Login
        </Text>

        {/* Username Input */}
        <TextInput
          style={tw`border border-gray-600 rounded-lg p-4 mb-4 text-white`}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        {/* Password Input with Eye Icon */}
        <View style={tw`relative mb-6`}>
          <TextInput
            style={tw`border border-gray-600 rounded-lg p-4 pr-10 text-white`}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={tw`absolute right-3 top-3`}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={tw`bg-blue-500 rounded-lg p-4`}
          onPress={handleLogin}
        >
          <Text style={tw`text-white text-center font-bold text-lg`}>
            Login
          </Text>
        </TouchableOpacity>

        {/* Don’t have an account CTA */}
        <View style={tw`mt-4 flex-row justify-center`}>
          <Text style={tw`text-gray-400`}>Don’t have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup" as never)}
          >
            <Text style={tw`text-blue-400 font-bold`}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
