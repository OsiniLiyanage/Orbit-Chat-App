import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { View, Text, TouchableOpacity, useColorScheme } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import HomeContactScreen from "./HomeContactScreen"
import ProfileScreen from "./ProfileScreen"

import ChatsScreen from "./ChatsScreen"

const Tabs = createBottomTabNavigator()

function CustomTabBarButton({ route, isFocused, onPress, onLongPress }: any) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  let iconName = "chatbubble-ellipses"
  let label = route.name

  if (route.name === "Chats") {
    iconName = "chatbubble-ellipses"
    label = "Chats"
  } else if (route.name === "contacts") {
    iconName = "people"
    label = "contacts"
  } else if (route.name === "profile") {
    iconName = "person"
    label = "Profile"
  } else if (route.name === "Calls") {
    iconName = "call"
    label = "calls"
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
      }}
    >
      {isFocused ? (
        <LinearGradient
          colors={["#9333ea", "#7c3aed"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
          }}
        >
          <Ionicons name={iconName as any} size={24} color="#ffffff" />
        </LinearGradient>
      ) : (
        <View
          style={{
            width: 56,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
          }}
        >
          <Ionicons name={iconName as any} size={24} color={isDark ? "#9ca3af" : "#6b7280"} />
        </View>
      )}
      <Text
        style={{
          fontSize: 12,
          fontWeight: isFocused ? "600" : "400",
          color: isFocused ? (isDark ? "#ffffff" : "#000000") : isDark ? "#9ca3af" : "#6b7280",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export default function HomeTabs() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  return (
    <Tabs.Navigator
      screenOptions={{
        
        tabBarStyle: {
          height: 80,
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          borderTopWidth: 1,
          borderTopColor: isDark ? "#374151" : "#e5e7eb",
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
      }}
      tabBar={(props) => {
        const { state, descriptors, navigation } = props

        return (
          <View
            style={{
              flexDirection: "row",
              height: 80,
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              borderTopWidth: 1,
              borderTopColor: isDark ? "#374151" : "#e5e7eb",
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            {state.routes.map((route: any, index: number) => {
              const { options } = descriptors[route.key]
              const isFocused = state.index === index

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                })

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name)
                }
              }

              const onLongPress = () => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                })
              }

              return (
                <CustomTabBarButton
                  key={route.key}
                  route={route}
                  isFocused={isFocused}
                  onPress={onPress}
                  onLongPress={onLongPress}
                />
              )
            })}
          </View>
        )
      }}
    >
      <Tabs.Screen name="Chats" component={ChatsScreen} options={{ headerShown: false }} />
      <Tabs.Screen name="contacts" component={HomeContactScreen} options={{ headerShown: false }} />
      <Tabs.Screen name="profile" component={ProfileScreen} />
      
    </Tabs.Navigator>
  )
}
