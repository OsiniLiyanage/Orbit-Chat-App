import { useEffect } from "react";
import { StatusBar, View, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useWebSocketPing } from "../socket/UseWebSocketPing";

type Props = NativeStackNavigationProp<RootStack, "SplashScreen">;

export default function SplashScreen() {
  const navigation = useNavigation<Props>();

 
  useWebSocketPing(60000); 

  
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  // dots
  const dot1Opacity = useSharedValue(0);
  const dot2Opacity = useSharedValue(0);
  const dot3Opacity = useSharedValue(0);

  useEffect(() => {
   
    logoScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
    logoOpacity.value = withTiming(1, { duration: 800 });

   
    logoRotate.value = withSequence(
      withTiming(5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      withRepeat(
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );

    
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

  
    setTimeout(() => {
      dot1Opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.4, { duration: 600 })
        ),
        -1,
        true
      );
      dot2Opacity.value = withDelay(
        200,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0.4, { duration: 600 })
          ),
          -1,
          true
        )
      );
      dot3Opacity.value = withDelay(
        400,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0.4, { duration: 600 })
          ),
          -1,
          true
        )
      );


      // return () => clearTimeout(timer);
    }, 1000);
  }, [navigation]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
    opacity: logoOpacity.value,
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
  }));

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-slate-50 dark:bg-black">
      <StatusBar hidden={true} />

      <Animated.View
        style={[pulseAnimatedStyle, {
          position: 'absolute',
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          backgroundColor: 'rgba(196, 181, 253, 0.22)',
          borderRadius: 999,
          shadowColor: '#C4B5FD',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.45,
          shadowRadius: 20,
        }]}
      />


      <Animated.View
        style={[pulseAnimatedStyle, {
          position: 'absolute',
          top: -120,
          right: -120,
          width: 320,
          height: 320,
          backgroundColor: 'rgba(216, 180, 254, 0.18)',
          borderRadius: 999,
          shadowColor: '#D8B4FE',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 22,
        }]}
      />

      <Animated.View
        style={[pulseAnimatedStyle, {
          position: 'absolute',
          bottom: 50,
          left: 90,
          width: 160,
          height: 160,
          backgroundColor: 'rgba(165, 180, 252, 0.16)',
          borderRadius: 999,
          shadowColor: '#A5B4FC',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.38,
          shadowRadius: 18,
        }]}
      />

     
      <Animated.View
        style={[pulseAnimatedStyle, {
          position: 'absolute',
          bottom: -160,
          right: -140,
          width: 360,
          height: 360,
          backgroundColor: 'rgba(233, 213, 255, 0.14)',
          borderRadius: 999,
          shadowColor: '#E9D5FF',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.35,
          shadowRadius: 24,
        }]}
      />

     
      <Animated.View style={logoAnimatedStyle} className="items-center">
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: 320, height: 320 }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Loading Dots */}
      <View className="flex-row mt-8 space-x-6">
        {[dot1Style, dot2Style, dot3Style].map((style, i) => (
          <Animated.View
            key={i}
            style={[style, {
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#C4B5FD',
              shadowColor: '#C4B5FD',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 8,
            }]}
          />
        ))}
      </View>

      {/* App Info */}
      <View style={{ position: 'absolute', bottom: 50, alignItems: 'center' }}>
        <Text className="text-sm font-bold text-purple-600 opacity-80 dark:text-purple-200">
          POWERED BY: {process.env.EXPO_PUBLIC_APP_OWNER || 'Your Company'}
        </Text>
        <Text className="text-sm font-bold text-purple-600 opacity-50 dark:text-purple-200">
          VERSION: {process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0'}
        </Text>
      </View>
    </SafeAreaView>
  );
}