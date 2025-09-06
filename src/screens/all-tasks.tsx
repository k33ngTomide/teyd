import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  getSortedTasks,
  toggleTask,
  deleteTask,
  getLoggedInUser,
  Task,
} from "../storage/storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

export default function ViewAllTasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    const load = async () => {
      const user = await getLoggedInUser();
      if (user) {
        setUsername(user);
        const data = await getSortedTasks(user);
        setTasks(data);
      }
    };
    if (isFocused) load();
  }, [isFocused]);

  const handleToggle = async (id: string) => {
    if (!username) return;
    await toggleTask(username, id);
    const updated = await getSortedTasks(username);
    setTasks(updated);
  };

  const handleDelete = async (id: string) => {
    if (!username) return;
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTask(username, id);
          const updated = await getSortedTasks(username);
          setTasks(updated);
        },
      },
    ]);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={tw`flex-1 bg-[#121212] p-4`}>
      {/* Title */}
      <View style={tw`items-center mb-2 flex-row  my-3 rounded-lg px-2 py-2 mb-8`}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back" size={35} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold text-white ml-4`}>All Tasks</Text>
      </View>

      {/* Search / Filter Bar */}
      <TextInput
        style={tw`border border-gray-600 rounded-lg p-3 mb-4 text-white`}
        placeholder="Search tasks..."
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
      />

      {filteredTasks.length === 0 ? (
        <Text style={tw`text-gray-400`}>No tasks found.</Text>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={tw.style(
                `flex-row justify-between items-center p-3 mb-2 border rounded`,
                item.completed
                  ? `bg-[#1f2937] border-gray-700`
                  : `bg-[#1e3a8a] border-blue-400`
              )}
            >
              <TouchableOpacity
                style={tw`flex-1`}
                onPress={() => handleToggle(item.id)}
              >
                <Text
                  style={tw.style(
                    `text-lg text-white`,
                    item.completed ? `line-through text-gray-500` : ``
                  )}
                >
                  {item.title}
                </Text>
                {item.description ? (
                  <Text style={tw`text-sm text-gray-400`}>
                    {item.description}
                  </Text>
                ) : null}
                {item.dueDate ? (
                  <Text style={tw`text-xs text-gray-500`}>
                    Due: {new Date(item.dueDate).toDateString()}
                  </Text>
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={tw`ml-2 bg-red-600 px-3 py-1 rounded`}
              >
                <Text style={tw`text-white`}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
