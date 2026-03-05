import { useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";

type Props = NativeStackNavigationProp<RootStack, "OnboardingScreen1">;

export default function OnboardingScreen1() {
  const navigation = useNavigation<Props>();

  // Animations
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const illustrationScale = useSharedValue(0.8);
  const buttonScale = useSharedValue(0.8);

  useEffect(() => {
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    subtitleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    illustrationScale.value = withDelay(600, withTiming(1, { duration: 800 }));
    buttonScale.value = withDelay(800, withTiming(1, { duration: 600 }));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const illustrationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: illustrationScale.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-black justify-center items-center px-6">
      {/* Title */}
      <Animated.Text
        style={[titleStyle]}
        className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2 text-center"
      >
        Get Closer To EveryOne
      </Animated.Text>

      {/* Subtitle */}
      <Animated.Text
        style={[subtitleStyle]}
        className="text-sm text-purple-600 dark:text-purple-300 mb-8 text-center leading-relaxed"
      >
        Helps you to contact everyone with just easy way
      </Animated.Text>

      {/* Illustration */}
      <Animated.View style={[illustrationStyle]} className="w-full h-64 mb-8">
        <Image
          source={require("../../assets/onboarding1.png")} // Replace with your own!
          className="w-full h-full object-contain"
          resizeMode="contain"
        />
      </Animated.View>

      {/* Progress Dots */}
      <View className="flex-row space-x-2 mb-8">
        <View className="w-3 h-3 rounded-full bg-purple-600 dark:bg-purple-300" />
        <View className="w-3 h-3 rounded-full bg-purple-300 dark:bg-purple-600" />
        <View className="w-3 h-3 rounded-full bg-purple-300 dark:bg-purple-600" />
      </View>

      {/* Next Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("OnboardingScreen2")}
        className="w-full py-4 rounded-xl bg-purple-600 dark:bg-purple-500 active:opacity-90"
      >
        <Text className="text-white text-center font-medium">
          Next
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}