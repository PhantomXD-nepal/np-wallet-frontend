import SafeScreen from "../components/SafeScreen";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Redirect, Slot } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Slot />
        <Redirect href={"/(auth)/signIn"}></Redirect>
      </SafeScreen>
    </ClerkProvider>
  );
}
