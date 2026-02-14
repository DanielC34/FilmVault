import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Film, Search, List, User } from "lucide-react-native";
import { THEME } from "../../constants";
import HomeScreen from "./home";
import SearchScreen from "./search";
import ListsScreen from "./lists";
import ProfileScreen from "./profile";

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          if (route.name === "home") {
            icon = <Film size={size} color={color} />;
          } else if (route.name === "search") {
            icon = <Search size={size} color={color} />;
          } else if (route.name === "lists") {
            icon = <List size={size} color={color} />;
          } else if (route.name === "profile") {
            icon = <User size={size} color={color} />;
          }
          return icon;
        },
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: THEME.textMuted,
        tabBarStyle: {
          backgroundColor: THEME.surface,
          borderTopColor: THEME.primary,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 8,
          paddingTop: 8,
          height: Platform.OS === "ios" ? 80 + insets.bottom : 60,
        },
        headerStyle: {
          backgroundColor: THEME.surface,
          borderBottomColor: THEME.primary,
          borderBottomWidth: 1,
        },
        headerTintColor: THEME.primary,
        headerTitleStyle: {
          color: THEME.text,
          fontWeight: "600",
        },
        contentStyle: {
          backgroundColor: THEME.background,
        },
      })}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{ title: "Trending" }}
      />
      <Tab.Screen
        name="search"
        component={SearchScreen}
        options={{ title: "Search" }}
      />
      <Tab.Screen
        name="lists"
        component={ListsScreen}
        options={{ title: "My Vaults" }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
