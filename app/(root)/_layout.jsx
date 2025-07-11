import { useUser } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { StyleSheet, View, Text } from "react-native";
import { useOfflineAuth } from "../../components/auth/OfflineClerkProvider";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export default function Layout() {
  const { isSignedIn, isLoaded } = useUser();
  const { isOffline, canUseOffline } = useOfflineAuth();
  const [networkState, setNetworkState] = useState({ isConnected: true });

  // Monitor network state
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState(state);
    });

    return () => unsubscribe();
  }, []);

  if (!isLoaded) return null; // this is for a better ux

  // Allow offline access if we have valid cached auth data
  if (!isSignedIn && !canUseOffline) return <Redirect href={"/sign-in"} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarBadgeStyle: {
          backgroundColor: COLORS.primary,
          color: COLORS.card,
          fontSize: 12,
          fontWeight: "bold",
          padding: 5,
          borderRadius: 10,
        },
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <View style={styles.addButtonContainer}>
              <View style={styles.addButton}>
                <Ionicons name="add" size={26} color={COLORS.white} />
              </View>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          title: "Charts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart" size={size} color={color} />
          ),
          tabBarButton: (props) => {
            // Disable charts tab when offline
            if (isOffline) {
              return (
                <View {...props} style={[props.style, { opacity: 0.5 }]}>
                  {props.children}
                  <View style={styles.disabledOverlay}>
                    <Ionicons
                      name="cloud-offline"
                      size={16}
                      color={COLORS.expense}
                    />
                  </View>
                </View>
              );
            }
            return <View {...props}>{props.children}</View>;
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    position: "absolute",
    bottom: 5,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    width: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  disabledOverlay: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 10,
    padding: 2,
    zIndex: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
