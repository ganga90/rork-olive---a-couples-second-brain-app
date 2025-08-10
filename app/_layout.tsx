import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OnboardingProvider } from "@/providers/OnboardingProvider";
import { CoupleProvider } from "@/providers/CoupleProvider";
import { NotesProvider } from "@/providers/NotesProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="note/[id]" options={{ 
        presentation: "modal",
        headerShown: true,
        title: "Note Details"
      }} />
      <Stack.Screen name="ask-olive" options={{ 
        presentation: "modal",
        headerShown: true,
        title: "Ask Olive"
      }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OnboardingProvider>
          <CoupleProvider>
            <NotesProvider>
              <RootLayoutNav />
            </NotesProvider>
          </CoupleProvider>
        </OnboardingProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}