import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { getLocalAuthData } from "../../lib/offlineAuth";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { showModal } from "../../components/extras/customModal";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();
  const [hasOfflineAuth, setHasOfflineAuth] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for offline authentication data
  useEffect(() => {
    const checkOfflineAuth = async () => {
      try {
        const authData = await getLocalAuthData();
        setHasOfflineAuth(!!authData && !authData.isExpired);
      } catch (error) {
        console.error("Error checking offline auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOfflineAuth();
  }, []);

  // Monitor network state
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);

      // Show a notification when going offline if there's valid offline auth
      if (!state.isConnected && hasOfflineAuth) {
        showModal(
          "Offline Mode",
          "You are now offline. Limited features will be available.",
          [{ text: "OK" }],
          "info",
        );
      }
    });

    // Initial check
    NetInfo.fetch().then((state) => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, [hasOfflineAuth]);

  // Allow navigation to main app if signed in or has valid offline auth
  if (isSignedIn || (hasOfflineAuth && isOffline)) {
    return <Redirect href={"/"} />;
  }

  // Show loading state
  if (isLoading) {
    return null;
  }

  // If offline but no valid auth data, show notification
  if (isOffline && !hasOfflineAuth && !isLoading) {
    showModal(
      "No Internet Connection",
      "You need to sign in at least once while connected to use the app offline.",
      [{ text: "OK" }],
      "warning",
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
