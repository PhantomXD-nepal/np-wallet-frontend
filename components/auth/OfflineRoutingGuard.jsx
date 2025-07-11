import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useOfflineAuth } from './OfflineClerkProvider';
import { showModal } from '../extras/customModal';
import { COLORS } from '../../constants/colors';

/**
 * OfflineRoutingGuard - Restricts navigation when offline
 *
 * When offline, only allows access to the home and create screens
 * Shows a message when attempting to navigate to restricted routes
 */
const OfflineRoutingGuard = ({ children }) => {
  const { isOffline, canUseOffline, enforceOnlineAuth } = useOfflineAuth();
  const router = useRouter();
  const pathname = usePathname();

  // List of allowed paths when offline
  const allowedOfflinePaths = [
    '/', // home route
    '/index', // also home
    '/(root)', // root layout
    '/(root)/index', // home with root layout
    '/(root)/create', // create transaction
    '/create', // create transaction alternative path
  ];

  // Check if current path is allowed when offline
  const isCurrentPathAllowed = () => {
    return allowedOfflinePaths.some(path => pathname === path || pathname.startsWith(path));
  };

  useEffect(() => {
    // If user is offline and trying to access a restricted route
    if (isOffline && !isCurrentPathAllowed()) {
      // Redirect to home and show a message
      router.replace('/');

      showModal(
        "Offline Mode",
        "This feature is not available offline. You can only view your transactions and create new ones offline.",
        [{ text: "OK" }],
        "info"
      );
    }

    // If offline auth enforcement is required but user is offline
    if (enforceOnlineAuth && isOffline) {
      showModal(
        "Authentication Required",
        "You've been offline for too long. Please connect to the internet to verify your identity.",
        [{ text: "OK" }],
        "warning"
      );

      // Still allow limited functionality if they have valid offline data
      if (!canUseOffline && !isCurrentPathAllowed()) {
        router.replace('/');
      }
    }
  }, [isOffline, pathname, canUseOffline, enforceOnlineAuth]);

  // Display an offline indicator banner when offline
  if (isOffline) {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You are offline</Text>
        </View>
        {children}
      </View>
    );
  }

  // When online, just render children normally
  return children;
};

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: COLORS.expense,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 999,
  },
  offlineText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default OfflineRoutingGuard;
