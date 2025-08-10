import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "@olive:onboarding";
const COUPLE_NAMES_KEY = "@olive:couple_names";

export const [OnboardingProvider, useOnboarding] = createContextHook(() => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setIsOnboarded(value === "completed");
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "completed");
      setIsOnboarded(true);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  }, []);

  const resetOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([ONBOARDING_KEY, COUPLE_NAMES_KEY]);
      setIsOnboarded(false);
    } catch (error) {
      console.error("Error resetting onboarding:", error);
    }
  }, []);

  const saveCoupleName = useCallback(async (partner1: string, partner2: string) => {
    try {
      await AsyncStorage.setItem(
        COUPLE_NAMES_KEY,
        JSON.stringify({ partner1, partner2 })
      );
    } catch (error) {
      console.error("Error saving couple names:", error);
    }
  }, []);

  return useMemo(() => ({
    isOnboarded,
    isLoading,
    completeOnboarding,
    resetOnboarding,
    saveCoupleName,
  }), [isOnboarded, isLoading, completeOnboarding, resetOnboarding, saveCoupleName]);
});