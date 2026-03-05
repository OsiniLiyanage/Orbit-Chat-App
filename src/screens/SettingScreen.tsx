"use client";

import { Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";

const themeOptions = [
  { key: "light", label: "Light", icon: "sun" },
  { key: "dark", label: "Dark", icon: "moon" },
  { key: "system", label: "System", icon: "smartphone" },
];

type SettingScreenProp = NativeStackNavigationProp<RootStack, "SettingScreen">;

export default function SettingScreen() {
  const { preference, applied, setPreference } = useTheme();
  const navigation = useNavigation<SettingScreenProp>();
  const auth = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
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
  const iconColor = applied === "dark" ? "#C4B5FD" : "#7C3AED";
  const dividerColor = applied === "dark" ? "border-gray-800" : "border-gray-200";

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            if (auth) {
              await auth.signOut();
              navigation.replace("SignInScreen");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`} edges={["right", "bottom", "left"]}>
      <StatusBar barStyle={applied === "dark" ? "light-content" : "dark-content"} />

      <View className="flex-1 p-5">
        {/* Theme Section */}
        <View className={`p-5 rounded-2xl ${cardBg} mb-6 shadow-sm`}>
          <Text className={`font-bold text-lg mb-4 ${textColor}`}>Appearance</Text>
          <View className="flex-row flex-wrap gap-3">
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl flex-row items-center justify-center ${
                  preference === option.key
                    ? "bg-purple-600 border-2 border-purple-500"
                    : `${applied === "dark" ? "bg-slate-800" : "bg-slate-100"}`
                }`}
                onPress={() => setPreference(option.key as any)}
              >
                <Feather name={option.icon as any} size={16} color={preference === option.key ? "white" : iconColor} />
                <Text
                  className={`ml-2 font-medium ${
                    preference === option.key ? "text-white" : textColor
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Section */}
        <View className={`p-5 rounded-2xl ${cardBg} mb-4 shadow-sm`}>
          <Text className={`font-bold text-lg mb-3 ${textColor}`}>Account</Text>
          
          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <View className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 justify-center items-center">
              <Ionicons name="person" size={18} color={iconColor} />
            </View>
            <Text className={`ml-4 font-medium ${textColor}`}>My Profile</Text>
            <Ionicons name="chevron-forward" size={20} color={secondaryText} className="ml-auto" />
          </TouchableOpacity>
          <View className={`h-px ${dividerColor} my-2`} />
          
          <TouchableOpacity className="flex-row items-center py-3" onPress={() => navigation.navigate("NotificationsScreen")}>
            <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 justify-center items-center">
              <Ionicons name="notifications" size={18} color="#3B82F6" />
            </View>
            <Text className={`ml-4 font-medium ${textColor}`}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={secondaryText} className="ml-auto" />
          </TouchableOpacity>
          <View className={`h-px ${dividerColor} my-2`} />
          
          <TouchableOpacity className="flex-row items-center py-3" onPress={() => navigation.navigate("PrivacyScreen")}>
            <View className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 justify-center items-center">
              <Ionicons name="lock-closed" size={18} color="#10B981" />
            </View>
            <Text className={`ml-4 font-medium ${textColor}`}>Privacy</Text>
            <Ionicons name="chevron-forward" size={20} color={secondaryText} className="ml-auto" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="mt-6 py-4 bg-red-100 dark:bg-red-900/20 rounded-xl flex-row items-center justify-center"
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color="#EF4444" />
          <Text className="ml-2 font-bold text-red-600 dark:text-red-400">Log Out</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View className="mt-8 items-center">
          <Text className={`text-sm ${secondaryText}`}>
            Orbit Chat v{process.env.EXPO_PUBLIC_APP_VERSION || "1.0"}
          </Text>
          <Text className={`text-xs mt-1 ${secondaryText} text-center`}>
            © {new Date().getFullYear()} {process.env.EXPO_PUBLIC_APP_OWNER || "Orbit Chat"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}