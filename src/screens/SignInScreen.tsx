"use client";

import { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useTheme } from "../theme/ThemeProvider";
import { AuthContext } from "../components/AuthProvider";


import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";

type Props = NativeStackNavigationProp<RootStack, "SignInScreen">;

export default function SignInScreen() {
  const navigation = useNavigation<Props>();
  const { applied } = useTheme();
  const auth = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Animations
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const illustrationScale = useSharedValue(0.8);
  const buttonScale = useSharedValue(0.8);

  useEffect(() => {
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    subtitleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    formOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    illustrationScale.value = withDelay(500, withTiming(1, { duration: 800 }));
    buttonScale.value = withDelay(900, withTiming(1, { duration: 600 }));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_APP_URL}/OrbitBackend/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        if (auth) {
          await auth.signUp(String(data.userId));
          navigation.replace("HomeScreen");
        }
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Unable to connect to server. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-black justify-center px-6">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="absolute top-12 left-6 p-2 rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <Text className="text-xl font-bold text-slate-700 dark:text-slate-300">
          ←
        </Text>
      </TouchableOpacity>

      <View className="flex-1 justify-center mt-8">
        <Animated.View style={[titleStyle]}>
          <Text className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">
            Hello, Welcome Back
          </Text>
          <Text className="text-sm text-purple-600 dark:text-purple-300 mb-6">
            Happy to see you again. To use your account please login first.
          </Text>
        </Animated.View>

        <Animated.View style={[formStyle]}>
          <Text className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">
            Username
          </Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            className="w-full h-12 px-4 mb-4 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-purple-900 dark:text-purple-100"
            placeholder="your_username"
            placeholderTextColor="#9333EA"
            autoCapitalize="none"
          />

          <Text className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            className="w-full h-12 px-4 mb-6 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-purple-900 dark:text-purple-100"
            placeholder="••••••••"
            placeholderTextColor="#9333EA"
            secureTextEntry
          />

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="w-full py-3 rounded-xl bg-purple-600 dark:bg-purple-500 active:opacity-90"
          >
            <Animated.Text
              style={[buttonStyle]}
              className="text-white text-center font-medium"
            >
              Login
            </Animated.Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-0.5 bg-slate-300 dark:bg-slate-700" />
            <Text className="mx-4 text-sm text-slate-500 dark:text-slate-400">
              Or continue with
            </Text>
            <View className="flex-1 h-0.5 bg-slate-300 dark:bg-slate-700" />
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className="text-sm text-slate-600 dark:text-slate-300">
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpScreen")}
              className="ml-1"
            >
              <Text className="text-sm font-medium text-purple-600 dark:text-purple-300">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
