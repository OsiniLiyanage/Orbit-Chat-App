"use client";

import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect, useState, useContext } from "react"; 
import { Ionicons } from "@expo/vector-icons";
import { useSingleChat } from "../socket/UseSingleChat";
import { Chat } from "../socket/chat";
import { formatChatTime } from "../util/DateFormatter";
import { useSendChat } from "../socket/UseSendChat";
import { useTheme } from "../theme/ThemeProvider";
import { AuthContext } from "../components/AuthProvider"; 

type SingleChatScreenProps = NativeStackScreenProps<
  RootStack,
  "SingleChatScreen"
>;

export default function SingleChatScreen({
  route,
  navigation,
}: SingleChatScreenProps) {
  const { applied } = useTheme();
  const auth = useContext(AuthContext); 


  const myUserId = auth?.userId ? parseInt(auth.userId, 10) : null;

  const { chatId, friendName, lastSeenTime, profileImage } = route.params;
  
  const friendId = chatId;

  const singleChat = useSingleChat(friendId); 
  const messages = singleChat.messages;
  const friend = singleChat.friend;
  const sendMessageHook = useSendChat();
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="justify-center items-center"
            onPress={() => {
              navigation.navigate("HomeScreen");
            }}
          >
            <Ionicons name="arrow-back-sharp" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="h-14 w-14 rounded-full border-1 border-gray-300 justify-center items-center">
            <Image
              source={{ uri: profileImage }}
              className="h-14 w-14 rounded-full"
            />
          </TouchableOpacity>
          <View className="space-y-2">
            <Text className="font-bold text-2xl">
              {friend ? friend.firstName + " " + friend.lastName : friendName}
            </Text>
            <Text className="italic text-xs font-bold text-purple-600">Online</Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <View className="flex-row gap-4">
          <TouchableOpacity>
            <Ionicons name="videocam" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, friend, profileImage, friendName]); // Added dependencies

  const renderItem = ({ item }: { item: Chat }) => {
    // Determine if the message was sent by the current user
    // Ensure myUserId is available and item.from.id exists before comparing
    const isMe = myUserId !== null && item.from?.id === myUserId;

    return (
      <View
        className={`my-1 px-3 py-2 max-w-[75%] ${
          isMe
            ? `self-end bg-purple-600 rounded-tl-xl rounded-bl-xl rounded-br-xl` // Sent by me (purple)
            : `rounded-tr-xl rounded-bl-xl rounded-br-xl self-start bg-white border border-gray-200` // Received (white/grey)
        }`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text className={`text-base ${isMe ? "text-white" : "text-black"}`}>
          {item.message}
        </Text>
        <View className="flex-row justify-end items-center mt-1">
          <Text className={`text-xs italic me-2 ${isMe ? "text-purple-200" : "text-gray-500"}`}>
            {formatChatTime(item.createdAt)}
          </Text>
          {isMe && (
            <Ionicons
              name={
                item.status === "READ"
                  ? "checkmark-done-sharp"
                  : item.status === "DELIVERED"
                  ? "checkmark-done-sharp"
                  : "checkmark"
              }
              size={16}
              color={item.status === "READ" ? "#0284c7" : "#9ca3af"}
            />
          )}
        </View>
      </View>
    );
  };

  const handleSendChat = () => {
    if (!input.trim() || !friendId) return; // Ensure input and friendId are valid
    sendMessageHook(friendId, input); // Send message to friendId
    setInput("");
  };

  return (
    <SafeAreaView
      className={`flex-1 ${applied === "dark" ? "bg-black" : "bg-white"}`}
      edges={["right", "bottom", "left"]}
    >
      <StatusBar barStyle={applied === "dark" ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "android" ? 0 : 50}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        {/* Messages List */}
        <FlatList
          data={messages}
          renderItem={renderItem}
          className="px-3 flex-1"
          inverted // Newest messages at the bottom
          keyExtractor={(item, index) => index.toString()} // Consider using item.id if available and unique
          contentContainerStyle={{ paddingBottom: 60 }}
        />

        {/* Input Bar */}
        <View className={`flex-row items-end p-2 ${applied === "dark" ? "bg-black" : "bg-white"}`}>
          <TextInput
            value={input}
            onChangeText={setInput}
            multiline
            placeholder="Type a message"
            placeholderTextColor={applied === "dark" ? "#9ca3af" : "#6b7280"}
            className={`flex-1 min-h-14 max-h-32 h-auto px-5 py-2 rounded-3xl text-base ${
              applied === "dark" ? "bg-slate-900 text-white" : "bg-gray-200 text-black"
            }`}
          />
          <TouchableOpacity
            className={`bg-purple-600 w-14 h-14 items-center justify-center rounded-full ml-2`}
            onPress={handleSendChat}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
