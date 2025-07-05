import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import { router } from "expo-router";

export const Header = ({ user }) => {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Handle logout logic here
          console.log("Logout pressed");
        },
      },
    ]);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {/* You can add your logo here */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.usernameText}>
            {user?.firstName ||
              user?.emailAddresses?.[0]?.emailAddress ||
              "User"}
          </Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add_transaction")}
        >
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
