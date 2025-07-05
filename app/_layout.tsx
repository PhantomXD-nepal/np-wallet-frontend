import SafeScreen from "../components/SafeScreen";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Redirect, Slot } from "expo-router";

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={"pk_test_bWFnaWNhbC10dW5hLTczLmNsZXJrLmFjY291bnRzLmRldiQ"}
    >
      <SafeScreen>
        <Slot />
        <Redirect href={"/(auth)/signIn"}></Redirect>
      </SafeScreen>
    </ClerkProvider>
  );
}
