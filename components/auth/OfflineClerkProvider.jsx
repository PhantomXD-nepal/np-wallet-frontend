import React, { createContext, useContext, useEffect, useState } from "react";
import { ClerkProvider, useUser, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { showModal } from "../extras/customModal";
import NetInfo from "@react-native-community/netinfo";
import {
  saveAuthDataLocally,
  getLocalAuthData,
  clearLocalAuthData,
  updateLastOnlineCheck,
  shouldEnforceOnlineAuth,
} from "../../lib/offlineAuth";

// Create context for offline state
const OfflineAuthContext = createContext({
  isOffline: false,
  canUseOffline: false,
  lastOnlineAuth: null,
  enforceOnlineAuth: false,
});

/**
 * Custom hook to access offline auth context
 */
export const useOfflineAuth = () => useContext(OfflineAuthContext);

/**
 * OfflineClerkProvider - Extends ClerkProvider with offline capabilities
 */
export const OfflineClerkProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [canUseOffline, setCanUseOffline] = useState(false);
  const [lastOnlineAuth, setLastOnlineAuth] = useState(null);
  const [enforceOnlineAuth, setEnforceOnlineAuth] = useState(false);

  // Monitor network status
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

  // Check if offline auth is allowed
  useEffect(() => {
    const checkOfflineAuth = async () => {
      const localAuth = await getLocalAuthData();
      const shouldEnforce = await shouldEnforceOnlineAuth();

      setCanUseOffline(!!localAuth && !localAuth.isExpired);
      setLastOnlineAuth(
        localAuth ? new Date(localAuth.session.lastVerifiedOnline) : null,
      );
      setEnforceOnlineAuth(shouldEnforce);

      if (shouldEnforce && isOffline) {
        showModal(
          "Authentication Required",
          "You've been offline for too long. Please connect to the internet to verify your identity.",
          [{ text: "OK" }],
          "warning",
        );
      }
    };

    checkOfflineAuth();
  }, [isOffline]);

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey="pk_test_bWFnaWNhbC10dW5hLTczLmNsZXJrLmFjY291bnRzLmRldiQ"
    >
      <OfflineAuthHandler>
        <OfflineAuthContext.Provider
          value={{
            isOffline,
            canUseOffline,
            lastOnlineAuth,
            enforceOnlineAuth,
          }}
        >
          {children}
        </OfflineAuthContext.Provider>
      </OfflineAuthHandler>
    </ClerkProvider>
  );
};

/**
 * Component to handle saving auth data when user is authenticated
 */
const OfflineAuthHandler = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [networkState, setNetworkState] = useState({ isConnected: true });

  // Monitor network status for this component too
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState(state);
    });

    return () => unsubscribe();
  }, []);

  // Save auth data when user is online and signed in
  useEffect(() => {
    const saveAuthData = async () => {
      if (isSignedIn && user && networkState.isConnected) {
        try {
          const token = await getToken();

          // Create a session object with necessary data
          const session = {
            token,
            expiresAt: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000,
            ).toISOString(), // 7 days
            lastVerifiedOnline: new Date().toISOString(),
          };

          await saveAuthDataLocally(user, session);
          await updateLastOnlineCheck();
        } catch (error) {
          console.error("Error saving auth data for offline use:", error);
        }
      }
    };

    saveAuthData();
  }, [isSignedIn, user, networkState.isConnected]);

  // Clear local auth data when user signs out
  useEffect(() => {
    if (!isSignedIn && user === null) {
      clearLocalAuthData();
    }
  }, [isSignedIn, user]);

  return <>{children}</>;
};

export default OfflineClerkProvider;
