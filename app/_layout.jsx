import { Slot } from "expo-router";
import SafeScreen from "../components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { initOfflineSync } from "../lib/offlineSync";

export default function RootLayout() {
  // Use ref to ensure we only initialize once
  const syncInitialized = useRef(false);

  // Initialize offline sync when app starts
  useEffect(() => {
    if (syncInitialized.current) return;

    syncInitialized.current = true;
    console.log("Initializing offline sync");
    const unsubscribe = initOfflineSync();

    return () => {
      if (unsubscribe) {
        console.log("Cleaning up offline sync");
        unsubscribe();
      }
    };
  }, []);

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey="pk_test_bWFnaWNhbC10dW5hLTczLmNsZXJrLmFjY291bnRzLmRldiQ"
    >
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </ClerkProvider>
  );
}
