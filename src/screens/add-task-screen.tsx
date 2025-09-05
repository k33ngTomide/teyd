// screens/AddTaskScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, SafeAreaView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { addTask, getLoggedInUser } from "../storage/storage";
import tw from "twrnc";
import { notifyError } from "../utils/notification";
import { Ionicons } from "@expo/vector-icons";

export default function AddTaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const navigation = useNavigation();

  const handleAdd = async () => {
    if (!title.trim()) {
      alert("Task title is required!");
      return;
    }
    const username = await getLoggedInUser();
    if (!username) { 
      notifyError("No logged in user found!");
      return
    };

    await addTask(username, {
      title,
      description,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#121212] p-4 px-4`}>
      <View style={tw`items-center mb-2 flex-row  my-3 rounded-lg px-2 py-2 mb-8`}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }} 
        >
          <Ionicons name="chevron-back" size={35} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold text-white ml-6`}>Add Task</Text>

      </View>


      <TextInput
        placeholder="Task Title"
        placeholderTextColor="#9ca3af"
        value={title}
        onChangeText={setTitle}
        style={tw`border border-gray-600 p-3 mb-4 rounded text-white mx-3`}
      />
      <TextInput
        placeholder="Description (optional)"
        placeholderTextColor="#9ca3af"
        value={description}
        onChangeText={setDescription}
        style={tw`border border-gray-600 p-3 mb-4 rounded text-white mx-3`}
      />

      <TouchableOpacity
        style={tw`border border-gray-600 p-3 rounded mb-4 mx-3`}
        onPress={() => setShowPicker(true)}
      >
        <Text style={tw`text-gray-300`}>
          {dueDate
            ? `Due: ${dueDate.toDateString()}`
            : "Select a Due Date"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event: any, selectedDate: any) => {
            setShowPicker(Platform.OS === "ios");
            if (selectedDate) {setDueDate(selectedDate); setShowPicker(false);};
          }}
        />
      )}

      <TouchableOpacity
        style={tw`bg-blue-500 py-6 rounded mx-3 mt-2`}
        onPress={handleAdd}
      >
        <Text style={tw`text-white text-center font-bold`}>Add Task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
