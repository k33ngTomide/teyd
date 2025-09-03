import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "twrnc";
import {
  getLoggedInUser,
  setLoggedInUser,
  checkPassword,
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

    const user = await getLoggedInUser();
    if (!user) {
      notifyError("Please sign up if you don’t have an account");
      return;
    }

    const validPassword = await checkPassword(username, password);
    if (!validPassword) {
      notifyError("Invalid password");
      return;
    }

    await setLoggedInUser(username);
    notifySuccess(`Welcome back, ${username}!`);
  };

  return (
    <View style={tw`flex-1 justify-center p-5 bg-[#121212]`}>
      {/* Logo and App Name */}
      <View style={tw`items-center mb-10`}>
        <Image
          source={require("../../assets/icon.png")}
          style={tw`w-20 h-20 mb-2 rounded-full`}
        />
        {/* <Text style={tw`text-white text-2xl font-bold`}>Teyd</Text> */}
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
        <TouchableOpacity onPress={() => navigation.navigate("Signup" as never)}>
          <Text style={tw`text-blue-400 font-bold`}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
