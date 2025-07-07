import { Slot } from "expo-router";
import SafeScreen from "../components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
// We no longer need to import initOfflineSync since we're removing auto-sync

export default function RootLayout() {
  // We've removed the automatic offline sync initialization
  // Sync will now only happen manually when the user taps the sync button

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
