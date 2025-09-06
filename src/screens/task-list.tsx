// screens/TaskListScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import {
  getSortedTasks,
  toggleTask,
  deleteTask,
  getLoggedInUser,
  Task,
  setLoggedInUser,
} from "../storage/storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";


export default function TaskListScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0] // today
  );

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

  // Filter tasks by selected date
  const filteredTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate).toISOString().split("T")[0] === selectedDate
  );

  // Mark dates with tasks
  const markedDates: { [date: string]: any } = {};
  tasks.forEach((task) => {
    if (task.dueDate) {
      const date = new Date(task.dueDate).toISOString().split("T")[0];
      markedDates[date] = {
        marked: true,
        dotColor: "#60a5fa", // blue-400
      };
    }
  });

  // Highlight selected date
  markedDates[selectedDate] = {
    ...(markedDates[selectedDate] || {}),
    selected: true,
    selectedColor: "#2563eb", // stronger blue
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#121212] px-2 py-2`}>
      <View style={tw`items-center mb-2 flex-row justify-between my-3 bg-blue-500 rounded-lg px-3`}>
        <Text style={tw`text-2xl font-bold text-white  p-2 rounded items-center`}>
          Welcome {username}!
        </Text>

        <TouchableOpacity 
          onPress={() => {
            setLoggedInUser("");
            navigation.navigate("Login" as never);
          }} >
        <Ionicons name="power" size={24} color="red" />
        </TouchableOpacity>
      </View>

      <Calendar
        theme={{
          calendarBackground: "#121212",
          dayTextColor: "white",
          monthTextColor: "white",
          textDisabledColor: "#555",
          todayTextColor: "#60a5fa",
          selectedDayBackgroundColor: "#2563eb",
          arrowColor: "#60a5fa",
        }}
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        initialDate={selectedDate}
      />

      <View style={tw`flex-1 p-4`}>

        <View style={tw`items-center mb-2 flex-row rounded-lg px-2 py-2 mb-2`}>
          <Text style={tw`text-2xl font-bold text-white mr-8`}>
            {new Date(selectedDate).toDateString()}
          </Text>

          <TouchableOpacity
            style={tw`bg-blue-600 bg-opacity-20 rounded-full ml-6 px-3 py-1`}
            onPress={() => navigation.navigate("AllTasks" as never)}
          >
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-blue-600 bg-opacity-20 rounded-full ml-4 px-3 py-1`}
            onPress={() => navigation.navigate("AddTask" as never)}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>

        </View>
        
        {filteredTasks.length === 0 ? (
          <Text style={tw`text-gray-400`}>No tasks for this day.</Text>
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

    </SafeAreaView>
  );
}

