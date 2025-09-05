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
import tw from "twrnc";
import Ionicons from "react-native-vector-icons/Ionicons";
import { addUser } from "../storage/storage";
import { notifyError, notifySuccess } from "../utils/notification";
import { useNavigation } from "@react-navigation/native";

export default function SignupScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!username || !password || !confirmPassword) {
      notifyError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      notifyError("Passwords do not match");
      return;
    }

    await addUser(username, password);
    notifySuccess("Account created successfully! You can now log in.");
    navigation.navigate("Login" as never);
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
        <Text style={tw`text-[27px] font-bold mb-6 text-center text-white`}>
          Create Account
        </Text>

        {/* Username */}
        <TextInput
          style={tw`border border-gray-600 rounded-lg p-4 mb-4 text-white`}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        {/* Password */}
        <View style={tw`relative mb-4`}>
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
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <View style={tw`relative mb-6`}>
          <TextInput
            style={tw`border border-gray-600 rounded-lg p-4 pr-10 text-white`}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={tw`absolute right-3 top-3`}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={tw`bg-blue-500 rounded-lg p-3`}
          onPress={handleSignup}
        >
          <Text style={tw`text-white text-center font-bold`}>Sign Up</Text>
        </TouchableOpacity>

        {/* Already have an account */}
        <View style={tw`mt-4 flex-row justify-center`}>
          <Text style={tw`text-gray-400`}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login" as never)}
          >
            <Text style={tw`text-blue-400 font-bold`}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
