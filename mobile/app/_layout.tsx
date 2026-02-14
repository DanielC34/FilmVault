import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useStore } from "../store/useStore";
import { StatusBar } from "expo-status-bar";
import { THEME } from "../constants";

export default function RootLayout() {
  const { init } = useStore();

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: THEME.surface,
          },
          headerTintColor: THEME.primary,
          headerTitleStyle: {
            fontWeight: "bold",
            color: THEME.text,
          },
          contentStyle: {
            backgroundColor: THEME.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modals" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
