import { Tabs, useRouter } from "expo-router";
import { Home, List, User } from "lucide-react-native";
import React, { useEffect, useCallback } from "react";
import { useOnboarding } from "@/providers/OnboardingProvider";
import { colors } from "@/constants/colors";

export default function TabLayout() {
  const router = useRouter();
  const { isOnboarded, isLoading } = useOnboarding();

  const handleNavigation = useCallback(() => {
    if (!isLoading && !isOnboarded) {
      router.replace("/onboarding");
    }
  }, [isLoading, isOnboarded, router]);

  useEffect(() => {
    handleNavigation();
  }, [handleNavigation]);

  if (!isOnboarded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.olive,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Notes",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: "Lists",
          tabBarIcon: ({ color }) => <List size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}