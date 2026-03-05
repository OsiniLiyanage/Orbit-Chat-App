import { NavigationContainer } from "@react-navigation/native";
import "./global.css";
import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./src/screens/SplashScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SettingScreen from "./src/screens/SettingScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import OnboardingScreen1 from "./src/screens/OnboardingScreen1";
import OnboardingScreen2 from "./src/screens/OnboardingScreen2";
import OnboardingScreen3 from "./src/screens/OnboardingScreen3";
import ContactScreen from "./src/screens/ContactScreen";
import AvatarScreen from "./src/screens/AvatarScreen";
import { UserRegistrationProvider } from "./src/components/UserContext";
import { AlertNotificationRoot } from "react-native-alert-notification";
import HomeTabs from "./src/screens/HomeTabs";
import NewChatScreen from "./src/screens/NewChatScreen";
import SingleChatScreen from "./src/screens/SingleChatScreen";
import { useWebSocketPing } from "./src/socket/UseWebSocketPing";
import { WebSocketProvider } from "./src/socket/WebSocketProvider";
import NewContactScreen from "./src/screens/NewContactScreen";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./src/components/AuthProvider";
import SignOutScreen from "./src/screens/SignOut";
import PrivacyScreen from "./src/screens/PrivacyScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
//import { NotificationsScreen } from "./src/screens/NotificationsScreen";
const Stack = createNativeStackNavigator<RootStack>();
export type RootStack = {
  SplashScreen: undefined;
  OnboardingScreen1: undefined;
  OnboardingScreen2: undefined;
  OnboardingScreen3: undefined;
  SignUpScreen: undefined;
  ContactScreen: undefined;
  AvatarScreen: undefined;
  SignInScreen: undefined;
  HomeScreen: undefined;
  SettingScreen: undefined;
  ProfileScreen: undefined;
  SingleChatScreen: {
    chatId: number;
    friendName: string;
    lastSeenTime: string;
    profileImage: string;
  };
  NewChatScreen: undefined;
  NewContactScreen: undefined;
  HomeContactScreen: undefined;
  SignOutScreen: undefined;
  PrivacyScreen: undefined;
  NotificationsScreen: undefined;
};
function ChatApp() {
  //useWebSocketPing(4000 * 60); // 1000 * 60 * 4
  const auth = useContext(AuthContext);

  return (
    <WebSocketProvider userId={auth ? Number(auth.userId) : 0}>
      <ThemeProvider>
        <UserRegistrationProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="SplashScreen"
              screenOptions={{
                animation: "fade",
              }}
            >
              {auth?.isLoading ? (
                <Stack.Screen
                  name="SplashScreen"
                  component={SplashScreen}
                  options={{ headerShown: false }}
                />
              ) : auth?.userId === null ? (
                // User not sign up
                <Stack.Group>
                  <Stack.Screen
                    name="OnboardingScreen1"
                    component={OnboardingScreen1}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="OnboardingScreen2"
                    component={OnboardingScreen2}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="OnboardingScreen3"
                    component={OnboardingScreen3}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="SignInScreen"
                    component={SignInScreen}
                    options={{ headerShown: false }}
                  />
                  

                  <Stack.Screen
                    name="SignUpScreen"
                    component={SignUpScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="ContactScreen"
                    component={ContactScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="AvatarScreen"
                    component={AvatarScreen}
                    options={{ headerShown: false }}
                  />

                </Stack.Group>
              ) : (
                // When user sign up completed
                <Stack.Group>
                  <Stack.Screen
                    name="HomeScreen"
                    component={HomeTabs}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="SingleChatScreen"
                    component={SingleChatScreen}
                  />

                  <Stack.Screen
                    name="ProfileScreen"
                    component={ProfileScreen}
                  />
                  <Stack.Screen
                    name="SettingScreen"
                    component={SettingScreen}
                  />
                  <Stack.Screen
                    name="NewChatScreen"
                    component={NewChatScreen}
                  />

                  <Stack.Screen
                    name="NewContactScreen"
                    component={NewContactScreen}
                  />
                  <Stack.Screen
                    name="SignOutScreen"
                    component={SignOutScreen}
                  />
                  <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
                  <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
                </Stack.Group>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </UserRegistrationProvider>
      </ThemeProvider>
    </WebSocketProvider>
  );
}
export default function App() {
  // const USER_ID =2; // can use AsyncStorage
  return (
    <AlertNotificationRoot>
      <AuthProvider>
        <ChatApp />
      </AuthProvider>
    </AlertNotificationRoot>
  );
}
