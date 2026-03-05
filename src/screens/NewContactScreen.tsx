"use client";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, Text, TouchableOpacity, View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import {
  validateCountryCode,
  validateFirstName,
  validateLastName,
  validatePhoneNo,
} from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useSendNewContact } from "../socket/UseSendNewContact";
import { useTheme } from "../theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";

type NewContactScreenProp = NativeStackNavigationProp<
  RootStack,
  "NewContactScreen"
>;

export default function NewContactScreen() {
  const navigation = useNavigation<NewContactScreenProp>();
  const { applied } = useTheme();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <TouchableOpacity
          className="justify-center items-center"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-sharp" size={24} color={applied === "dark" ? "#C4B5FD" : "#7C3AED"} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <Text className={`font-bold text-xl ${applied === "dark" ? "text-purple-200" : "text-purple-900"}`}>
          New Contact
        </Text>
      ),
    });
  }, [navigation, applied]);

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const newContact = useSendNewContact();
  const sendNewContact = newContact.sendNewContact;

  const sendData = () => {
    const callingCode = country ? `+${country.callingCode}` : "+94";
    
    const firstNameValid = validateFirstName(firstName);
    const lastNameValid = validateLastName(lastName);
    const countryCodeValid = validateCountryCode(callingCode);
    const phoneNoValid = validatePhoneNo(phoneNo);

    if (firstNameValid) {
      Toast.show({ type: ALERT_TYPE.WARNING, title: "Warning", textBody: firstNameValid });
    } else if (lastNameValid) {
      Toast.show({ type: ALERT_TYPE.WARNING, title: "Warning", textBody: lastNameValid });
    } else if (countryCodeValid) {
      Toast.show({ type: ALERT_TYPE.WARNING, title: "Warning", textBody: countryCodeValid });
    } else if (phoneNoValid) {
      Toast.show({ type: ALERT_TYPE.WARNING, title: "Warning", textBody: phoneNoValid });
    } else {
      sendNewContact({
        id: 0,
        firstName,
        lastName,
        countryCode: callingCode,
        contactNo: phoneNo,
        createdAt: "",
        updatedAt: "",
        status: "",
        userName: "",
      });
      // Reset fields
      setFirstName("");
      setLastName("");
      setPhoneNo("");
    }
  };

  const bgColor = applied === "dark" ? "bg-black" : "bg-slate-50";
  const cardBg = applied === "dark" ? "bg-slate-900" : "bg-white";
  const textColor = applied === "dark" ? "text-purple-100" : "text-purple-900";
  const inputBg = applied === "dark" ? "bg-slate-800" : "bg-slate-100";
  const borderColor = applied === "dark" ? "border-purple-700" : "border-purple-300";

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="flex-1 px-5 pt-6"
      >
        {/* Form Card */}
        <View
          className={`rounded-2xl p-6 ${cardBg} shadow-lg`}
          style={{
            shadowColor: applied === "dark" ? "#4338ca" : "#c4b5fd",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* First Name */}
          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <Feather name="user" size={18} color={applied === "dark" ? "#C4B5FD" : "#7C3AED"} />
              <Text className={`ml-2 font-medium ${textColor}`}>First Name</Text>
            </View>
            <FloatingLabelInput
              label=""
              value={firstName}
              onChangeText={setFirstName}
              containerStyles={{
                backgroundColor: inputBg,
                borderRadius: 12,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: applied === "dark" ? "#4338ca" : "#c4b5fd",
              }}
              inputStyles={{ color: applied === "dark" ? "#E9D5FF" : "#1E293B", fontSize: 16 }}
              customLabelStyles={{ colorFocused: "#9333EA", colorBlurred: "#9CA3AF" }}
            />
          </View>

          {/* Last Name */}
          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <Feather name="user" size={18} color={applied === "dark" ? "#C4B5FD" : "#7C3AED"} />
              <Text className={`ml-2 font-medium ${textColor}`}>Last Name</Text>
            </View>
            <FloatingLabelInput
              label=""
              value={lastName}
              onChangeText={setLastName}
              containerStyles={{
                backgroundColor: inputBg,
                borderRadius: 12,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: applied === "dark" ? "#4338ca" : "#c4b5fd",
              }}
              inputStyles={{ color: applied === "dark" ? "#E9D5FF" : "#1E293B", fontSize: 16 }}
              customLabelStyles={{ colorFocused: "#9333EA", colorBlurred: "#9CA3AF" }}
            />
          </View>

          {/* Country Picker */}
          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <Ionicons name="earth" size={18} color={applied === "dark" ? "#C4B5FD" : "#7C3AED"} />
              <Text className={`ml-2 font-medium ${textColor}`}>Country</Text>
            </View>
            <Pressable
              onPress={() => setShow(true)}
              className={`flex-row items-center justify-between px-4 py-3 rounded-xl ${inputBg} border ${borderColor}`}
            >
              <CountryPicker
                countryCode={countryCode}
                withFlag
                withCountryNameButton
                withCallingCode
                visible={false}
                onSelect={() => {}}
              />
              <AntDesign name="caret-down" size={14} color={applied === "dark" ? "#C4B5FD" : "#7C3AED"} />
            </Pressable>
          </View>

          {/* Phone Number */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Feather name="phone" size={18} color={applied === "dark" ? "#C4B5FD" : "#7C3AED"} />
              <Text className={`ml-2 font-medium ${textColor}`}>Phone Number</Text>
            </View>
            <View className="flex-row gap-3">
              <View className="w-24">
                <FloatingLabelInput
                  label=""
                  editable={false}
                  value={country ? `+${country.callingCode}` : "+94"}
                  containerStyles={{
                    backgroundColor: inputBg,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderColor: applied === "dark" ? "#4338ca" : "#c4b5fd",
                  }}
                  inputStyles={{ color: applied === "dark" ? "#E9D5FF" : "#1E293B", fontSize: 16 }}
                />
              </View>
              <View className="flex-1">
                <FloatingLabelInput
                  label=""
                  inputMode="tel"
                  value={phoneNo}
                  onChangeText={setPhoneNo}
                  containerStyles={{
                    backgroundColor: inputBg,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderColor: applied === "dark" ? "#4338ca" : "#c4b5fd",
                  }}
                  inputStyles={{ color: applied === "dark" ? "#E9D5FF" : "#1E293B", fontSize: 16 }}
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            onPress={sendData}
            className="overflow-hidden rounded-xl"
          >
            <LinearGradient
              colors={["#9333ea", "#7c3aed", "#6366f1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 rounded-xl"
            >
              <Text className="text-white font-bold text-center text-lg">Save Contact</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Animated.View>

      
    </SafeAreaView>
  );
}