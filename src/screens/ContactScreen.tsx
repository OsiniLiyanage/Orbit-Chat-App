"use client";

import { useState, useRef, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
  Animated,
} from "react-native";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeProvider";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { validateCountryCode, validatePhoneNo } from "../util/Validation";
import { useUserRegistration } from "../components/UserContext";

type ContactProps = NativeStackNavigationProp<RootStack, "ContactScreen">;

export default function ContactScreen() {
  const navigation = useNavigation<ContactProps>();
  const { applied } = useTheme();
  //const { userData, setUserData } = useUserRegistration();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  // State
  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [phoneNo, setPhoneNo] = useState("");
    const { userData, setUserData } = useUserRegistration();
  const [callingCode, setCallingCode] = useState("+94");

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
                <AntDesign name="arrow-left" size={20} color={loginTextColor} />
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
              className="text-2xl font-bold mb-4 text-center"
            >
              Almost there!
            </Text>
            <Text
              style={{ color: applied === "dark" ? "#c7d2fe" : "#64748b" }}
              className="text-center mb-8"
            >
              We use your contacts to help you find friends who are already on the app. Your contacts stay private.
            </Text>

            {/* Country Picker */}
            <View className="mb-6">
              <Pressable
                onPress={() => setShow(true)}
                className="flex-row items-center justify-between px-4 py-3 rounded-xl"
                style={{
                  borderWidth: 1,
                  borderColor: borderColor,
                  backgroundColor: applied === "dark" ? "#1e293b" : "#ffffff",
                }}
              >
                <CountryPicker
                  countryCode={countryCode}
                  withFlag
                  withCountryNameButton
                  withCallingCode
                  visible={false}
                  onSelect={() => {}}
                />
                <AntDesign
                  name="caret-down"
                  size={16}
                  color={iconColor}
                />
              </Pressable>
            </View>

            {/* Phone Input */}
            <View className="flex-row mb-8">
              <View
                className="justify-center items-center rounded-l-xl px-4"
                style={{
                  borderWidth: 1,
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                  borderColor: borderColor,
                  backgroundColor: applied === "dark" ? "#1e293b" : "#f1f5f6",
                  height: 56,
                  minWidth: 80,
                }}
              >
                <TextInput style={{ color: textColor }} className="font-bold text-lg"
                inputMode="tel"
                //className="h-16 font-bold text-lg border-y-2 border-y-green-600 w-[18%]"
                placeholder="+94"
                editable={false}
                value={country ? `+${country.callingCode}` : callingCode}
                onChangeText={(text) => {
                  setCallingCode(text);
                }}
              />
              </View>
              <TextInput
                inputMode="tel"
                placeholder="77 #### ###"
                placeholderTextColor={applied === "dark" ? "#a78bfa" : "#9ca3af"}
                value={phoneNo}
                onChangeText={(text) => {
                  setPhoneNo(text);
                }}
                className="flex-1 h-18 px-4 rounded-r-xl text-lg font-bold"
                style={{
                  borderWidth: 1,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: 12,
                  borderBottomRightRadius: 12,
                  borderColor: borderColor,
                  backgroundColor: applied === "dark" ? "#1e293b" : "#ffffff",
                  color: textColor,
                }}
              />
            </View>
          </View>

          {/* Continue Button */}
          <View className="px-6 pb-40 pt-4">
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => {
                  // ✅ Validation & data saving logic from your example
                  const callingCode = country ? `+${country.callingCode}` : "+94";
                  const validCountryCode = validateCountryCode(callingCode);
                  const validPhoneNo = validatePhoneNo(phoneNo);

                  if (validCountryCode) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: validCountryCode,
                    });
                  } else if (validPhoneNo) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: validPhoneNo,
                    });
                  } else {
                    // ✅ Save to context like your example
                    setUserData((previous) => ({
                      ...previous,
                      countryCode: callingCode,
                      contactNo: phoneNo,
                    }));
                    navigation.replace("AvatarScreen");
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

      {/* Country Picker Modal */}
      <CountryPicker
        countryCode={countryCode}
        withFilter
        withFlag
        withCountryNameButton
        withCallingCode
        visible={show}
        onClose={() => setShow(false)}
        onSelect={(selectedCountry) => {
          setCountryCode(selectedCountry.cca2);
          setCountry(selectedCountry);
          setShow(false);
        }}
      />
    </View>
  );
}