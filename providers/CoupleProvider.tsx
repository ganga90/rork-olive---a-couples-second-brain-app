import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COUPLE_NAMES_KEY = "@olive:couple_names";
const CURRENT_USER_KEY = "@olive:current_user";

export const [CoupleProvider, useCouple] = createContextHook(() => {
  const [partner1, setPartner1] = useState("Partner 1");
  const [partner2, setPartner2] = useState("Partner 2");
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    loadCoupleData();
  }, []);

  const loadCoupleData = async () => {
    try {
      const namesData = await AsyncStorage.getItem(COUPLE_NAMES_KEY);
      const currentUserData = await AsyncStorage.getItem(CURRENT_USER_KEY);
      
      if (namesData) {
        const { partner1: p1, partner2: p2 } = JSON.parse(namesData);
        setPartner1(p1);
        setPartner2(p2);
        
        if (currentUserData) {
          setCurrentUser(currentUserData);
        } else {
          setCurrentUser(p1);
          await AsyncStorage.setItem(CURRENT_USER_KEY, p1);
        }
      }
    } catch (error) {
      console.error("Error loading couple data:", error);
    }
  };

  const switchUser = useCallback(async () => {
    const newUser = currentUser === partner1 ? partner2 : partner1;
    setCurrentUser(newUser);
    await AsyncStorage.setItem(CURRENT_USER_KEY, newUser);
  }, [currentUser, partner1, partner2]);

  return useMemo(() => ({
    partner1,
    partner2,
    currentUser,
    switchUser,
  }), [partner1, partner2, currentUser, switchUser]);
});