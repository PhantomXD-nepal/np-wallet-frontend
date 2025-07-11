import "../lib/webPolyfills"; // Import polyfills first
import { Slot } from "expo-router";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, Platform } from "react";
import ModalProvider from "../components/extras/ModalProvider";
import OfflineClerkProvider from "../components/auth/OfflineClerkProvider";
import OfflineRoutingGuard from "../components/auth/OfflineRoutingGuard";
// We no longer need to import initOfflineSync since we're removing auto-sync

export default function RootLayout() {
  // We've removed the automatic offline sync initialization
  // Sync will now only happen manually when the user taps the sync button

  return (
    <OfflineClerkProvider>
      <ModalProvider>
        <OfflineRoutingGuard>
          <SafeScreen>
            <Slot />
          </SafeScreen>
          <StatusBar style="dark" />
        </OfflineRoutingGuard>
      </ModalProvider>
    </OfflineClerkProvider>
  );
}
