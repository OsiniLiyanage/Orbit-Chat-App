"use client";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Text, TouchableOpacity, View, Animated } from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState, useRef, useEffect } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserProfile } from "../socket/UseUserProfile";
import { AuthContext } from "../components/AuthProvider";
import { uploadProfileImage } from "../api/UserService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

type ProfileScreenProp = NativeStackNavigationProp<RootStack, "ProfileScreen">;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProp>();
  const { applied } = useTheme();
  const userProfile = useUserProfile();
  const auth = useContext(AuthContext);

  // Animation for profile image
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const [image, setImage] = useState<string | null>(null);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      if (auth?.userId) {
        uploadProfileImage(String(auth.userId), result.assets[0].uri);
      }
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Profile",
      headerStyle: {
        backgroundColor: applied === "dark" ? "black" : "white",
      },
      headerTintColor: applied === "dark" ? "white" : "black",
    });
  }, [navigation, applied]);

  // Theme colors
  const bgColor = applied === "dark" ? "bg-black" : "bg-white";
  const textColor = applied === "dark" ? "text-white" : "text-gray-900";
  const secondaryText = applied === "dark" ? "text-gray-400" : "text-gray-600";
  const borderColor = applied === "dark" ? "border-gray-700" : "border-gray-200";
  const iconColor = applied === "dark" ? "#C4B5FD" : "#6B7280";

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`} edges={["right", "bottom", "left"]}>
      <View className="flex-1 p-5">
        {/* Profile Header */}
        <View className="items-center mb-6">
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              onPress={pickImage}
              className="h-32 w-32 rounded-full border-4 border-purple-600 overflow-hidden"
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="h-32 w-32"
                  resizeMode="cover"
                />
              ) : userProfile?.profileImage ? (
                <Image
                  source={{ uri: userProfile.profileImage }}
                  className="h-32 w-32"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-32 w-32 bg-gray-200 justify-center items-center">
                  <Feather name="user" size={48} color="#9CA3AF" />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
          <Text className={`font-bold text-2xl mt-4 ${textColor}`}>
            {userProfile?.firstName} {userProfile?.lastName}
          </Text>
          <Text className={`italic text-sm ${secondaryText}`}>
            {userProfile?.status === "ONLINE" ? "Online" : "Online"}
          </Text>
        </View>

        {/* Profile Details */}
        <View className={`p-4 rounded-xl ${applied === "dark" ? "bg-slate-900" : "bg-white"} shadow-lg`}>
          {/* Name */}
          <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
            <View className="flex-row items-center">
              <Feather name="user" size={20} color={iconColor} />
              <Text className={`ml-2 font-medium ${textColor}`}>Name</Text>
            </View>
            <View className="flex-row items-center">
              <Text className={`font-semibold ${textColor}`}>
                {userProfile?.firstName} {userProfile?.lastName}
              </Text>
              <TouchableOpacity className="ml-2">
                <Feather name="edit-2" size={18} color={iconColor} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Phone */}
          <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
            <View className="flex-row items-center">
              <Feather name="phone" size={20} color={iconColor} />
              <Text className={`ml-2 font-medium ${textColor}`}>Phone</Text>
            </View>
            <View className="flex-row items-center">
              <Text className={`font-semibold ${textColor}`}>
                {userProfile?.countryCode} {userProfile?.contactNo}
              </Text>
              <TouchableOpacity className="ml-2">
                <Feather name="edit-2" size={18} color={iconColor} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Username */}
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Feather name="mail" size={20} color={iconColor} />
              <Text className={`ml-2 font-medium ${textColor}`}>Username</Text>
            </View>
            <View className="flex-row items-center">
              <Text className={`font-semibold ${textColor}`}>
                {userProfile?.userName || "Ghgvg"}
              </Text>
              <TouchableOpacity className="ml-2">
                <Feather name="edit-2" size={18} color={iconColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          className="mt-6 bg-purple-600 h-14 items-center justify-center rounded-xl"
          onPress={() => {
            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: "success",
              textBody: "Profile Updated Successful!",
            });
          }}
        >
          <Text className="text-white font-bold text-lg">Edit Profile</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          className="mt-4 bg-red-100 h-14 items-center justify-center rounded-xl"
          onPress={async () => {
            if (auth) {
              await auth.signOut();
              //navigation.replace("SignInScreen");
            }
          }}
        >
          <Text className="text-red-600 font-bold text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}