import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";

interface SafeScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SafeScreen: React.FC<SafeScreenProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <View style={[styles.content]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
});

export default SafeScreen;
