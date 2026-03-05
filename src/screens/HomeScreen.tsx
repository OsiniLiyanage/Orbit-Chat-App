"use client";

import { useState, useRef, useEffect, useContext } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useChatList } from "../socket/UseChatList";
import { formatChatTime } from "../util/DateFormatter";
import { Chat } from "../socket/chat";
import { AuthContext } from "../components/AuthProvider";
import { CommonActions } from "@react-navigation/native";

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps>();
  const { applied } = useTheme();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const searchWidthAnim = useRef(new Animated.Value(0)).current;
  const logoOpacityAnim = useRef(new Animated.Value(1)).current;
  const auth = useContext(AuthContext);
 
  const chatList = useChatList();

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

 
  const filteredChats = [...chatList]
    .filter((chat) => {
      return (
        chat.friendName.toLowerCase().includes(searchText.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchText.toLowerCase())
      );
    })
    .sort(
      (a, b) =>
        new Date(b.lastTimeStamp).getTime() -
        new Date(a.lastTimeStamp).getTime()
    );

  const bgColor = applied === "dark" ? "bg-black" : "bg-white";
  const textColor = applied === "dark" ? "text-white" : "text-gray-900";
  const headerTextColor = "text-white";
  const secondaryText = applied === "dark" ? "text-gray-400" : "text-gray-600";
  const listItemBg = applied === "dark" ? "bg-slate-900" : "bg-white";
  const iconColor = "#FFFFFF";
  const modalBg = applied === "dark" ? "bg-slate-800" : "bg-white";
  const modalItemBorder =
    applied === "dark" ? "border-slate-700" : "border-slate-200";

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

  return (
    <SafeAreaView
      className={`flex-1 ${bgColor}`}
      edges={["right", "bottom", "left"]}
    >
      <StatusBar barStyle="light-content" />

     
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
          <Image
            source={require("../../assets/logo.png")}
            className="h-14 w-14"
          />
          <Text className={`font-bold text-xl ml-2 ${headerTextColor}`}>
            Orbit Chat
          </Text>
        </Animated.View>

        <Animated.View
          style={[searchBarStyle, { position: "absolute", left: 16 }]}
          className="flex-row items-center bg-white/20 rounded-full px-3 h-15"
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

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="ml-3"
        >
          <Ionicons name="ellipsis-vertical" size={24} color={iconColor} />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={filteredChats}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }: { item: Chat }) => (
          <TouchableOpacity
            className={`flex-row items-center py-3 px-4 border-b border-gray-100 ${listItemBg}`}
            onPress={() => {
             
              const profileImage = item.profileImage
                ? item.profileImage
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    item.friendName
                  )}&background=ff6b6b&color=ffffff`;

              navigation.navigate("SingleChatScreen", {
                chatId: item.friendId,
                friendName: item.friendName,
                lastSeenTime: formatChatTime(item.lastTimeStamp),
                profileImage,
              });
            }}
          >
            <View className="h-12 w-12 rounded-full overflow-hidden">
              {item.profileImage ? (
                <Image
                  source={{ uri: item.profileImage }}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <Image
                  source={{
                    uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      item.friendName
                    )}&background=ff6b6b&color=ffffff`,
                  }}
                  className="h-12 w-12 rounded-full"
                />
              )}
            </View>
            <View className="flex-1 ml-3">
              <View className="flex-row justify-between items-center">
                <Text className={`font-bold text-base ${textColor}`}>
                  {item.friendName}
                </Text>
                <Text className={`text-xs ${secondaryText}`}>
                  {formatChatTime(item.lastTimeStamp)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-1">
                <Text
                  className={`text-sm ${secondaryText} flex-1`}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
                {item.unreadCount > 0 && (
                  <View className="bg-cyan-500 rounded-full min-w-[24px] h-6 justify-center items-center px-2 ml-2">
                    <Text className="text-white text-xs font-bold">
                      {item.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => String(item.friendId)}
      />

      {/* Modal */}
      <Modal
        animationType="fade"
        visible={isModalVisible}
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            className="flex-1 justify-start items-end p-4 pt-20"
            onPress={(e) => e.stopPropagation()}
          >
            <View
              className={`rounded-xl w-48 p-2 ${modalBg}`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 10,
              }}
            >
              <TouchableOpacity
                className={`py-3 px-3 border-b ${modalItemBorder}`}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("SettingScreen");
                }}
              >
                <Text className={`font-semibold text-base ${textColor}`}>
                  Settings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 px-3"
                onPress={async () => {
                  if (auth) {
                    await auth.signOut();
                    //navigation.navigate("SignInScreen");
                     
                    
                  }
                }}
              >
                <Text className={`font-semibold text-base ${textColor}`}>
                  Log out
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
