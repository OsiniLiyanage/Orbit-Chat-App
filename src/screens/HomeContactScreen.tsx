"use client";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { User } from "../socket/chat";
import { useUserList } from "../socket/UseUserList";
import { useTheme } from "../theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";

type HomeContactScreenProp = NativeStackNavigationProp<RootStack, "HomeContactScreen">;

export default function HomeContactScreen() {
  const navigation = useNavigation<HomeContactScreenProp>();
  const { applied } = useTheme();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const users = useUserList();

  const searchWidthAnim = useRef(new Animated.Value(0)).current;
  const logoOpacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(searchWidthAnim, {
        toValue: searchVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(logoOpacityAnim, {
        toValue: searchVisible ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [searchVisible]);

  const toggleSearch = () => {
    if (searchVisible) {
      setSearchText("");
    }
    setSearchVisible((prev) => !prev);
  };

  const closeSearch = () => {
    setSearchVisible(false);
    setSearchText("");
  };


  const filteredUsers = [...users]
    .filter((user) => {
      return (
        user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.contactNo.includes(searchText)
      );
    })
    .sort((a, b) => a.firstName.localeCompare(b.firstName));

  const bgColor = applied === "dark" ? "bg-black" : "bg-white";
  const textColor = applied === "dark" ? "text-white" : "text-gray-900";
  const headerTextColor = "text-white";
  const secondaryText = applied === "dark" ? "text-gray-400" : "text-gray-600";
  const listItemBg = applied === "dark" ? "bg-slate-900" : "bg-white";
  const iconColor = "#FFFFFF";
  const modalBg = applied === "dark" ? "bg-slate-800" : "bg-white";
  const modalItemBorder = applied === "dark" ? "border-slate-700" : "border-slate-200";

  const gradientColors: readonly [string, string, string] =
    applied === "dark"
      ? ["#1e3a8a", "#4338ca", "#6366f1"]
      : ["#2563eb", "#4f46e5", "#6366f1"];

  const searchBarStyle = {
    width: searchWidthAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "70%"],
    }),
    opacity: searchWidthAnim,
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <TouchableOpacity
          className="justify-center items-center"
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View className="flex-row items-center gap-2">
          <Image source={require("../../assets/logo.png")} className="h-8 w-8" />
          <Text className={`font-bold text-xl ${headerTextColor}`}>Orbit Chat</Text>
        </View>
      ),
      headerRight: () => (
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={toggleSearch}>
            <Ionicons name="search" size={24} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color={iconColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, applied, searchVisible]);

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      className={`flex-row items-center py-3 px-4 border-b border-gray-100 ${listItemBg}`}
      onPress={() => {
        const profileImage = item.profileImage
          ? item.profileImage
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.firstName)}+${encodeURIComponent(item.lastName)}&background=ff6b6b&color=ffffff`;

        navigation.replace("SingleChatScreen", {
          chatId: item.id,
          friendName: `${item.firstName} ${item.lastName}`,
          lastSeenTime: item.updatedAt,
          profileImage,
        });
      }}
    >
      <View className="h-12 w-12 rounded-full overflow-hidden">
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} className="h-12 w-12 rounded-full" />
        ) : (
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.firstName)}+${encodeURIComponent(item.lastName)}&background=ff6b6b&color=ffffff`,
            }}
            className="h-12 w-12 rounded-full"
          />
        )}
      </View>
      <View className="flex-1 ml-3">
        <Text className={`font-bold text-base ${textColor}`}>{item.firstName} {item.lastName}</Text>
        <Text className={`text-sm ${secondaryText}`} numberOfLines={1}>
          Hey there! I am using Orbit!
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`} edges={["right", "bottom", "left"]}>
      <StatusBar barStyle={applied === "dark" ? "light-content" : "dark-content"} />

      {/* ✅ YOUR ORBIT HEADER — UNTOUCHED */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="h-20 justify-center items-center flex-row px-4 shadow-lg"
      >
        <Animated.View
          style={{ opacity: logoOpacityAnim }}
          className="flex-1 flex-row items-center"
          pointerEvents={searchVisible ? "none" : "auto"}
        >
          <Image source={require("../../assets/logo.png")} className="h-8 w-8" />
          <Text className={`font-bold text-xl ml-2 ${headerTextColor}`}>Discover new Friends!</Text>
        </Animated.View>

        <Animated.View
          style={[searchBarStyle, { position: "absolute", left: 16 }]}
          className="flex-row items-center bg-white/20 rounded-full px-3 h-12"
          pointerEvents={searchVisible ? "auto" : "none"}
        >
          <Ionicons name="search" size={18} color="#FFFFFF" />
          <TextInput
            className="flex-1 text-base font-medium px-2 text-white"
            placeholder="Search"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={searchVisible}
          />
          {searchVisible && (
            <TouchableOpacity onPress={closeSearch}>
              <Ionicons name="close-circle" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </Animated.View>

        <TouchableOpacity onPress={toggleSearch} className="ml-3">
          <Ionicons name="search" size={24} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity className="ml-3">
          <Ionicons name="ellipsis-vertical" size={24} color={iconColor} />
        </TouchableOpacity>
      </LinearGradient>

      {/* ✅ New Contact Row */}
      <TouchableOpacity
        className={`flex-row items-center py-3 px-4 border-b border-gray-100 ${listItemBg}`}
        onPress={() => navigation.navigate("NewContactScreen")}
      >
        <View className="h-12 w-12 rounded-full bg-purple-600 justify-center items-center">
          <Ionicons name="person-add" size={20} color="white" />
        </View>
        <Text className={`font-bold text-base ml-3 ${textColor}`}>New Contact</Text>
      </TouchableOpacity>

      {/* ✅ User List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </SafeAreaView>
  );
}