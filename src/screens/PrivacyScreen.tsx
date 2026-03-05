"use client";

import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { Feather } from "@expo/vector-icons";

type PrivacyScreenProp = NativeStackNavigationProp<RootStack, "PrivacyScreen">;

export default function PrivacyScreen() {
  const { applied } = useTheme();
  const navigation = useNavigation<PrivacyScreenProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Privacy Policy",
      headerStyle: {
        backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
      },
      headerTintColor: applied === "dark" ? "#ffffff" : "#000000",
    });
  }, [navigation, applied]);

  const bgColor = applied === "dark" ? "bg-black" : "bg-slate-50";
  const textColor = applied === "dark" ? "text-white" : "text-gray-900";
  const secondaryText = applied === "dark" ? "text-gray-400" : "text-gray-600";
  const cardBg = applied === "dark" ? "bg-slate-900" : "bg-white";

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`} edges={["right", "bottom", "left"]}>
      <StatusBar barStyle={applied === "dark" ? "light-content" : "dark-content"} />

      <View className="flex-1 p-5">
        <View className={`p-5 rounded-2xl ${cardBg} shadow-sm`}>
          <Text className={`text-lg font-bold mb-4 ${textColor}`}>
            Privacy Policy
          </Text>

          <Text className={`mb-4 ${secondaryText}`}>
            Last updated: {new Date().toLocaleDateString()}
          </Text>

          <Text className={`mb-3 ${textColor}`}>
            <Text className="font-semibold">1. Information We Collect</Text>
            {"\n"}
            We collect only the data necessary to provide our service:
            {"\n"}• First & last name{"\n"}• Phone number{"\n"}• Profile image (optional)
          </Text>

          <Text className={`mb-3 ${textColor}`}>
            <Text className="font-semibold">2. How We Use Your Data</Text>
            {"\n"}
            Your data is used solely to:
            {"\n"}• Enable messaging between users{"\n"}• Display your profile to contacts{"\n"}• Improve app functionality
          </Text>

          <Text className={`mb-3 ${textColor}`}>
            <Text className="font-semibold">3. Data Sharing</Text>
            {"\n"}
            We **never** sell or share your personal data with third parties. Your phone number is only visible to users you add as contacts.
          </Text>


          <Text className={`mb-3 ${textColor}`}>
            <Text className="font-semibold">5. Your Rights (GDPR)</Text>
            {"\n"}
            You have the right to:
            {"\n"}• Access your data{"\n"}• Correct inaccurate data{"\n"}• Delete your account and all associated data{"\n"}• Withdraw consent at any time
          </Text>

          

          <Text className={`mb-3 ${textColor}`}>
            <Text className="font-semibold">7. Contact Us</Text>
            {"\n"}
            Questions? Contact us at:
            {"\n"}📧 support@orbit.chat
          </Text>

          <Text className={`text-xs mt-6 ${secondaryText}`}>
            By using Orbit Chat, you agree to this Privacy Policy.
          </Text>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          className="mt-6 flex-row items-center justify-center py-3 bg-purple-600 rounded-xl"
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={18} color="white" />
          <Text className="ml-2 text-white font-medium">Back to Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}