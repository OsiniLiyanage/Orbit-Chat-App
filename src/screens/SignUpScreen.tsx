"use client";

import { KeyboardAvoidingView, Platform, Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { useRef, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Animated } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeProvider";
import { useUserRegistration } from "../components/UserContext"; // Keep this
import { validateFirstName, validateLastName, validateUserName } from "../util/Validation"; // Add validation
import { ALERT_TYPE, Toast } from "react-native-alert-notification"; // Add Toast

type SignUpProps = NativeStackNavigationProp<RootStack, "SignUpScreen">;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpProps>();
  const { applied } = useTheme();
  const { userData, setUserData } = useUserRegistration();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // ✅ Theme-based colors
  const bgColor = applied === "dark" ? "#000000" : "#f8fafc";
  const textColor = applied === "dark" ? "#f1f5f9" : "#1e293b";
  const placeholderColor = applied === "dark" ? "#a78bfa" : "#9ca3af";
  const borderColor = applied === "dark" ? "#5b21b6" : "#d1d5db";
  const loginBg = applied === "dark" ? "#1e1b4b" : "#ffffff";
  const loginTextColor = applied === "dark" ? "#c4b5fd" : "#7c3aed";
  const iconColor = applied === "dark" ? "#c4b5fd" : "#6b7280";

  return (
    <View className="flex-1" style={{ backgroundColor: bgColor }}>
      <StatusBar barStyle={applied === "dark" ? "light-content" : "dark-content"} />

      {/* Curved Purple Header */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        }}
      >
        <LinearGradient
          colors={["#9333ea", "#7c3aed", "#6366f1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="h-64 relative"
        >
          <SafeAreaView className="flex-1">
            <View className="flex-row items-center justify-between px-5 pt-4">
              <Pressable
                onPress={() => navigation.goBack()}
                style={{
                  backgroundColor: loginBg,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 999,
                }}
                className="flex-row items-center"
              >
                <Ionicons name="arrow-back" size={20} color={loginTextColor} />
                <Text
                  style={{ color: loginTextColor }}
                  className="ml-2 font-semibold text-base"
                >
                  Login
                </Text>
              </Pressable>
              <Text className="text-white font-bold text-2xl">Register</Text>
            </View>
          </SafeAreaView>

          {/* Curved Bottom */}
          <View
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{ backgroundColor: bgColor }}
          >
            <LinearGradient
              colors={["#9333ea", "#7c3aed", "#6366f1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 100,
                borderBottomLeftRadius: 1000,
                borderBottomRightRadius: 1000,
              }}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        className="flex-1"
      >
        <Animated.ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View className="flex-1 px-6 pt-12">
            <Text
              style={{ color: textColor }}
              className="text-2xl font-bold mb-2"
            >
              What should people call you?
            </Text>

            <View className="mt-6 space-y-4">
              {/* Username */}
              <View className="mb-6">
                <View
                  className="flex-row items-center pb-2"
                  style={{ borderBottomWidth: 2, borderBottomColor: borderColor }}
                >
                  <Ionicons name="person" size={24} color={iconColor} />
                  <FloatingLabelInput
                    label="User Name"
                    value={userData.userName || ""}
                    onChangeText={(text) => {
                      setUserData((prev) => ({
                        ...prev,
                        userName: text,
                      }));
                    }}
                    containerStyles={{
                      flex: 1,
                      borderWidth: 0,
                      paddingHorizontal: 12,
                      marginBottom: 15,
                    }}
                    customLabelStyles={{
                      colorFocused: "#9333ea",
                      colorBlurred: placeholderColor,
                      fontSizeFocused: 12,
                    }}
                    inputStyles={{
                      color: textColor,
                      fontSize: 14,
                    }}
                  />
                </View>
              </View>

              {/* First Name */}
              <View className="mb-6">
                <View
                  className="flex-row items-center pb-2"
                  style={{ borderBottomWidth: 2, borderBottomColor: borderColor }}
                >
                  <Ionicons name="person-outline" size={24} color={iconColor} />
                  <FloatingLabelInput
                    label="First Name"
                    value={userData.firstName || ""}
                    onChangeText={(text) => {
                      setUserData((prev) => ({
                        ...prev,
                        firstName: text,
                      }));
                    }}
                    containerStyles={{
                      flex: 1,
                      borderWidth: 0,
                      paddingHorizontal: 12,
                      marginBottom: 15,
                    }}
                    customLabelStyles={{
                      colorFocused: "#9333ea",
                      colorBlurred: placeholderColor,
                      fontSizeFocused: 12,
                    }}
                    inputStyles={{
                      color: textColor,
                      fontSize: 16,
                    }}
                  />
                </View>
              </View>

              {/* Last Name */}
              <View className="mb-6">
                <View
                  className="flex-row items-center pb-2"
                  style={{ borderBottomWidth: 2, borderBottomColor: borderColor }}
                >
                  <Ionicons name="person-outline" size={24} color={iconColor} />
                  <FloatingLabelInput
                    label="Last Name"
                    value={userData.lastName || ""}
                    onChangeText={(text) => {
                      setUserData((prev) => ({
                        ...prev,
                        lastName: text,
                      }));
                    }}
                    containerStyles={{
                      flex: 1,
                      borderWidth: 0,
                      paddingHorizontal: 12,
                      marginBottom: 15,
                    }}
                    customLabelStyles={{
                      colorFocused: "#9333ea",
                      colorBlurred: placeholderColor,
                      fontSizeFocused: 12,
                    }}
                    inputStyles={{
                      color: textColor,
                      fontSize: 16,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Continue Button — PURPLE! */}
          <View className="px-6 pb-40 pt-4">
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => {
                  // ✅ Validation logic from your example
                  const validUserName = validateUserName(userData.userName);
                  const validFirstName = validateFirstName(userData.firstName);
                  const validLastName = validateLastName(userData.lastName);
                  // Add username validation if needed
                  //const validUserName = userData.userName?.trim() ? null : "Username is required";

                  if (validUserName) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: validUserName,
                    });
                  } else if (validFirstName) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: validFirstName,
                    });
                  } else if (validLastName) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: validLastName,
                    });
                  } else {
                    navigation.navigate("ContactScreen");
                  }
                }}
                className="overflow-hidden rounded-full"
              >
                <LinearGradient
                  colors={["#9333ea", "#7c3aed", "#6366f1"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="h-14 justify-center items-center"
                >
                  <Text className="text-white font-bold text-lg">Continue</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}