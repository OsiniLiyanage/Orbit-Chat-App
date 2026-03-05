"use client";

import { useState, useRef, useEffect, useContext } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeProvider";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { validateProfileImage } from "../util/Validation";
import { createNewAccount } from "../api/UserService";
import { useUserRegistration } from "../components/UserContext";
import { AuthContext } from "../components/AuthProvider";

type AvatarProps = NativeStackNavigationProp<RootStack, "AvatarScreen">;

export default function AvatarScreen() {
  const navigation = useNavigation<AvatarProps>();
  const { applied } = useTheme();

  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const { userData, setUserData } = useUserRegistration();

  // Theme colors
  const bgColor = applied === "dark" ? "#000000" : "#f8fafc";
  const textColor = applied === "dark" ? "#f1f5f9" : "#1e293b";
  const borderColor = applied === "dark" ? "#5b21b6" : "#d1d5db";
  const loginBg = applied === "dark" ? "#1e1b4b" : "#ffffff";
  const loginTextColor = applied === "dark" ? "#c4b5fd" : "#7c3aed";
  const iconColor = applied === "dark" ? "#c4b5fd" : "#6b7280";

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setUserData((previous) => ({
        ...previous,
        profileImage: uri,
      }));
    }
  };

  const avatars = [
    require("../../assets/avatar/avatar_1.png"),
    require("../../assets/avatar/avatar_2.png"),
    require("../../assets/avatar/avatar_3.png"),
    require("../../assets/avatar/avatar_4.png"),
    require("../../assets/avatar/avatar_5.png"),
    require("../../assets/avatar/avatar_6.png"),
  ];

   const auth = useContext(AuthContext);

  const handleCreateAccount = async () => {
    const validProfile = validateProfileImage(
      userData.profileImage
        ? { uri: userData.profileImage, type: "", fileSize: 0 }
        : null
    );

    if (validProfile) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: "Select a profile image or an avatar",
      });
      return;
    }
    console.log(userData);

    try {
      setLoading(true);
      const response = await createNewAccount(userData);
      if (response.status) {
         const id = response.userId;
                    if (auth) {
                      await auth.signUp(String(id));
                      // navigation.replace("HomeScreen");
                    }
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Warning",
          textBody: response.message,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: bgColor }}>
      <StatusBar barStyle={applied === "dark" ? "light-content" : "dark-content"} />

      {/* Animated Curved Purple Header */}
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
                  Back
                </Text>
              </Pressable>
              <Text className="text-white font-bold text-2xl">Register</Text>
            </View>
          </SafeAreaView>

          {/* Curved Bottom Cutout */}
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
            className="text-2xl font-bold mb-4 text-center"
          >
            Choose a profile image
          </Text>

          {/* Profile Image Picker */}
          <View className="items-center mt-4">
            <Pressable
              className="h-[120] w-[120] rounded-full bg-gray-100 justify-center items-center border-2 border-dashed"
              style={{
                borderColor: borderColor,
                backgroundColor: applied === "dark" ? "#1e293b" : "#f1f5f6",
              }}
              onPress={pickImage}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="h-[120] w-[120] rounded-full"
                />
              ) : (
                <View className="items-center">
                  <Text className={`font-bold text-2xl ${applied === "dark" ? "text-purple-200" : "text-purple-800"}`}>+</Text>
                  <Text className={`font-bold text-lg ${applied === "dark" ? "text-purple-200" : "text-purple-800"}`}>
                    Add Image
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Or Select an Avatar */}
          <Text
            style={{ color: textColor }}
            className="text-lg my-2 text-center font-bold mt-6"
          >
            Or select an avatar
          </Text>

          {/* Avatar Grid */}
          <FlatList
            data={avatars}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  const uri = Image.resolveAssetSource(item).uri;
                  setImage(uri);
                  setUserData((previous) => ({
                    ...previous,
                    profileImage: uri,
                  }));
                }}
              >
                <Image
                  source={item}
                  className="h-20 w-20 rounded-full mx-2"
                  style={{
                    borderWidth: 2,
                    borderColor: applied === "dark" ? "#5b21b6" : "#d1d5db",
                  }}
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Create Account Button */}
        <View className="px-6 pb-40 pt-4">
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleCreateAccount}
              disabled={loading}
              className="overflow-hidden rounded-full"
            >
              <LinearGradient
                colors={["#9333ea", "#7c3aed", "#6366f1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-14 justify-center items-center"
              >
                {loading ? (
                  <ActivityIndicator size={"small"} color={"white"} />
                ) : (
                  <Text className="text-white font-bold text-lg">Create Account</Text>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}