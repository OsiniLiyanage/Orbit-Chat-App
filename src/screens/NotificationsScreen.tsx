"use client";

import { Text, TouchableOpacity, View, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { Ionicons } from "@expo/vector-icons";

type NotificationsScreenProp = NativeStackNavigationProp<RootStack, "NotificationsScreen">;

export default function NotificationsScreen() {
  const { applied } = useTheme();
  const navigation = useNavigation<NotificationsScreenProp>();
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Notifications",
      headerStyle: {
        backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
      },
      headerTintColor: applied === "dark" ? "#ffffff" : "#000000",
    });
  }, [navigation, applied]);

  const bgColor = applied === "dark" ? "bg-black" : "bg-slate-50";
  const cardBg = applied === "dark" ? "bg-slate-900" : "bg-white";
  const textColor = applied === "dark" ? "text-white" : "text-gray-900";
  const secondaryText = applied === "dark" ? "text-gray-400" : "text-gray-600";
  const dividerColor = applied === "dark" ? "border-gray-800" : "border-gray-200";

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`} edges={["right", "bottom", "left"]}>
      <StatusBar barStyle={applied === "dark" ? "light-content" : "dark-content"} />

      <View className="flex-1 p-5">
        {/* Notification Settings Card */}
        <View className={`p-5 rounded-2xl ${cardBg} shadow-sm mb-6`}>
          <Text className={`font-bold text-lg mb-4 ${textColor}`}>Message Notifications</Text>

          <View className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <Text className={`font-medium ${textColor}`}>New Messages</Text>
            <Switch
              value={messageNotifications}
              onValueChange={setMessageNotifications}
              trackColor={{ false: "#d1d5db", true: "#c4b5fd" }}
              thumbColor={messageNotifications ? "#7c3aed" : "#f3f4f6"}
            />
          </View>

          <View className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <Text className={`font-medium ${textColor}`}>Group Chats</Text>
            <Switch
              value={groupNotifications}
              onValueChange={setGroupNotifications}
              trackColor={{ false: "#d1d5db", true: "#c4b5fd" }}
              thumbColor={groupNotifications ? "#7c3aed" : "#f3f4f6"}
            />
          </View>

          <View className="flex-row items-center justify-between py-3">
            <Text className={`font-medium ${textColor}`}>Sound</Text>
            <Switch
              value={sound}
              onValueChange={setSound}
              trackColor={{ false: "#d1d5db", true: "#c4b5fd" }}
              thumbColor={sound ? "#7c3aed" : "#f3f4f6"}
            />
          </View>
        </View>

        {/* Advanced Settings Card */}
        <View className={`p-5 rounded-2xl ${cardBg} shadow-sm`}>
          <Text className={`font-bold text-lg mb-4 ${textColor}`}>Advanced</Text>

          <View className="flex-row items-center justify-between py-3">
            <Text className={`font-medium ${textColor}`}>Vibration</Text>
            <Switch
              value={vibration}
              onValueChange={setVibration}
              trackColor={{ false: "#d1d5db", true: "#c4b5fd" }}
              thumbColor={vibration ? "#7c3aed" : "#f3f4f6"}
            />
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          className="mt-6 flex-row items-center justify-center py-3 bg-purple-600 rounded-xl"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={18} color="white" />
          <Text className="ml-2 text-white font-medium">Back to Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}