import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { showModal } from "./extras/customModal";
import { clearLocalAuthData } from "../lib/offlineAuth";
import NetInfo from "@react-native-community/netinfo";
import { useState, useEffect } from "react";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const [isOffline, setIsOffline] = useState(false);

  // Monitor network state
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    // Initial check
    NetInfo.fetch().then((state) => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    showModal(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear local auth data first
              await clearLocalAuthData();

              // Then sign out with Clerk (this will fail silently if offline)
              await signOut();

              if (isOffline) {
                showModal(
                  "Offline Logout",
                  "You've been logged out locally. You will need to sign in again when back online.",
                  [{ text: "OK" }],
                  "info",
                );
              }
            } catch (error) {
              console.error("Error during sign out:", error);
              showModal(
                "Error",
                "There was a problem signing out. Please try again.",
                [{ text: "OK" }],
                "error",
              );
            }
          },
        },
      ],
      "confirm",
    );
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  );
};
